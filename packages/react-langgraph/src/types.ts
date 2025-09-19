import { MessageStatus } from "@assistant-ui/react";
import { ReadonlyJSONObject } from "assistant-stream/utils";

export type LangChainToolCallChunk = {
  index: number;
  id: string;
  name: string;
  args: string;
};

export type LangChainToolCall = {
  id: string;
  name: string;
  args: ReadonlyJSONObject;
  partial_json?: string;
};

export type MessageContentText = {
  type: "text" | "text_delta";
  text: string;
};

export type MessageContentImageUrl = {
  type: "image_url";
  image_url: string | { url: string };
};

export type MessageContentThinking = {
  type: "thinking";
  thinking: string;
};

export type MessageContentReasoningSummaryText = {
  type: "summary_text";
  text: string;
};

export type MessageContentReasoning = {
  type: "reasoning";
  summary: MessageContentReasoningSummaryText[];
};

type MessageContentToolUse = {
  type: "tool_use" | "input_json_delta";
};

type MessageContentComputerCall = {
  type: "computer_call";
  call_id: string;
  id: string;
  action: unknown;
  pending_safety_checks: unknown[];
  index: number;
};

export enum LangGraphKnownEventTypes {
  Messages = "messages",
  MessagesPartial = "messages/partial",
  MessagesComplete = "messages/complete",
  Metadata = "metadata",
  Updates = "updates",
  Info = "info",
  Error = "error",
}

type CustomEventType = string;

export type EventType = LangGraphKnownEventTypes | CustomEventType;

type UserMessageContentComplex = MessageContentText | MessageContentImageUrl;
type AssistantMessageContentComplex =
  | MessageContentText
  | MessageContentImageUrl
  | MessageContentToolUse
  | MessageContentReasoning
  | MessageContentThinking
  | MessageContentComputerCall;

type UserMessageContent = string | UserMessageContentComplex[];
type AssistantMessageContent = string | AssistantMessageContentComplex[];

export type LangChainMessage =
  | {
      id?: string;
      type: "system";
      content: string;
      additional_kwargs?: Record<string, unknown>;
    }
  | {
      id?: string;
      type: "human";
      content: UserMessageContent;
      additional_kwargs?: Record<string, unknown>;
    }
  | {
      id?: string;
      type: "tool";
      content: string;
      tool_call_id: string;
      name: string;
      artifact?: any;
      status: "success" | "error";
    }
  | {
      id?: string;
      type: "ai";
      content: AssistantMessageContent;
      tool_call_chunks?: LangChainToolCallChunk[];
      tool_calls?: LangChainToolCall[];
      status?: MessageStatus;
      additional_kwargs?: {
        reasoning?: MessageContentReasoning;
        tool_outputs?: MessageContentComputerCall[];
      };
    };

export type LangChainMessageChunk = {
  id?: string | undefined;
  type: "AIMessageChunk";
  content?: AssistantMessageContent | undefined;
  tool_call_chunks?: LangChainToolCallChunk[] | undefined;
};

export type LangChainEvent = {
  event:
    | LangGraphKnownEventTypes.MessagesPartial
    | LangGraphKnownEventTypes.MessagesComplete;
  data: LangChainMessage[];
};

type LangGraphTupleMetadata = Record<string, unknown>;

export type LangChainMessageTupleEvent = {
  event: LangGraphKnownEventTypes.Messages;
  data: [LangChainMessageChunk, LangGraphTupleMetadata];
};

export type OnMetadataEventCallback = (
  metadata: unknown,
) => void | Promise<void>;
export type OnInfoEventCallback = (info: unknown) => void | Promise<void>;
export type OnErrorEventCallback = (error: unknown) => void | Promise<void>;
export type OnCustomEventCallback = (
  type: string,
  data: unknown,
) => void | Promise<void>;
