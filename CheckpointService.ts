import {TokenRingService} from "@tokenring-ai/agent/types";

export interface Checkpoint {
  id: string;
  label: string;
  messageId: string;
  currentMessage?: import("@tokenring-ai/ai-client/ChatMessageStorage").StoredChatMessage;
  createdAt: number;
  timestamp?: number;
}

/**
 * Abstract base class for checkpoint management services.
 * Provides the interface for creating, retrieving, and managing conversation checkpoints.
 */
export default class CheckpointService implements TokenRingService {
  name: string = "CheckpointService";
  description: string = "Provides Checkpoint functionality";

  async createCheckpoint(
    _label: string,
    _currentMessage: import("@tokenring-ai/ai-client/ChatMessageStorage").StoredChatMessage,
    _sessionId?: string,
  ): Promise<Checkpoint> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  async retrieveCheckpoint(
    _idxOrId: string,
    _sessionId?: string,
  ): Promise<Checkpoint | null> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  async listCheckpoint(_sessionId?: string): Promise<Checkpoint[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }
}
