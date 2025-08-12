import packageJSON from './package.json' with { type: 'json' };
export const name = packageJSON.name;
export const version = packageJSON.version;
export const description = packageJSON.description;

export { default as ChatHistoryService } from "./ChatHistoryService.ts";
export { default as CheckpointService } from "./CheckpointService.ts";
export * as chatCommands from "./chatCommands.ts";
