import { ChatService, HumanInterfaceService } from "@token-ring/chat";
import ChatHistoryService from "../ChatHistoryService.js";

export const description = "/history - Browse chat history";

export async function execute(remainder, registry) {
	const chatService = registry.requireFirstServiceByType(ChatService);
	const humanInterfaceService = registry.requireFirstServiceByType(
		HumanInterfaceService,
	);

	// Get the chat history storage service
	const historyStorage = registry.requireFirstServiceByType(ChatHistoryService);
	try {
		// Get all chat sessions
		const sessions = await historyStorage.listSessions();

		if (!sessions || sessions.length === 0) {
			chatService.systemLine("No chat history found.");
			return;
		}

		// Group sessions by date
		const sessionsByDate = groupSessionsByDate(sessions);

		// Build tree structure for session selection
		const buildHistoryTree = () => {
			const tree = {
				name: "Chat History",
				children: [],
			};

			const sortedDates = Object.keys(sessionsByDate).sort(
				(a, b) => new Date(b) - new Date(a),
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
					value: date,
					hasChildren: true,
					children,
				});
			}

			return tree;
		};

		// Show interactive tree selection
		const selectedSessionId = await humanInterfaceService.askForTreeSelection({
			message: "Select chat sessions to view:",
			tree: buildHistoryTree(),
			multiple: false,
			allowCancel: true,
		});

		if (selectedSessionId) {
			await displaySessionHistory(
				sessions.find(({ id }) => id === selectedSessionId),
				historyStorage,
				chatService,
			);
		} else {
			chatService.systemLine("History browsing cancelled.");
		}
	} catch (error) {
		chatService.errorLine("Error browsing chat history:", error);
	}
}

// Group sessions by date (YYYY-MM-DD format)
function groupSessionsByDate(sessions) {
	const grouped = {};

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
function formatDate(dateString) {
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
function formatTime(timestamp) {
	const date = new Date(timestamp);
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

// Display session history
async function displaySessionHistory(session, historyStorage, chatService) {
	chatService.systemLine(
		`\n=== Session: ${session.title || `Session ${session.id}`} ===`,
	);
	chatService.systemLine(
		`Created: ${new Date(session.createdAt).toLocaleString()}`,
	);

	try {
		// Get recent messages from the session
		const messages = await historyStorage.getRecentMessages(session.id, 10);

		if (messages.length === 0) {
			chatService.systemLine("No messages in this session.");
			return;
		}

		for (const message of messages) {
			if (message.request) {
				chatService.systemLine(`\n👤 User (${formatTime(message.createdAt)}):`);
				chatService.systemLine(message.request);
			}

			if (message.response) {
				chatService.systemLine(`\n🤖 Assistant:`);
				chatService.systemLine(message.response);
			}
		}

		chatService.systemLine(`\n--- End of Session ---\n`);
	} catch (error) {
		chatService.errorLine(
			`Error loading messages for session ${session.id}:`,
			error,
		);
	}
}

export function help() {
	return [
		"/history",
		"  - With no arguments: Browse chat history using interactive tree selection grouped by date",
	];
}
