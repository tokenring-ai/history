import {Agent} from "@tokenring-ai/agent";
import {StoredChatSession} from "@tokenring-ai/ai-client/ChatMessageStorage";
import ChatHistoryService from "../ChatHistoryService.ts";

export const description: string = "/history - Browse chat history";

export async function execute(
  _remainder: string | undefined,
  agent: Agent,
): Promise<void> {
  // Get the chat history storage service
  const historyStorage = agent.requireFirstServiceByType(ChatHistoryService);
  try {
    // Get all chat sessions
    const sessions = await historyStorage.listSessions();

    if (!sessions || sessions.length === 0) {
      agent.infoLine("No chat history found.");
      return;
    }

    // Group sessions by date
    const sessionsByDate = groupSessionsByDate(sessions);

    // Build tree structure for session selection
    const buildHistoryTree = () => {
      const tree: any = {
        name: "Chat History",
        children: [],
      };

      const sortedDates = Object.keys(sessionsByDate).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      );

      for (const date of sortedDates) {
        const dateSessions = sessionsByDate[date];
        const children = dateSessions.map((session) => ({
          name: `💬 ${session.title || `Session ${session.id}`} (${formatTime(session.createdAt)})`,
          value: session.id,
          session: session,
        }));

        tree.children.push({
          name: `📅 ${formatDate(date)} (${dateSessions.length} sessions)`,
          //value: date,
          hasChildren: true,
          children,
        });
      }

      return tree;
    };

    // Show interactive tree selection
    const selectedSessionId = await agent.askHuman({
      type: "askForSingleTreeSelection",
      message: "Select chat sessions to view:",
      tree: buildHistoryTree()
    });

    if (selectedSessionId) {
      const selectedSession = sessions.find(({id}) => id === selectedSessionId);
      if (!selectedSession) {
        agent.errorLine(`Session ${selectedSessionId} could not be retrieved.`);
        return;
      }

      await displaySessionHistory(
        selectedSession,
        historyStorage,
        agent,
      );
    } else {
      agent.infoLine("History browsing cancelled.");
    }
  } catch (error) {
    agent.errorLine("Error browsing chat history:", error as Error);
  }
}

// Group sessions by date (YYYY-MM-DD format)
function groupSessionsByDate(
  sessions: Array<Awaited<ReturnType<typeof ChatHistoryService.prototype.listSessions>>[number]>,
): Record<string, typeof sessions> {
  const grouped: Record<string, typeof sessions> = {};

  for (const session of sessions) {
    const date = new Date(session.createdAt).toISOString().split("T")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(session);
  }

  return grouped;
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateString === yesterday.toISOString().split("T")[0]) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

// Format time for display
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Display session history
async function displaySessionHistory(
  session: StoredChatSession,
  historyStorage: ChatHistoryService,
  agent: Agent,
): Promise<void> {
  agent.infoLine(
    `\n=== Session: ${session.title || `Session ${session.id}`} ===`,
  );
  agent.infoLine(
    `Created: ${new Date(session.createdAt).toLocaleString()}`,
  );

  try {
    // Get recent messages from the session
    const messages = await historyStorage.getRecentMessages(session.id, 10);

    if (messages.length === 0) {
      agent.infoLine("No messages in this session.");
      return;
    }

    for (const message of messages) {
      if (message.request) {
        agent.infoLine(`\n👤 User (${formatTime(message.createdAt)}):`);
        agent.infoLine(JSON.stringify(message.request, null, 2));
      }

      if (message.response) {
        agent.infoLine(`\n🤖 Assistant:`);
        agent.infoLine(JSON.stringify(message.response, null, 2));
      }
    }

    agent.infoLine(`\n--- End of Session ---\n`);
  } catch (error) {
    agent.errorLine(
      `Error loading messages for session ${session.id}:`,
      error as Error,
    );
  }
}

// noinspection JSUnusedGlobalSymbols
export function help(): string[] {
  return [
    "/history",
    "  - With no arguments: Browse chat history using interactive tree selection grouped by date",
  ];
}
