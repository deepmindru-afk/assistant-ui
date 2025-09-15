"use client";

import {
  ReadonlyJSONObject,
  ReadonlyJSONValue,
  asAsyncIterableStream,
} from "assistant-stream/utils";
import { AppendMessage } from "../../../types";
import { useExternalStoreRuntime } from "../external-store/useExternalStoreRuntime";
import { AssistantRuntime } from "../../runtime/AssistantRuntime";
import { AddToolResultOptions } from "../core";
import { useState, useRef, useMemo } from "react";
import {
  AssistantMessageAccumulator,
  DataStreamDecoder,
  unstable_createInitialMessage as createInitialMessage,
} from "assistant-stream";
import {
  AssistantTransportOptions,
  AddMessageCommand,
  AddToolResultCommand,
  UserMessagePart,
  QueuedCommand,
} from "./types";
import { useCommandQueue, getPendingCommands } from "./commandQueue";
import { useRunManager } from "./runManager";
import { useConvertedState } from "./useConvertedState";
import { useToolInvocations } from "./useToolInvocations";
import { toAISDKTools, getEnabledTools, createRequestHeaders } from "./utils";

export const useAssistantTransportRuntime = <T,>(
  options: AssistantTransportOptions<T>,
): AssistantRuntime => {
  const agentStateRef = useRef(options.initialState);
  const [, rerender] = useState(0);
  const commandQueue = useCommandQueue({
    onQueue: () => runManager.schedule(),
  });

  const runManager = useRunManager({
    onRun: async (signal: AbortSignal) => {
      const commands: QueuedCommand[] = commandQueue.flush();
      if (commands.length === 0) throw new Error("No commands to send");

      const headers = await createRequestHeaders(options.headers);
      const context = runtime.thread.getModelContext();

      const response = await fetch(options.api, {
        method: "POST",
        headers,
        body: JSON.stringify({
          commands,
          state: agentStateRef.current,
          system: context.system,
          tools: context.tools
            ? toAISDKTools(getEnabledTools(context.tools))
            : undefined,
          ...context.callSettings,
          ...context.config,
          ...options.body,
        }),
        signal,
      });

      options.onResponse?.(response);

      if (!response.ok) {
        throw new Error(`Status ${response.status}: ${await response.text()}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const stream = response.body
        .pipeThrough(new DataStreamDecoder())
        .pipeThrough(
          new AssistantMessageAccumulator({
            initialMessage: createInitialMessage({
              unstable_state:
                (agentStateRef.current as ReadonlyJSONValue) ?? null,
            }),
          }),
        );

      let markedDelivered = false;

      for await (const chunk of asAsyncIterableStream(stream)) {
        if (chunk.metadata.unstable_state === agentStateRef.current) continue;

        if (!markedDelivered) {
          commandQueue.markDelivered();
          markedDelivered = true;
        }

        agentStateRef.current = chunk.metadata.unstable_state as T;
        rerender((prev) => prev + 1);
      }
    },
    onFinish: options.onFinish,
    onError: (error) => {
      if (error instanceof Error && error.name === "AbortError") {
        const cmds = [
          ...commandQueue.state.inTransit,
          ...commandQueue.state.queued,
        ];
        options.onCancel?.({
          commands: cmds,
          updateState: (updater) => {
            agentStateRef.current = updater(agentStateRef.current);
            rerender((prev) => prev + 1);
          },
        });

        commandQueue.reset();
      } else {
        const cmds = [...commandQueue.state.inTransit];
        options.onError?.(error as Error, {
          commands: cmds,
          updateState: (updater) => {
            agentStateRef.current = updater(agentStateRef.current);
            rerender((prev) => prev + 1);
          },
        });
        commandQueue.markDelivered();
      }
    },
  });

  // Reactive conversion of agent state + connection metadata → UI state
  const pendingCommands = useMemo(
    () => getPendingCommands(commandQueue.state),
    [commandQueue.state],
  );
  const converted = useConvertedState(
    options.converter,
    agentStateRef.current,
    pendingCommands,
    runManager.isRunning,
  );

  // Create runtime
  const runtime = useExternalStoreRuntime({
    isRunning: converted.isRunning,
    messages: converted.messages,
    adapters: options.adapters,
    onNew: async (message: AppendMessage): Promise<void> => {
      // Convert AppendMessage to AddMessageCommand
      const parts: UserMessagePart[] = [];

      for (const content of message.content) {
        if (content.type === "text") {
          parts.push({ type: "text", text: content.text });
        } else if (content.type === "image") {
          parts.push({ type: "image", image: content.image });
        }
      }

      const command: AddMessageCommand = {
        type: "add-message",
        message: {
          role: "user",
          parts,
        },
      };

      commandQueue.enqueue(command);
    },
    onCancel: async () => {
      runManager.cancel();
      abortToolInvocations();
    },
    onAddToolResult: async (
      toolOptions: AddToolResultOptions,
    ): Promise<void> => {
      const command: AddToolResultCommand = {
        type: "add-tool-result",
        toolCallId: toolOptions.toolCallId,
        result: toolOptions.result as ReadonlyJSONObject,
        toolName: toolOptions.toolName,
        isError: toolOptions.isError,
        ...(toolOptions.artifact && { artifact: toolOptions.artifact }),
      };

      commandQueue.enqueue(command);
    },
  });

  const abortToolInvocations = useToolInvocations({
    state: converted,
    getTools: () => runtime.thread.getModelContext().tools,
    onResult: commandQueue.enqueue,
  });

  return runtime;
};

// moved to useConvertedState.ts
