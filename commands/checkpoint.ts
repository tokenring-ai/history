import {ChatMessageStorage} from "@token-ring/ai-client";
import {HumanInterfaceService} from "@token-ring/chat";
import ChatService from "@token-ring/chat/ChatService";
import CheckpointService from "../CheckpointService.ts";

/**
 * /checkpoint create [label] - stores current previous_response_id as a checkpoint.
 * /checkpoint restore <id> - restores previous_response_id from checkpoint
 * /checkpoint list - shows all checkpoints
 */

export const description: string =
  "/checkpoint [create|restore|list] - Create or restore conversation checkpoints to resume chat.";

export async function execute(
  remainder: string | undefined,
  registry: import("@token-ring/registry").Registry,
): Promise<void> {
  const chatService = registry.requireFirstServiceByType(ChatService);
  const checkpointService =
    registry.requireFirstServiceByType(CheckpointService);
  const chatMessageStorage =
    registry.requireFirstServiceByType(ChatMessageStorage);
  const humanInterfaceService = registry.getFirstServiceByType(
    HumanInterfaceService,
  );

  const [action, ...args] = (remainder || "").trim().split(/\s+/);

  const currentMessage = chatMessageStorage.getCurrentMessage();

  switch (action) {
    case "create": {
      if (!currentMessage) {
        chatService.errorLine(
          "No active chat to checkpoint. Ask at least one question first.",
        );
        return;
      }

      const label = args.join(" ") || `New Checkpoint`;
      const row = await checkpointService.createCheckpoint(
        label,
        currentMessage,
      );

      chatService.systemLine(`Checkpoint created: ${row.id}: ${row.label}`);

      break;
    }
    case "restore": {
      if (!args[0]) {
        chatService.errorLine(
          "Usage: /checkpoint restore <id> (see /checkpoint list for ids)",
        );
        return;
      }

      const row = await checkpointService.retrieveCheckpoint(args[0]);

      if (row) {
        const message = await chatMessageStorage.retrieveMessageById(
          row.messageId,
        );
        if (message) {
          chatService.systemLine(`Checkpoint ${row.id} loaded: ${row.label}`);
          chatMessageStorage.setCurrentMessage(message);
        } else {
          chatService.errorLine(
            `Message ${row.messageId} not found. Checkpoint ${row.id} exists, but no message loaded.`,
          );
        }
      } else {
        chatService.errorLine(`Checkpoint ${args[0]} not found.`);
        return;
      }

      break;
    }
    default: {
      const savedCheckpoints = await checkpointService.listCheckpoint();
      if (savedCheckpoints.length === 0) {
        chatService.systemLine(
          "No checkpoints saved. Use /checkpoint create to make one.",
        );
        break;
      }

      // Group checkpoints by date (YYYY-MM-DD)
      const grouped: Record<string, typeof savedCheckpoints> = {};
      for (const cp of savedCheckpoints) {
        const date = new Date(cp.createdAt).toISOString().slice(0, 10);
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(cp);
      }

      // Construct tree for selection
      const tree = {
        name: "Checkpoint Selection",
        children: Object.keys(grouped)
          .sort((a, b) => b.localeCompare(a)) // Most recent first
          .map((date) => ({
            name: `📅 ${date} (${grouped[date].length} checkpoints)`,
            value: date,
            hasChildren: true,
            children: grouped[date]
              .sort((a, b) => b.createdAt - a.createdAt) // Most recent first within date
              .map((cp, _index) => ({
                name: `⏰ ${new Date(cp.createdAt).toLocaleTimeString()} - ${cp.label}`,
                value: cp.id,
              })),
          })),
      } as const;

      // Show interactive tree selection
      try {
        if (!humanInterfaceService) {
          chatService.errorLine(
            "HumanInterfaceService not found. Checkpoint selection not available.",
          );
          return;
        }

        const selectedId = await humanInterfaceService.askForSingleTreeSelection({
          message: "Select a checkpoint to restore:",
          tree
        });

        if (!selectedId) {
          chatService.systemLine(
            "Checkpoint selection cancelled. No changes made.",
          );
          return;
        }

        const row = await checkpointService.retrieveCheckpoint(selectedId);

        if (!row) {
          chatService.errorLine(`Checkpoint ${selectedId} not found.`);
          return;
        }

        const message = await chatMessageStorage.retrieveMessageById(
          row.messageId,
        );

        if (!message) {
          chatService.errorLine(
            `Message ${row.messageId} not found. Checkpoint ${row.id} exists, but no message loaded.`,
          );
          return;
        }

        chatService.systemLine(`Checkpoint ${row.id} loaded: ${row.label}`);
        chatMessageStorage.setCurrentMessage(message);
      } catch (error) {
        chatService.errorLine(`Error during checkpoint selection: ${error}`);
      }
      break;
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export function help(): string[] {
  return [
    "/checkpoint [action] [args...] - Create or restore conversation checkpoints",
    "  Actions:",
    "    create [label]     - Create checkpoint with optional label",
    "    restore <id>       - Restore specific checkpoint by ID",
    "    list               - Interactive tree selection of checkpoints",
    "",
    "  Examples:",
    "    /checkpoint create           - Create checkpoint with default label",
    "    /checkpoint create 'My Fix'  - Create checkpoint with custom label",
    "    /checkpoint restore abc123   - Restore specific checkpoint",
    "    /checkpoint list             - Show interactive checkpoint browser",
  ];
}
