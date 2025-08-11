import { Service } from "@token-ring/registry";

export interface ChatSession {
  id: string | number;
  title: string;
  createdAt: number;
  lastActivity?: number;
  previewText?: string;
}

export interface ChatHistoryMessage {
  id: string | number;
  sessionId: string | number;
  previousMessageId?: string | number;
  request: string | Record<string, any>;
  response?: string | Record<string, any>;
  cumulativeInputLength?: number;
  priorState?: string | Record<string, any>;
  createdAt: number;
  updatedAt?: number;
  timestamp?: number;
  content?: string;
  text?: string;
}

/**
 * Abstract base class for chat history management services.
 * Provides the interface for storing, retrieving, and managing chat sessions and their message history.
 */
export default class ChatHistoryService extends Service {
  name: string = "ChatHistoryService";
  description: string = "Provides ChatHistory functionality";

  /**
   * Reports the status of the service.
   */
  async status(_registry: import("@token-ring/registry").Registry): Promise<object> {
    return {
      active: true,
      service: "ChatHistoryService",
    } as const;
  }

  /**
   * Returns all chat sessions, typically ordered by most recent activity.
   */
  async listSessions(): Promise<ChatSession[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the complete thread tree for a session, showing the conversation flow.
   */
  async getThreadTree(_sessionId: string | number): Promise<ChatHistoryMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the N most recent messages from a session.
   * Messages are typically returned in chronological order (oldest first).
   */
  async getRecentMessages(
    _sessionId: string | number,
    _limit: number = 10,
  ): Promise<ChatHistoryMessage[]> {
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
    _sessionId?: string | number,
  ): Promise<ChatHistoryMessage[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  /**
   * Gets the complete chat history leading up to and including a specific message.
   * This reconstructs the conversation context for a given message.
   */
  async getChatHistoryByMessageId(
    _messageId: string | number,
  ): Promise<ChatHistoryMessage[]> {
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
