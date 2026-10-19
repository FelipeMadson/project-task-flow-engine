import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TaskFlowEngine } from '../src/engine.ts';
import { DagResolver } from '../src/dag.ts';

describe('DagResolver', () => {
  it('detecta ciclos diretos e rejeita o grafo', () => {
    const tasks = new Map();
    tasks.set('A', { id: 'A', dependencies: ['B'], run: () => {} });
    tasks.set('B', { id: 'B', dependencies: ['A'], run: () => {} });

    assert.throws(
      () => DagResolver.resolveOrder(tasks),
      /Ciclo detectado/
    );
  });

  it('calcula níveis de execução topológica corretamente', () => {
    const tasks = new Map();
    tasks.set('db_init', { id: 'db_init', dependencies: [], run: () => {} });
    tasks.set('seed_users', { id: 'seed_users', dependencies: ['db_init'], run: () => {} });
    tasks.set('seed_orders', { id: 'seed_orders', dependencies: ['db_init'], run: () => {} });
    tasks.set('generate_report', { id: 'generate_report', dependencies: ['seed_users', 'seed_orders'], run: () => {} });

    const levels = DagResolver.resolveOrder(tasks);
    assert.deepEqual(levels[0], ['db_init']);
    assert.equal(levels[1].length, 2); // seed_users e seed_orders
    assert.deepEqual(levels[2], ['generate_report']);
  });
});

describe('TaskFlowEngine', () => {
  it('executa tarefas em sequência e compartilha contexto de dados', async () => {
    const engine = new TaskFlowEngine();
    engine.addTask('fetch_user', async () => ({ id: 42, name: 'Alice' }));
    engine.addTask('enrich_profile', async (ctx) => {
      const u = ctx.fetch_user as { name: string };
      return `Welcome, ${u.name}!`;
    }, ['fetch_user']);

    const output = await engine.execute();
    assert.deepEqual(output.fetch_user, { id: 42, name: 'Alice' });
    assert.equal(output.enrich_profile, 'Welcome, Alice!');
  });
});
