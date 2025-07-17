---
model: GPT-4.1
---
# Validate Instructions

**Important**: When printing file names, use the format `file://<path>`.

## List Instructions

List all the existing and non-empty instruction files that are referenced in the current task.

Check:
- workspace files.
- user files.
- other global instruction files that affect the current task.

Exclude this prompt file from the list of inspected instructions.
Print the list of instruction files under consideration.

## Check Instructions for Contradictions

- Find all contradictory instructions you are aware of. Do not print the list immediately.
- Sort the list of contradictions into resolved and unresolved. Do not print anything immediately.
- Use [copilot instructions](../copilot-instructions.md) to determine if contradictions can be resolved. Remember resolutions status for future output.
- For each contradiction:
  - Print the contradiction title.
  - Print contradictory instructions, use this format:

```markdown
  <instruction_1>
```
<relative_workspace_file_path_1>

```markdown
  <instruction_2>
```
<relative_workspace_file_path_2>
  - Print contradiction description.
  - Print resolution status:
    - If the contradiction is resolved, print `✅ Resolved`.
    - If the contradiction is unresolved, print `⚠️ Unresolved` and proposed resolution.

## Print Summary

Print summary of detected contradictions:
  - `Total: <resolved_count + unresolved_count>`.
  - `✅ Resolved: <resolved_count>`.
  - `⚠️ Unresolved: <unresolved_count>`.
