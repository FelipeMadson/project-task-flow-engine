import { DagResolver } from './dag.ts';
import type { TaskDefinition, TaskFn } from './types.ts';

export class TaskFlowEngine {
  private tasks = new Map<string, TaskDefinition>();

  addTask(id: string, run: TaskFn, dependencies: string[] = []): void {
    if (this.tasks.has(id)) {
      throw new Error(`Tarefa com ID duplicado: ${id}`);
    }
    this.tasks.set(id, { id, run, dependencies });
  }

  async execute(): Promise<Record<string, unknown>> {
    const levels = DagResolver.resolveOrder(this.tasks);
    const context: Record<string, unknown> = {};

    for (const level of levels) {
      // Execução paralela de nós irmãos sem dependência mútua
      const promises = level.map(async taskId => {
        const task = this.tasks.get(taskId)!;
        const result = await task.run(context);
        context[taskId] = result;
      });

      await Promise.all(promises);
    }

    return context;
  }
}
