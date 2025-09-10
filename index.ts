import {TokenRingPackage} from "@tokenring-ai/agent";
import * as chatCommands from "./chatCommands.ts";
import packageJSON from './package.json' with {type: 'json'};

export const packageInfo: TokenRingPackage = {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  chatCommands
};

export {default as ChatHistoryService} from "./ChatHistoryService.ts";
export {default as CheckpointService} from "./CheckpointService.ts";
