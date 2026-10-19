export type TaskFn = (context: Record<string, unknown>) => Promise<unknown> | unknown;

export interface TaskDefinition {
  id: string;
  dependencies: string[];
  run: TaskFn;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
