import { Service } from "@token-ring/registry";

export interface Checkpoint {
  id: string | number;
  label: string;
  messageId: string | number;
  currentMessage?: import("@token-ring/ai-client/ChatMessageStorage").ChatMessage;
  createdAt: number;
  timestamp?: number;
}

/**
 * Abstract base class for checkpoint management services.
 * Provides the interface for creating, retrieving, and managing conversation checkpoints.
 */
export default class CheckpointService extends Service {
  name: string = "CheckpointService";
  description: string = "Provides Checkpoint functionality";

  async status(_registry: import("@token-ring/registry").Registry): Promise<object> {
    return {
      active: true,
      service: "CheckpointService",
    } as const;
  }

  async createCheckpoint(
    _label: string,
    _currentMessage: import("@token-ring/ai-client/ChatMessageStorage").ChatMessage,
    _sessionId?: string | number,
  ): Promise<Checkpoint> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  async retrieveCheckpoint(
    _idxOrId: string | number,
    _sessionId?: string | number,
  ): Promise<Checkpoint | null> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }

  async listCheckpoint(_sessionId?: string | number): Promise<Checkpoint[]> {
    throw new Error(
      `The ${this.constructor.name} class is abstract and cannot be used directly. Please use a subclass instead.`,
    );
  }
}
