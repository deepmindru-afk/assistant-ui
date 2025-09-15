import { useEffect, useRef, useState } from "react";
import {
  createAssistantStreamController,
  ToolCallStreamController,
  unstable_toolResultStream,
  type Tool,
} from "assistant-stream";
import type {
  AssistantTransportCommand,
  AssistantTransportState,
} from "./types";
import { AssistantMetaTransformStream } from "assistant-stream/utils";

const isArgsTextComplete = (argsText: string) => {
  try {
    JSON.parse(argsText);
    return true;
  } catch (e) {
    return false;
  }
};

type UseToolInvocationsParams = {
  state: AssistantTransportState;
  getTools: () => Record<string, Tool> | undefined;
  onResult: (command: AssistantTransportCommand) => void;
};

export function useToolInvocations({
  state,
  getTools,
  onResult,
}: UseToolInvocationsParams): () => void {
  const acRef = useRef<AbortController>(new AbortController());
  const [controller] = useState(() => {
    const [stream, controller] = createAssistantStreamController();
    const transform = unstable_toolResultStream(
      getTools,
      () => acRef.current?.signal ?? new AbortController().signal,
    );
    stream
      .pipeThrough(transform)
      .pipeThrough(new AssistantMetaTransformStream())
      .pipeTo(
        new WritableStream({
          write(chunk) {
            if (chunk.type === "result") {
              onResult({
                type: "add-tool-result",
                toolCallId: chunk.meta.toolCallId,
                toolName: chunk.meta.toolName,
                result: chunk.result,
                isError: chunk.isError,
                ...(chunk.artifact && { artifact: chunk.artifact }),
              });
            }
          },
        }),
      );

    return controller;
  });

  const ignoredToolIds = useRef<Set<string>>(new Set());
  {
    const initialState = useRef(state);
    useEffect(() => {
      initialState.current.messages.forEach((message) => {
        message.content.forEach((content) => {
          if (content.type === "tool-call") {
            ignoredToolIds.current.add(content.toolCallId);
          }
        });
      });
    }, []);
  }

  const lastToolStates = useRef<
    Record<string, { argsText: string; controller: ToolCallStreamController }>
  >({});
  useEffect(() => {
    state.messages.forEach((message) => {
      message.content.forEach((content) => {
        if (content.type === "tool-call") {
          if (ignoredToolIds.current.has(content.toolCallId)) {
            return;
          }
          const lastState = lastToolStates.current[content.toolCallId];
          if (!lastState) {
            const toolCallController = controller.addToolCallPart({
              toolName: content.toolName,
              toolCallId: content.toolCallId,
            });
            toolCallController.argsText.append(content.argsText);
            lastToolStates.current[content.toolCallId] = {
              argsText: content.argsText,
              controller: toolCallController,
            };
          } else {
            if (content.argsText === lastState.argsText) {
              return;
            }

            if (!content.argsText.startsWith(lastState.argsText)) {
              throw new Error(
                `Tool call argsText can only be appended, not updated: ${content.argsText} does not start with ${lastState.argsText}`,
              );
            }

            const argsTextDelta = content.argsText.slice(
              lastState.argsText.length,
            );
            lastState.controller.argsText.append(argsTextDelta);

            if (isArgsTextComplete(content.argsText)) {
              lastState.controller.argsText.close();
              lastState.controller.close();
            }

            lastToolStates.current[content.toolCallId] = {
              argsText: content.argsText,
              controller: lastState.controller,
            };
          }
        }
      });
    });
  }, [state]);

  return () => {
    acRef.current.abort();
    acRef.current = new AbortController();
  };
}
