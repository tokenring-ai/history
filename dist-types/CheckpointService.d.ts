/**
 * @typedef {Object} Checkpoint
 * @property {string|number} id - Unique checkpoint identifier
 * @property {string} label - Human-readable checkpoint label
 * @property {string|number} messageId - ID of the message this checkpoint references
 * @property {import('@token-ring/ai-client/ChatMessageStorage').ChatMessage} [currentMessage] - Complete message object at checkpoint time
 * @property {number} createdAt - Checkpoint creation timestamp in milliseconds
 * @property {number} [timestamp] - Alternative timestamp field for compatibility
 */
/**
 * Abstract base class for checkpoint management services.
 * Provides the interface for creating, retrieving, and managing conversation checkpoints.
 *
 * Checkpoints allow users to:
 * - Save specific points in a conversation for later reference
 * - Return to previous conversation states
 * - Branch conversations from saved points
 * - Preserve important conversation milestones
 *
 * @abstract
 * @extends Service
 */
export default class CheckpointService extends Service {
    /**
     * Reports the status of the service.
     * @param {import('@token-ring/registry').TokenRingRegistry} registry - The package registry
     * @returns {Promise<Object>} Status information
     */
    status(_registry: any): Promise<any>;
    /**
     * Creates a new checkpoint for the current conversation state.
     *
     * @abstract
     * @param {string} label - Human-readable label for the checkpoint
     * @param {import('@token-ring/ai-client/ChatMessageStorage').ChatMessage} currentMessage - The current message to checkpoint
     * @param {string|number} [sessionId] - Optional session ID for implementations that require it
     * @returns {Promise<Checkpoint>} The created checkpoint
     */
    createCheckpoint(_label: any, _currentMessage: any, _sessionId: any): Promise<Checkpoint>;
    /**
     * Retrieves a checkpoint by its identifier or index.
     *
     * @abstract
     * @param {string|number} idxOrId - The checkpoint identifier or index
     * @param {string|number} [sessionId] - Optional session ID for implementations that require it
     * @returns {Promise<Checkpoint|null>} The retrieved checkpoint or null if not found
     */
    retrieveCheckpoint(_idxOrId: any, _sessionId: any): Promise<Checkpoint | null>;
    /**
     * Lists all checkpoints, typically ordered by creation time (newest first).
     *
     * @abstract
     * @param {string|number} [sessionId] - Optional session ID for implementations that require it
     * @returns {Promise<Array<Checkpoint>>} Array of checkpoints
     */
    listCheckpoint(_sessionId: any): Promise<Array<Checkpoint>>;
}
export type Checkpoint = {
    /**
     * - Unique checkpoint identifier
     */
    id: string | number;
    /**
     * - Human-readable checkpoint label
     */
    label: string;
    /**
     * - ID of the message this checkpoint references
     */
    messageId: string | number;
    /**
     * - Complete message object at checkpoint time
     */
    currentMessage?: import("@token-ring/ai-client/ChatMessageStorage").ChatMessage;
    /**
     * - Checkpoint creation timestamp in milliseconds
     */
    createdAt: number;
    /**
     * - Alternative timestamp field for compatibility
     */
    timestamp?: number;
};
import { Service } from "@token-ring/registry";
