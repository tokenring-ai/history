export { default as ChatHistoryService } from "./ChatHistoryService.ts";
export { default as CheckpointService } from "./CheckpointService.ts";
export * as chatCommands from "./chatCommands.ts";

export const name: string = "@token-ring/history";
export const description: string = "Service that adds history tools to the chat.";
export const version: string = "0.1.0";
