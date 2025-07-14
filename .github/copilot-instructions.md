# DevExtreme Monorepo: Copilot Instructions

## Instruction files
Use these instructions:
 - [general instructions](./instructions/general.instructions.md)
 - [local instructions](./instructions/local.instructions.md)

**Rule 1.1**: in the case of a conflict between the instructions, the local instructions take precedence.

## Instruction Troubleshooting
- If the user asks to **list instructions**, list all the existing and non-empty instruction files you are aware of.
- If the user asks to **validate instructions**, do the following:
  - Ignore **Rule 1.1**.
  - List all contradictory instructions you are aware of. If the contradiction is resolved mark it with "✅", otherwise mark it with "⚠️". For each contradiction:
    - Print relative workspace file paths and the line numbers where the instruction is located.
    - For each unresolved contradiction, propose a resolution.
      - If the contradiction emerges from the [local instructions](./instructions/local.instructions.md), propose changes in the [local instructions](./instructions/local.instructions.md) file that will reduce its scope.
  - Print summary of detected contradictions: total (resolved and unresolved), resolved, unresolved.
