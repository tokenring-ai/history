import {TokenRingService} from "@tokenring-ai/agent/types";
import {StoredChatMessage, StoredChatSession} from "@tokenring-ai/ai-client/ChatMessageStorage";


/**
 * Abstract base class for chat history management services.
 * Provides the interface for storing, retrieving, and managing chat sessions and their message history.
 */
export default class ChatHistoryService implements TokenRingService {
  name: string = "ChatHistoryService";
  description: string = "Provides ChatHistory functionality";

  /**
   * Returns all chat sessions, typically ordered by the most recent activity.
   */
  async listSessions(): Promise<StoredChatSession[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the complete thread tree for a session, showing the conversation flow.
   */
  async getThreadTree(_sessionId: string): Promise<StoredChatMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the N most recent messages from a session.
   * Messages are typically returned in chronological order (oldest first).
   */
  async getRecentMessages(
    _sessionId: string,
    _limit: number = 10,
  ): Promise<StoredChatMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Searches for messages containing the specified keyword.
   * Searches both request and response content.
   */
  async searchMessages(
    _keyword: string,
    _sessionId?: string,
  ): Promise<StoredChatMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the complete chat history leading up to and including a specific message.
   * This reconstructs the conversation context for a given message.
   */
  async getChatHistoryByMessageId(
    _messageId: string,
  ): Promise<StoredChatMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Closes any resources (database connections, file handles, etc.) used by the service.
   * Should be called when the service is no longer needed.
   */
  close(): void {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }
}
