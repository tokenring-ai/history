export function execute(remainder: any, registry: any): Promise<void>;
export function help(): string[];
/**
 * /checkpoint create [label] - stores current previous_response_id as a checkpoint.
 * /checkpoint restore <id> - restores previous_response_id from checkpoint
 * /checkpoint list - shows all checkpoints
 */
export const description: "/checkpoint [create|restore|list] - Create or restore conversation checkpoints to resume chat.";
