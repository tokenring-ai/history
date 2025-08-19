# @token-ring/history

History and checkpoint services for Token Ring. This package defines abstract service interfaces and chat commands for
browsing chat history and creating/restoring conversation checkpoints. Concrete storage backends (e.g., SQLite) can
implement these interfaces and be registered in your application.

## What it provides

- ChatHistoryService (abstract)
- Interface for listing chat sessions and retrieving their messages/history.
- Used by the /history command to browse and display past conversations.
- CheckpointService (abstract)
- Interface for creating, listing, and restoring checkpoints that point to a specific message within a chat session.
- Used by the /checkpoint command to quickly resume work from earlier points in a conversation.
- chatCommands
- /history: Interactive browsing of chat sessions grouped by date; displays recent messages from a selected session.
- /checkpoint: Create, list, and restore checkpoints.

This package does not persist data by itself. You must register a concrete implementation of these services. See the
“Concrete implementations” section below.

## Exports

- name, version, description (from package.json)
- ChatHistoryService (abstract base class)
- CheckpointService (abstract base class)
- chatCommands
- checkpoint
- history

File map:

- ChatHistoryService: pkg/history/ChatHistoryService.ts
- CheckpointService: pkg/history/CheckpointService.ts
- Chat commands: pkg/history/commands/{history.ts, checkpoint.ts}
- Export barrel: pkg/history/index.ts

## ChatHistoryService (abstract)

Defines the interface for chat history management:

- listSessions(): Promise<StoredChatSession[]>
- getThreadTree(sessionId): Promise<StoredChatMessage[]>
- getRecentMessages(sessionId, limit=10): Promise<StoredChatMessage[]>
- searchMessages(keyword, sessionId?): Promise<StoredChatMessage[]>
- getChatHistoryByMessageId(messageId): Promise<StoredChatMessage[]>
- close(): void

Notes:

- StoredChatSession and StoredChatMessage are imported types from @token-ring/ai-client/ChatMessageStorage.
- The default methods throw; register a concrete implementation in your Registry.

## CheckpointService (abstract)

Defines the interface for managing checkpoints tied to chat messages:

- createCheckpoint(label, currentMessage, sessionId?): Promise<Checkpoint>
- retrieveCheckpoint(idxOrId, sessionId?): Promise<Checkpoint | null>
- listCheckpoint(sessionId?): Promise<Checkpoint[]>

Checkpoint shape:

- id: string
- label: string
- messageId: string
- currentMessage?: StoredChatMessage
- createdAt: number
- timestamp?: number

As with ChatHistoryService, these methods throw by default and must be implemented in a concrete service.

## Chat commands

/history

- Description: Browse chat history using an interactive tree grouped by date. Lets you pick a session and then prints
  the last N messages (default 10) with a simple role-based display.
- Requirements: A ChatService and HumanInterfaceService must be registered, and a ChatHistoryService implementation must
  be available in the registry.

/checkpoint [create|restore|list]

- create [label]: Creates a checkpoint for the current message (previous response) with an optional label.
- restore <id>: Restores the conversation to the message referenced by the checkpoint id (sets current message in
  ChatMessageStorage).
- list (default behavior): Presents an interactive tree of checkpoints grouped by date to select and restore.
- Requirements: ChatService, ChatMessageStorage, and a CheckpointService implementation. If HumanInterfaceService is
  available, it will show an interactive selection tree for listing/restoring.

## Concrete implementations

This package defines abstract services only. For persistence, use one of the storage packages that implement these
interfaces. For example:

- @token-ring/sqlite-storage
- SQLiteChatHistoryStorage: A concrete history storage backend compatible with ChatHistoryService.
- SQLiteCLIHistoryStorage: A CLI history storage (e.g., for shell-like histories).

Ensure your application registers the appropriate storage services so that ChatHistoryService and CheckpointService
resolve via the Registry.

## Example: registering services

```ts
import {ServiceRegistry} from "@token-ring/registry";
import {ChatService, HumanInterfaceService} from "@token-ring/chat";
import {ChatMessageStorage} from "@token-ring/ai-client";
import {ChatHistoryService, CheckpointService, chatCommands} from "@token-ring/history";
// Import your concrete implementations, e.g., from @token-ring/sqlite-storage
import {SQLiteChatHistoryStorage} from "@token-ring/sqlite-storage";

const registry = new ServiceRegistry();
await registry.start();

await registry.services.addServices(
  new ChatService({personas: {/*...*/}}),
  new HumanInterfaceService(),
  new ChatMessageStorage(),
  // Register a concrete implementation that satisfies ChatHistoryService
  new SQLiteChatHistoryStorage(),
  // Register your checkpoint implementation (example placeholder)
  // new SQLiteCheckpointService(),
);

// Use commands via ChatService
await chatCommands.history.execute(undefined, registry);
await chatCommands.checkpoint.execute("create My checkpoint", registry);
```

## API summary

Classes

- ChatHistoryService extends Service
- status(registry): reports active status
- listSessions(), getRecentMessages(), getThreadTree(), searchMessages(), getChatHistoryByMessageId(), close()
- CheckpointService extends Service
- status(registry): reports active status
- createCheckpoint(), retrieveCheckpoint(), listCheckpoint()

Commands

- chatCommands.history
- execute(remainder, registry): renders an interactive tree of sessions and displays recent messages
- help(): string[]
- chatCommands.checkpoint
- execute(remainder, registry): handles create/restore/list flows
- help(): string[]

## Dependencies and peers

This package relies on types and services from peer packages:

- @token-ring/registry (Service base and Registry)
- @token-ring/chat (ChatService, HumanInterfaceService)
- @token-ring/ai-client (ChatMessageStorage types and current message handling)

## Notes and limitations

- This package is storage-agnostic; persistence is provided by other packages.
- Interactive selection in /history and /checkpoint list requires a HumanInterfaceService to be registered; otherwise,
  selection features may be unavailable.
- The number of messages shown in /history is currently set by the command implementation (last 10 messages).

## License

MIT
