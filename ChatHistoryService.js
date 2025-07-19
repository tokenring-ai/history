import { Service } from "@token-ring/registry";

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
 /** @type {string} */
 name = "ChatHistoryService";
 
 /** @type {string} */
 description = "Provides ChatHistory functionality";

 /**
  * Reports the status of the service.
  * @param {import('@token-ring/registry').TokenRingRegistry} registry - The package registry
  * @returns {Promise<Object>} Status information
  */
 async status(registry) {
  return {
   active: true,
   service: "ChatHistoryService"
  };
 }

 /**
  * Returns all chat sessions, typically ordered by most recent activity.
  * 
  * @abstract
  * @returns {Promise<Array<ChatSession>>} Array of chat sessions
  */
 async listSessions() {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }

 /**
  * Gets the complete thread tree for a session, showing the conversation flow.
  * This includes all messages in the session with their relationships.
  * 
  * @abstract
  * @param {string|number} sessionId - The session identifier
  * @returns {Promise<Array<ChatHistoryMessage>>} Array of messages forming the thread tree
  */
 async getThreadTree(sessionId) {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }

 /**
  * Gets the N most recent messages from a session.
  * Messages are typically returned in chronological order (oldest first).
  * 
  * @abstract
  * @param {string|number} sessionId - The session identifier
  * @param {number} [limit=10] - Maximum number of messages to return
  * @returns {Promise<Array<ChatHistoryMessage>>} Array of recent messages
  */
 async getRecentMessages(sessionId, limit = 10) {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }

 /**
  * Searches for messages containing the specified keyword.
  * Searches both request and response content.
  * 
  * @abstract
  * @param {string} keyword - The keyword to search for
  * @param {string|number} [sessionId] - Optional session ID to limit search scope
  * @returns {Promise<Array<ChatHistoryMessage>>} Array of matching messages
  */
 async searchMessages(keyword, sessionId) {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }

 /**
  * Gets the complete chat history leading up to and including a specific message.
  * This reconstructs the conversation context for a given message.
  * 
  * @abstract
  * @param {string|number} messageId - The message identifier
  * @returns {Promise<Array<ChatHistoryMessage>>} Array of messages in the conversation history
  */
 async getChatHistoryByMessageId(messageId) {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }

 /**
  * Closes any resources (database connections, file handles, etc.) used by the service.
  * Should be called when the service is no longer needed.
  * 
  * @abstract
  * @returns {void}
  */
 close() {
  throw new Error(`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`);
 }
}