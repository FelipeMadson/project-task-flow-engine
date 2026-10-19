# Project Task Flow Engine

Deterministic Directed Acyclic Graph (DAG) task execution scheduler and dependency resolver for complex asynchronous pipelines, build tools, and multi-stage workflow automation.

[![CI](https://github.com/FelipeMadson/project-task-flow-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMadson/project-task-flow-engine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Read this in [Português](README.pt-BR.md).*

---

## Core Capabilities

- **Cycle Detection**: Detects recursive cyclic dependencies before execution using Kahn's algorithm.
- **Topological Staging**: Resolves execution levels guaranteeing prerequisite tasks run before dependents.
- **Concurrent Batch Dispatch**: Executes independent sibling nodes simultaneously while respecting concurrency limits.
- **Cascade Failure Handling**: Automatically short-circuits dependent tasks when upstream parents fail.

---

## Usage Example

```typescript
import { TaskFlowEngine } from './src/index.ts';

const engine = new TaskFlowEngine();
engine.addTask('fetch-data', async () => ({ records: [1, 2, 3] }));
engine.addTask('clean-data', async (ctx) => ctx['fetch-data'].records.map(x => x * 2), ['fetch-data']);
engine.addTask('notify', async () => console.log('Done!'), ['clean-data']);

const results = await engine.execute();
```

## License

MIT © [Felipe Madison](https://github.com/FelipeMadson)
