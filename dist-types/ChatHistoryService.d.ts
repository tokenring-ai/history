/**
 * @typedef {Object} ChatSession
 * @property {string|number} id - Unique session identifier
 * @property {string} title - Human-readable session title
 * @property {number} createdAt - Session creation timestamp in milliseconds
 * @property {number} [lastActivity] - Last activity timestamp in milliseconds
 * @property {string} [previewText] - Preview text for the session
 */
/**
 * @typedef {Object} ChatHistoryMessage
 * @property {string|number} id - Unique message identifier
 * @property {string|number} sessionId - Session this message belongs to
 * @property {string|number} [previousMessageId] - ID of the previous message in the conversation chain
 * @property {string|Object} request - The original request data (JSON string or object)
 * @property {string|Object} [response] - The response data (JSON string or object)
 * @property {number} [cumulativeInputLength] - Cumulative input length up to this message
 * @property {string|Object} [priorState] - Prior state information
 * @property {number} createdAt - Message creation timestamp in milliseconds
 * @property {number} [updatedAt] - Message update timestamp in milliseconds
 * @property {number} [timestamp] - Alternative timestamp field for compatibility
 * @property {string} [content] - Message content for simple text messages
 * @property {string} [text] - Alternative text field for compatibility
 */
/**
 * Abstract base class for chat history management services.
 * Provides the interface for storing, retrieving, and managing chat sessions and their message history.
 *
 * This service handles:
 * - Chat session management (listing, creating, organizing)
 * - Message history retrieval and organization
 * - Thread tree construction for conversation flows
 * - Message search functionality
 * - Historical context reconstruction
 *
 * @abstract
 * @extends Service
 */
export default class ChatHistoryService extends Service {
    /**
     * Reports the status of the service.
     * @param {import('@token-ring/registry').TokenRingRegistry} registry - The package registry
     * @returns {Promise<Object>} Status information
     */
    status(_registry: any): Promise<any>;
    /**
     * Returns all chat sessions, typically ordered by most recent activity.
     *
     * @abstract
     * @returns {Promise<Array<ChatSession>>} Array of chat sessions
     */
    listSessions(): Promise<Array<ChatSession>>;
    /**
     * Gets the complete thread tree for a session, showing the conversation flow.
     * This includes all messages in the session with their relationships.
     *
     * @abstract
     * @param {string|number} sessionId - The session identifier
     * @returns {Promise<Array<ChatHistoryMessage>>} Array of messages forming the thread tree
     */
    getThreadTree(_sessionId: any): Promise<Array<ChatHistoryMessage>>;
    /**
     * Gets the N most recent messages from a session.
     * Messages are typically returned in chronological order (oldest first).
     *
     * @abstract
     * @param {string|number} sessionId - The session identifier
     * @param {number} [limit=10] - Maximum number of messages to return
     * @returns {Promise<Array<ChatHistoryMessage>>} Array of recent messages
     */
    getRecentMessages(_sessionId: any, _limit?: number): Promise<Array<ChatHistoryMessage>>;
    /**
     * Searches for messages containing the specified keyword.
     * Searches both request and response content.
     *
     * @abstract
     * @param {string} keyword - The keyword to search for
     * @param {string|number} [sessionId] - Optional session ID to limit search scope
     * @returns {Promise<Array<ChatHistoryMessage>>} Array of matching messages
     */
    searchMessages(_keyword: any, _sessionId: any): Promise<Array<ChatHistoryMessage>>;
    /**
     * Gets the complete chat history leading up to and including a specific message.
     * This reconstructs the conversation context for a given message.
     *
     * @abstract
     * @param {string|number} messageId - The message identifier
     * @returns {Promise<Array<ChatHistoryMessage>>} Array of messages in the conversation history
     */
    getChatHistoryByMessageId(_messageId: any): Promise<Array<ChatHistoryMessage>>;
    /**
     * Closes any resources (database connections, file handles, etc.) used by the service.
     * Should be called when the service is no longer needed.
     *
     * @abstract
     * @returns {void}
     */
    close(): void;
}
export type ChatSession = {
    /**
     * - Unique session identifier
     */
    id: string | number;
    /**
     * - Human-readable session title
     */
    title: string;
    /**
     * - Session creation timestamp in milliseconds
     */
    createdAt: number;
    /**
     * - Last activity timestamp in milliseconds
     */
    lastActivity?: number;
    /**
     * - Preview text for the session
     */
    previewText?: string;
};
export type ChatHistoryMessage = {
    /**
     * - Unique message identifier
     */
    id: string | number;
    /**
     * - Session this message belongs to
     */
    sessionId: string | number;
    /**
     * - ID of the previous message in the conversation chain
     */
    previousMessageId?: string | number;
    /**
     * - The original request data (JSON string or object)
     */
    request: string | any;
    /**
     * - The response data (JSON string or object)
     */
    response?: string | any;
    /**
     * - Cumulative input length up to this message
     */
    cumulativeInputLength?: number;
    /**
     * - Prior state information
     */
    priorState?: string | any;
    /**
     * - Message creation timestamp in milliseconds
     */
    createdAt: number;
    /**
     * - Message update timestamp in milliseconds
     */
    updatedAt?: number;
    /**
     * - Alternative timestamp field for compatibility
     */
    timestamp?: number;
    /**
     * - Message content for simple text messages
     */
    content?: string;
    /**
     * - Alternative text field for compatibility
     */
    text?: string;
};
import { Service } from "@token-ring/registry";
