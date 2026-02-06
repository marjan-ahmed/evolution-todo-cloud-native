---
description: "Task list for Interactive Web Todo Application implementation"
---

# Tasks: Interactive Web Todo Application

**Input**: Design documents from `/specs/002-web-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, quickstart.md

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are omitted. Focus on implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `phase-2-web/src/`, `phase-2-web/tests/` at repository root
- Paths shown assume Next.js application structure with TypeScript

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
- **User Story 1 only** (Add and View Tasks)
- This delivers immediate value as a task capture and display tool
- Validates architecture and core functionality
- Can be demonstrated and tested independently

### Incremental Delivery Plan
1. **Iteration 1**: US1 (Add + View) - Core MVP
2. **Iteration 2**: US2 (Toggle Status) - Progress tracking
3. **Iteration 3**: US3 (Update) + US4 (Delete) - Full CRUD
4. **Iteration 4**: US5 (Keyboard Navigation) - Polish
5. **Iteration 5**: US6-US10 (Advanced Features) - Complete functionality

Each iteration delivers a working, demonstrable product increment.

---

## Dependencies Between User Stories

```
Setup (Phase 1) ──┐
                  ├──> Foundational (Phase 2) ──┐
                  │                              ├──> US1 ──> US2 ──> US3 ──> US4 ──> US5 ──> Polish
                  │                              │
                  └──────────────────────────────┘
```

**Dependency Rules**:
- **Setup** and **Foundational** phases MUST complete before any user story
- **US1** (Add + View) MUST complete first (establishes core architecture)
- **US2-US5** depend on US1 but can be partially parallelized after US1 is stable
- **US6-US10** (Advanced features) depend on core CRUD operations
- **Polish** phase touches all user stories (cross-cutting concerns)

**Parallel Opportunities**:
- Within Setup phase: Most tasks are parallelizable [P]
- Within Foundational phase: Components and hooks can be developed in parallel [P]
- Between user stories: After US1 stabilizes, US2-US5 can begin in parallel if multiple developers
- Within each user story: Components can be parallel [P]

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with TypeScript and create directory structure per implementation plan.

**Tasks**:

- [ ] T001 Initialize Next.js project with TypeScript: `npx create-next-app@latest phase-2-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] T002 [P] Create directory structure: `phase-2-web/src/components/`, `phase-2-web/src/hooks/`, `phase-2-web/src/types/`
- [ ] T003 [P] Create empty index.ts files in all directories: `phase-2-web/src/components/index.ts`, `phase-2-web/src/hooks/index.ts`, `phase-2-web/src/types/index.ts`
- [ ] T004 [P] Create types directory: `phase-2-web/src/types/task.ts` for task type definition
- [ ] T005 [P] Install additional dependencies: `date-fns` for date manipulation and `lucide-react` for icons
- [ ] T006 Update next.config.ts to support aliases and any required configurations
- [ ] T007 [P] Create global CSS with Tailwind directives in `phase-2-web/src/app/globals.css`
- [ ] T008 Create layout.tsx in `phase-2-web/src/app/layout.tsx` with proper HTML structure
- [ ] T009 Update package.json with project metadata and scripts
- [ ] T010 Verify installation with `npm run dev` and check if app loads successfully

**Completion Criteria**:
- ✅ Next.js project initialized with proper structure
- ✅ All dependencies installed and importable
- ✅ Entry point configured and app runs without errors
- ✅ Tailwind CSS working properly with styling

---

## Phase 2: Foundational (Core Data and Business Logic)

**Purpose**: Implement data models and business logic hooks that ALL user stories depend on.

**Independent Test**: After this phase, useTaskManager hook can be imported and tested independently of any UI components.

**Tasks**:

- [ ] T011 [P] Implement Task type definition in `phase-2-web/src/types/task.ts` with all required fields per data model
- [ ] T012 [P] Implement useLocalStorage custom hook in `phase-2-web/src/hooks/useLocalStorage.ts` for persistent storage
- [ ] T013 [P] Implement FilterConfig and SortConfig type definitions in `phase-2-web/src/types/task.ts`
- [ ] T014 Implement useTaskManager hook initialization in `phase-2-web/src/hooks/useTaskManager.ts`
- [ ] T015 [P] Implement useTaskManager.addTask() method with validation and ID generation
- [ ] T016 [P] Implement useTaskManager.getTask() method with search by ID
- [ ] T017 [P] Implement useTaskManager.updateTask() method with validation
- [ ] T018 [P] Implement useTaskManager.deleteTask() method
- [ ] T019 [P] Implement useTaskManager.toggleTask() method
- [ ] T020 Implement useTaskManager.getFilteredAndSortedTasks() method with all filter/sort logic
- [ ] T021 [P] Implement helper functions for date formatting and validation in `phase-2-web/src/utils/date.ts`
- [ ] T022 Export hooks and types in respective index files

**Completion Criteria**:
- ✅ Task type fully defined with all required fields per data model
- ✅ useTaskManager hook implements all CRUD operations
- ✅ Filtering and sorting logic correctly implemented
- ✅ All methods handle edge cases (empty lists, invalid data)
- ✅ Can create useTaskManager instance and perform operations in development tools

---

## Phase 3: User Story 1 - Add and View Tasks (Priority: P1)

**Goal**: Enable users to add tasks with titles/descriptions and view them in a responsive table.

**Why First**: Core MVP. Establishes UI architecture, demonstrates visual polish, delivers immediate value.

**Independent Test**: After this phase, can launch app, add multiple tasks, see them in responsive table with status indicators. App is usable as basic task capture tool.

**Tasks**:

### UI Foundation

- [ ] T023 [P] [US1] Create TaskForm component in `phase-2-web/src/components/TaskForm.tsx` with title and description input fields
- [ ] T024 [P] [US1] Create TaskTable component in `phase-2-web/src/components/TaskTable.tsx` displaying tasks in responsive table
- [ ] T025 [P] [US1] Create TaskStats component in `phase-2-web/src/components/TaskStats.tsx` showing task statistics
- [ ] T026 [US1] Create Dashboard page component in `phase-2-web/src/app/page.tsx` composing all UI elements
- [ ] T027 [US1] Connect useTaskManager hook to Dashboard component for state management

### Add Task Functionality

- [ ] T028 [P] [US1] Style TaskForm with Tailwind CSS (proper spacing, responsive layout)
- [ ] T029 [US1] Implement TaskForm.onFormSubmit() handler to call useTaskManager.addTask()
- [ ] T030 [US1] Add input validation in TaskForm: reject empty titles, trim whitespace
- [ ] T031 [US1] Implement form reset after successful task addition
- [ ] T032 [US1] Add loading states and error handling to TaskForm

### View Tasks Functionality

- [ ] T033 [US1] Implement TaskTable.renderRows() method to populate table rows from tasks list
- [ ] T034 [US1] Implement TaskTable with responsive design adapting to mobile/desktop
- [ ] T035 [US1] Add status icon rendering: ☐ for pending, ☑ for completed
- [ ] T036 [US1] Apply strikethrough styling to completed tasks
- [ ] T037 [US1] Handle empty state: display "No tasks yet. Add your first task!" when tasks list is empty
- [ ] T038 [US1] Implement TaskStats to calculate and display accurate counts and percentages

### Integration

- [ ] T039 [US1] Connect TaskForm and TaskTable to useTaskManager state
- [ ] T040 [US1] Update Dashboard to refresh UI after adding tasks
- [ ] T041 [US1] Verify app loads, add 3 tasks, see them in responsive table with proper formatting

**Completion Criteria**:
- ✅ App launches without errors
- ✅ Can add tasks via form submission
- ✅ Tasks display in responsive table with ID, Status (☐), Title, Description
- ✅ Statistics panel shows accurate counts and percentage
- ✅ Empty state displays friendly message
- ✅ Validation prevents empty titles
- ✅ Responsive design works on mobile and desktop

---

## Phase 4: User Story 2 - Toggle Task Status (Priority: P2)

**Goal**: Enable users to mark tasks complete/incomplete with immediate visual feedback.

**Why Second**: Adds progress tracking capability, showcases responsiveness principle.

**Independent Test**: After this phase, can add tasks, toggle their status, see status icons change (☐ ↔ ☑), statistics update in real-time.

**Dependencies**: Requires US1 (Add and View) to be complete.

**Tasks**:

- [ ] T042 [P] [US2] Add checkbox input to TaskTable rows for toggling completion status
- [ ] T043 [US2] Implement TaskTable.onCheckboxChange() handler to call useTaskManager.toggleTask()
- [ ] T044 [US2] Update TaskTable to apply 'completed' styling for completed tasks (strikethrough text)
- [ ] T045 [US2] Call statistics update after toggling task status
- [ ] T046 [US2] Add visual feedback: highlight row or show brief confirmation on toggle
- [ ] T047 [US2] Verify toggle works: add task, click checkbox, see ☐ → ☑, stats update, click again, see ☑ → ☐

**Completion Criteria**:
- ✅ Checkbox toggles task completion status
- ✅ Status icon changes immediately (☐ ↔ ☑)
- ✅ Statistics update in real-time
- ✅ Completed tasks show strikethrough styling
- ✅ Toggle works bidirectionally (complete → incomplete → complete)

---

## Phase 5: User Story 3 - Update Task Details (Priority: P3)

**Goal**: Enable users to edit task titles and descriptions.

**Why Third**: Adds refinement capability, prevents frustration from typos.

**Independent Test**: After this phase, can create task with typo, edit it via edit button, update title/description, see changes reflected in table.

**Dependencies**: Requires US1 (Add and View) to be complete.

**Tasks**:

- [ ] T048 [P] [US3] Add edit button/icon to each task row in TaskTable
- [ ] T049 [P] [US3] Create EditTaskForm component in `phase-2-web/src/components/EditTaskForm.tsx` pre-filled with task data
- [ ] T050 [US3] Style EditTaskForm similar to TaskForm with Save/Cancel buttons
- [ ] T051 [US3] Implement TaskTable.onEditButtonClick() to open EditTaskForm with selected task
- [ ] T052 [US3] Implement EditTaskForm.onMount() to pre-fill input fields with current task data
- [ ] T053 [US3] Implement EditTaskForm.onSave() to call useTaskManager.updateTask()
- [ ] T054 [US3] Add validation: reject empty titles in EditTaskForm
- [ ] T055 [US3] Call UI refresh after updating task
- [ ] T056 [US3] Verify editing works: create task "Review PR", edit to "Review PR #345", see change in table

**Completion Criteria**:
- ✅ Edit button opens modal/form for selected task
- ✅ Form pre-fills with current task data
- ✅ Can update title and/or description
- ✅ Validation prevents empty titles
- ✅ Changes reflect immediately in table
- ✅ Cancel button discards changes

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to delete tasks with confirmation dialog.

**Why Fourth**: Adds list management capability, demonstrates good UX practices.

**Independent Test**: After this phase, can create test task, click delete button, see confirmation dialog, confirm deletion, task removed from list.

**Dependencies**: Requires US1 (Add and View) to be complete.

**Tasks**:

- [ ] T057 [P] [US4] Add delete button/icon to each task row in TaskTable
- [ ] T058 [P] [US4] Create ConfirmDialog component in `phase-2-web/src/components/ConfirmDialog.tsx` with title, message, Confirm/Cancel buttons
- [ ] T059 [P] [US4] Style ConfirmDialog with error/warning color scheme (red border)
- [ ] T060 [US4] Implement TaskTable.onDeleteButtonClick() to get selected task and show confirmation
- [ ] T061 [US4] Implement ConfirmDialog to display task title in confirmation message: "Delete 'Task title'?"
- [ ] T062 [US4] Call useTaskManager.deleteTask() only if user confirms (not on cancel)
- [ ] T063 [US4] Call UI refresh and statistics update after deletion
- [ ] T064 [US4] Display success message: "Task deleted successfully"
- [ ] T065 [US4] Verify deletion: add task, click delete, cancel first time (task remains), click delete again, confirm (task removed)

**Completion Criteria**:
- ✅ Delete button shows confirmation dialog for selected task
- ✅ Dialog displays task title in message
- ✅ Confirm button deletes task
- ✅ Cancel button preserves task
- ✅ Task removed from table after confirmation
- ✅ Statistics update after deletion
- ✅ Success feedback shown

---

## Phase 7: User Story 5 - Keyboard-Driven Navigation (Priority: P5)

**Goal**: Enable keyboard navigation and shortcuts for all operations.

**Why Fifth**: Improves accessibility and efficiency for power users.

**Independent Test**: After this phase, can perform all operations (add, edit, delete, toggle) using only keyboard.

**Dependencies**: Requires US1-US4 to be complete (all operations must exist).

**Tasks**:

- [ ] T066 [US5] Add keyboard event listeners to Dashboard for shortcut handling
- [ ] T067 [US5] Implement 'a' key to focus/add task form
- [ ] T068 [US5] Implement 'e' key to edit selected task (when task is selected)
- [ ] T069 [US5] Implement 'd' key to delete selected task (with confirmation)
- [ ] T070 [US5] Implement 'space' key to toggle selected task status
- [ ] T071 [US5] Implement arrow key navigation to move between tasks in table
- [ ] T072 [US5] Add visual indicator for currently selected task
- [ ] T073 [US5] Test full keyboard workflow: add task, navigate to it, toggle status, edit it, delete it - all with keyboard only

**Completion Criteria**:
- ✅ 'a' key focuses the add task form
- ✅ Arrow keys navigate between tasks
- ✅ 'space' key toggles selected task
- ✅ 'e' key edits selected task
- ✅ 'd' key deletes selected task (with confirmation)
- ✅ All operations accessible via keyboard only
- ✅ Visual feedback shows selected task

---

## Phase 8: User Story 6 - Advanced Organization Features (Priority: P6)

**Goal**: Implement priority levels, categories, and due dates for tasks.

**Why Sixth**: Adds sophisticated organization capabilities for managing complex todo lists.

**Independent Test**: After this phase, can create tasks with priority, category, and due date, see them displayed with appropriate visual indicators.

**Dependencies**: Requires US1-US5 to be complete.

**Tasks**:

- [ ] T074 [P] [US6] Update TaskForm to include priority selection (dropdown/radio buttons)
- [ ] T075 [P] [US6] Update TaskForm to include category selection (dropdown/tags)
- [ ] T076 [P] [US6] Update TaskForm to include due date picker
- [ ] T077 [US6] Update TaskTable to display priority indicators (🔴🟡🟢)
- [ ] T078 [US6] Update TaskTable to display category badges
- [ ] T079 [US6] Update TaskTable to display due date with appropriate styling
- [ ] T080 [US6] Implement visual indicators for due dates (⚠️ for due soon, 🔴 for overdue)
- [ ] T081 [US6] Update EditTaskForm to include priority, category, and due date fields
- [ ] T082 [US6] Verify advanced features work: create high priority work task due tomorrow, see all indicators properly displayed

**Completion Criteria**:
- ✅ Priority levels can be assigned (High/Medium/Low with visual indicators)
- ✅ Categories can be assigned (Work/Home/Personal with badges)
- ✅ Due dates can be set with calendar picker
- ✅ Visual indicators clearly show priority, category, and due date status
- ✅ All advanced properties persist correctly
- ✅ Responsive design accommodates additional columns/elements

---

## Phase 9: User Story 7 - Search and Filter Tasks (Priority: P7)

**Goal**: Enable users to search and filter tasks by various criteria.

**Why Seventh**: Essential for managing large task lists efficiently.

**Independent Test**: After this phase, can type in search box to filter tasks, use filter controls to show only high priority tasks, etc.

**Dependencies**: Requires US1-US6 to be complete.

**Tasks**:

- [ ] T083 [P] [US7] Create TaskFilters component in `phase-2-web/src/components/TaskFilters.tsx` with filter controls
- [ ] T084 [US7] Implement search functionality in useTaskManager hook
- [ ] T085 [US7] Implement filter by status (all/active/completed) in useTaskManager hook
- [ ] T086 [US7] Implement filter by priority (high/medium/low) in useTaskManager hook
- [ ] T087 [US7] Implement filter by category (work/home/personal) in useTaskManager hook
- [ ] T088 [US7] Connect TaskFilters to useTaskManager filter state
- [ ] T089 [US7] Update TaskTable to display filtered results
- [ ] T090 [US7] Add search input field with debounced search
- [ ] T091 [US7] Verify filtering works: add multiple tasks with different priorities/categories, filter to see only high priority work tasks

**Completion Criteria**:
- ✅ Keyword search filters tasks by title and description
- ✅ Filter by status works (all/active/completed)
- ✅ Filter by priority works (high/medium/low)
- ✅ Filter by category works (work/home/personal)
- ✅ Filters can be combined
- ✅ Search is debounced for performance
- ✅ Filtered results update in real-time

---

## Phase 10: User Story 8 - Sort and Organize Tasks (Priority: P8)

**Goal**: Enable users to sort tasks by various criteria.

**Why Eighth**: Allows users to organize tasks in the most useful order for their workflow.

**Independent Test**: After this phase, can click column headers or sort controls to sort tasks by date, priority, title, etc.

**Dependencies**: Requires US1-US7 to be complete.

**Tasks**:

- [ ] T092 [US8] Update useTaskManager hook to include sorting functionality
- [ ] T093 [US8] Implement sort by creation date (newest first) in useTaskManager hook
- [ ] T094 [US8] Implement sort by priority (high to low) in useTaskManager hook
- [ ] T095 [US8] Implement sort by title (alphabetical) in useTaskManager hook
- [ ] T096 [US8] Implement sort by due date (soonest first) in useTaskManager hook
- [ ] T097 [US8] Add sort controls to TaskTable header or separate controls
- [ ] T098 [US8] Show current sort indicator (ascending/descending arrows)
- [ ] T099 [US8] Allow switching between sort criteria
- [ ] T100 [US8] Verify sorting works: create tasks with different dates/priorities, sort by each criterion

**Completion Criteria**:
- ✅ Tasks can be sorted by creation date
- ✅ Tasks can be sorted by priority
- ✅ Tasks can be sorted alphabetically by title
- ✅ Tasks can be sorted by due date
- ✅ Current sort order is clearly indicated
- ✅ Switching between sort criteria works smoothly
- ✅ Sort persists with filtering/search

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Handle edge cases, add error handling, ensure constitutional compliance.

**Dependencies**: Requires all user stories (US1-US8) to be complete.

**Tasks**:

### Edge Case Handling

- [ ] T101 [P] Handle localStorage quota exceeded: detect and display appropriate error message
- [ ] T102 [P] Handle invalid date input: add validation and error messaging for due dates
- [ ] T103 [P] Handle very long titles (500+ chars): truncate display with ellipsis while preserving full data
- [ ] T104 [P] Handle special characters and emojis: verify proper display and storage
- [ ] T105 [P] Handle rapid task operations: verify no race conditions or state corruption
- [ ] T106 [P] Handle corrupted localStorage data: provide option to reset with user confirmation

### Error Messages and Validation

- [ ] T107 [P] Standardize error message format: use consistent style and color for all error messages
- [ ] T108 [P] Add comprehensive input validation messages: "Title is required", "Invalid date format", etc.
- [ ] T109 [P] Test all validation rules: empty titles, invalid dates, etc.
- [ ] T110 [P] Add loading states for operations that take time

### Accessibility Enhancements

- [ ] T111 [P] Add proper ARIA labels and roles to all interactive elements
- [ ] T112 [P] Ensure keyboard focus indicators are visible and consistent
- [ ] T113 [P] Test screen reader compatibility for all components
- [ ] T114 [P] Verify color contrast meets WCAG 2.1 AA standards

### Performance Optimization

- [ ] T115 [P] Optimize TaskTable rendering for large datasets (memoization, virtualization if needed)
- [ ] T116 [P] Optimize search and filter performance for up to 1000 tasks
- [ ] T117 [P] Performance test with 100 tasks: verify operations complete in <1 second
- [ ] T118 [P] Stress test with 1000 tasks: verify no crashes, acceptable performance

### Documentation

- [ ] T119 [P] Update README.md in `phase-2-web/` with usage instructions and feature overview
- [ ] T120 [P] Add JSDoc comments to all public functions in hooks and utils
- [ ] T121 [P] Create examples in README showing common workflows

### Final Validation

- [ ] T122 Verify all success criteria from spec.md: SC-001 through SC-020
- [ ] T123 Verify all constitutional principles satisfied: Intuitive UX, Aesthetic Design, Modular Architecture, etc.
- [ ] T124 Run full manual test suite: add, view, toggle, edit, delete operations with edge cases
- [ ] T125 Create demo video showing all features for presentation

**Completion Criteria**:
- ✅ All edge cases handled gracefully
- ✅ Error messages are clear and actionable
- ✅ Accessibility standards met (WCAG 2.1 AA)
- ✅ Performance targets met (SC-002, SC-005)
- ✅ All success criteria validated
- ✅ Documentation complete
- ✅ Ready for production/deployment

---

## Summary

**Total Tasks**: 125
**Parallel Opportunities**: 32 tasks marked with [P]

### Tasks Per User Story

| Phase | Story | Task Count | Can Start After |
|-------|-------|------------|-----------------|
| Phase 1 | Setup | 10 | - |
| Phase 2 | Foundational | 12 | Phase 1 |
| Phase 3 | US1 (Add + View) | 19 | Phase 2 |
| Phase 4 | US2 (Toggle Status) | 6 | Phase 3 |
| Phase 5 | US3 (Update Details) | 9 | Phase 3 |
| Phase 6 | US4 (Delete Tasks) | 9 | Phase 3 |
| Phase 7 | US5 (Keyboard Nav) | 8 | Phases 4-6 |
| Phase 8 | US6 (Advanced Features) | 9 | Phase 7 |
| Phase 9 | US7 (Search & Filter) | 9 | Phase 8 |
| Phase 10 | US8 (Sort Tasks) | 9 | Phase 9 |
| Phase 11 | Polish | 24 | Phase 10 |

### Parallel Execution Examples

**Within US1 (after T027 completes)**:
- T023, T024, T025 (component creation) in parallel
- T028, T033 (styling and rendering) in parallel

**Between User Stories (after US1 stabilizes)**:
- US2 (T042-T047) can start
- US3 (T048-T056) can start in parallel with US2
- US4 (T057-T065) can start in parallel with US2 and US3

**Within Polish Phase**:
- T101-T106 (edge cases) all parallel
- T107-T110 (validation) all parallel
- T119-T121 (documentation) all parallel

### Independent Test Criteria

- **After Phase 2**: useTaskManager hook works in isolation
- **After Phase 3 (US1)**: Can add and view tasks in responsive table
- **After Phase 4 (US2)**: Can toggle task status with visual feedback
- **After Phase 5 (US3)**: Can edit existing tasks
- **After Phase 6 (US4)**: Can delete tasks with confirmation
- **After Phase 7 (US5)**: All operations accessible via keyboard
- **After Phase 8 (US6)**: Advanced organization features work
- **After Phase 9 (US7)**: Search and filtering work
- **After Phase 10 (US8)**: Sorting functionality works
- **After Phase 11 (Polish)**: Production-ready application with all features