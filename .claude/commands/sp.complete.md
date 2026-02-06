---
description: Execute the full Spec-Kit workflow from feature specification to implementation automatically.
handoffs:
  - label: Generate Spec
    agent: sp.specify
    prompt: Create or update the feature specification from a natural language description
    send: true
  - label: Generate Plan
    agent: sp.plan
    prompt: Execute the implementation planning workflow using the generated spec
    send: true
  - label: Generate Tasks
    agent: sp.tasks
    prompt: Generate actionable, dependency-ordered tasks from the plan and spec
    send: true
  - label: Implement Feature
    agent: sp.implement
    prompt: Execute the implementation plan by processing all tasks
    send: true
---

## Outline

1. **Spec Phase**
   - Treat `$ARGUMENTS` as input for `/sp.specify`.
   - Generate the feature specification.
   - Resolve all [NEEDS CLARIFICATION] markers (max 3).
   - Validate spec against the quality checklist.
   - **STOP** only if the spec fails validation and cannot proceed.

2. **Plan Phase**
   - Automatically run `/sp.plan` using the validated spec.
   - Generate research.md, data-model.md, contracts/, and quickstart.md.
   - Stop if any gates or clarification points block progress.

3. **Tasks Phase**
   - Automatically run `/sp.tasks` using the plan artifacts.
   - Generate a complete `tasks.md` file with proper user story mapping, dependencies, and phases.
   - Validate task completeness and readiness for implementation.
   - Stop only if critical gaps are found.

4. **Implement Phase**
   - Automatically run `/sp.implement`.
   - Execute tasks in sequential and parallel order according to `tasks.md`.
   - Respect all dependencies, checklist validations, and error handling rules.
   - Halt and request user confirmation only if a non-parallel task fails or a critical checklist is incomplete.

5. **Reporting**
   - After successful completion of all phases, report:
     - Branch name
     - Spec file path
     - Plan artifacts path
     - Tasks file path
     - Implementation status summary

## Key Rules

- All phases must **respect Spec-Kit validations and gates**.
- Clarifications and incomplete checklists pause execution for user input; otherwise, workflow proceeds automatically.
- No implementation detail leaks into spec or plan.
- This command is intended to **fully automate the workflow** from natural language feature description to executed tasks.

## Usage Example

```text

/sp.complete Build an isometric styled frontend UI for the Phase II Todo web app

