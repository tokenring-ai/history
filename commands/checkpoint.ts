import {Agent} from "@tokenring-ai/agent";
import {ChatMessageStorage} from "@tokenring-ai/ai-client";
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
  agent: Agent,
): Promise<void> {
  const checkpointService =
    agent.requireFirstServiceByType(CheckpointService);
  const chatMessageStorage =
    agent.requireFirstServiceByType(ChatMessageStorage);

  const [action, ...args] = (remainder || "").trim().split(/\s+/);

  const currentMessage = chatMessageStorage.getCurrentMessage();

  switch (action) {
    case "create": {
      if (!currentMessage) {
        agent.errorLine(
          "No active chat to checkpoint. Ask at least one question first.",
        );
        return;
      }

      const label = args.join(" ") || `New Checkpoint`;
      const row = await checkpointService.createCheckpoint(
        label,
        currentMessage,
      );

      agent.infoLine(`Checkpoint created: ${row.id}: ${row.label}`);

      break;
    }
    case "restore": {
      if (!args[0]) {
        agent.errorLine(
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
          agent.infoLine(`Checkpoint ${row.id} loaded: ${row.label}`);
          chatMessageStorage.setCurrentMessage(message);
        } else {
          agent.errorLine(
            `Message ${row.messageId} not found. Checkpoint ${row.id} exists, but no message loaded.`,
          );
        }
      } else {
        agent.errorLine(`Checkpoint ${args[0]} not found.`);
        return;
      }

      break;
    }
    default: {
      const savedCheckpoints = await checkpointService.listCheckpoint();
      if (savedCheckpoints.length === 0) {
        agent.infoLine(
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

        const selectedId = await agent.askHuman({
          type: "askForSingleTreeSelection",
          message: "Select a checkpoint to restore:",
          tree
        });

        if (!selectedId) {
          agent.infoLine(
            "Checkpoint selection cancelled. No changes made.",
          );
          return;
        }

        const row = await checkpointService.retrieveCheckpoint(selectedId);

        if (!row) {
          agent.errorLine(`Checkpoint ${selectedId} not found.`);
          return;
        }

        const message = await chatMessageStorage.retrieveMessageById(
          row.messageId,
        );

        if (!message) {
          agent.errorLine(
            `Message ${row.messageId} not found. Checkpoint ${row.id} exists, but no message loaded.`,
          );
          return;
        }

        agent.infoLine(`Checkpoint ${row.id} loaded: ${row.label}`);
        chatMessageStorage.setCurrentMessage(message);
      } catch (error) {
        agent.errorLine(`Error during checkpoint selection: ${error}`);
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
