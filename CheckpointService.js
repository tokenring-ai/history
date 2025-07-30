import { Service } from "@token-ring/registry";

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
	/** @type {string} */
	name = "CheckpointService";

	/** @type {string} */
	description = "Provides Checkpoint functionality";

	/**
	 * Reports the status of the service.
	 * @param {import('@token-ring/registry').TokenRingRegistry} registry - The package registry
	 * @returns {Promise<Object>} Status information
	 */
	async status(_registry) {
		return {
			active: true,
			service: "CheckpointService",
		};
	}

	/**
	 * Creates a new checkpoint for the current conversation state.
	 *
	 * @abstract
	 * @param {string} label - Human-readable label for the checkpoint
	 * @param {import('@token-ring/ai-client/ChatMessageStorage').ChatMessage} currentMessage - The current message to checkpoint
	 * @param {string|number} [sessionId] - Optional session ID for implementations that require it
	 * @returns {Promise<Checkpoint>} The created checkpoint
	 */
	async createCheckpoint(_label, _currentMessage, _sessionId) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Retrieves a checkpoint by its identifier or index.
	 *
	 * @abstract
	 * @param {string|number} idxOrId - The checkpoint identifier or index
	 * @param {string|number} [sessionId] - Optional session ID for implementations that require it
	 * @returns {Promise<Checkpoint|null>} The retrieved checkpoint or null if not found
	 */
	async retrieveCheckpoint(_idxOrId, _sessionId) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}

	/**
	 * Lists all checkpoints, typically ordered by creation time (newest first).
	 *
	 * @abstract
	 * @param {string|number} [sessionId] - Optional session ID for implementations that require it
	 * @returns {Promise<Array<Checkpoint>>} Array of checkpoints
	 */
	async listCheckpoint(_sessionId) {
		throw new Error(
			`The ${import.meta.filename} class is abstract and cannot be used directly. Please use a subclass instead.`,
		);
	}
}
