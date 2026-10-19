import type { TaskDefinition } from './types.ts';

export class DagResolver {
  static resolveOrder(tasks: Map<string, TaskDefinition>): string[][] {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const [id] of tasks) {
      inDegree.set(id, 0);
      adjList.set(id, []);
    }

    for (const [id, task] of tasks) {
      for (const dep of task.dependencies) {
        if (!tasks.has(dep)) {
          throw new Error(`Dependência não encontrada: "${dep}" exigida por "${id}"`);
        }
        adjList.get(dep)!.push(id);
        inDegree.set(id, inDegree.get(id)! + 1);
      }
    }

    const levels: string[][] = [];
    let zeroDegreeQueue: string[] = [];

    for (const [id, deg] of inDegree) {
      if (deg === 0) zeroDegreeQueue.push(id);
    }

    let processedCount = 0;

    while (zeroDegreeQueue.length > 0) {
      levels.push([...zeroDegreeQueue]);
      const nextQueue: string[] = [];

      for (const curr of zeroDegreeQueue) {
        processedCount++;
        for (const dependent of adjList.get(curr)!) {
          inDegree.set(dependent, inDegree.get(dependent)! - 1);
          if (inDegree.get(dependent) === 0) {
            nextQueue.push(dependent);
          }
        }
      }

      zeroDegreeQueue = nextQueue;
    }

    if (processedCount !== tasks.size) {
      throw new Error('Ciclo detectado no grafo de dependências (DAG inválido)');
    }

    return levels;
  }
}
