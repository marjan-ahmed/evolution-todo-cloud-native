# Data Model: Interactive CLI Todo Application

**Feature**: Interactive CLI Todo Application
**Branch**: `001-cli-todo-app`
**Created**: 2025-12-31

## Overview

This document defines the data structures for the in-memory todo application. The model consists of two primary components: the `Task` entity representing individual todo items, and the `TaskManager` service managing the task collection.

## Entities

### Task

Represents a single todo item with metadata and completion status.

**Fields**:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | `int` | Yes | Auto-generated | Unique identifier, auto-incremented starting from 1 |
| `title` | `str` | Yes | - | Brief description of what needs to be done (max display: 100 chars) |
| `description` | `str` | No | `""` | Additional details or context (max display: 500 chars) |
| `completed` | `bool` | Yes | `False` | Status indicating if task is done |
| `created_at` | `datetime` | Yes | Auto-generated | Timestamp of task creation (UTC) |
| `priority` | `Priority` | No | `Medium` | Task importance level: High, Medium, or Low |
| `category` | `str` | No | `None` | User-defined label: Work, Home, Personal, or custom |
| `due_date` | `datetime` | No | `None` | Deadline date and time for task completion |
| `recurrence` | `Recurrence` | No | `None` | Task repetition pattern: None, Daily, Weekly, or Monthly |
| `completed_at` | `datetime` | No | `None` | Timestamp when task was marked completed |

**Validation Rules**:
- `title` MUST NOT be empty string after stripping whitespace
- `title` length SHOULD be reasonable (truncate display at 100 chars, accept up to 500)
- `description` can be empty but SHOULD truncate display at 500 chars if longer
- `id` MUST be unique within the TaskManager collection
- `id` MUST be positive integer
- `created_at` is immutable after creation
- `priority` MUST be one of: High, Medium, or Low
- `due_date` if provided MUST be a datetime object in the future or present
- `recurrence` MUST be one of: None, Daily, Weekly, or Monthly
- `completed_at` is set only when `completed` changes from False to True

**State Transitions**:
```
[Created] ──toggle──> [Completed]
    ▲                      │
    └───────toggle─────────┘
```

**Implementation Notes**:
- Use Python `dataclass` with `@dataclass` decorator
- Use `Enum` for Priority and Recurrence types
- `created_at` uses `field(default_factory=datetime.now)`
- `priority` defaults to `Priority.MEDIUM`
- `completed_at` set by TaskManager on completion
- No persistence layer - exists only in memory during runtime
- ID assignment happens in TaskManager, not in Task constructor

**Example**:
```python
from enum import Enum
from datetime import datetime
from dataclasses import dataclass, field

class Priority(Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Recurrence(Enum):
    NONE = "None"
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"

@dataclass
class Task:
    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)
    priority: Priority = Priority.MEDIUM
    category: str = None
    due_date: datetime = None
    recurrence: Recurrence = Recurrence.NONE
    completed_at: datetime = None
```

---

### TaskManager

Business logic service managing the task collection with CRUD operations and statistics.

**Purpose**: Encapsulates all task business logic separately from UI layer, enabling reusability and testability.

**State**:

| Field | Type | Description |
|-------|------|-------------|
| `tasks` | `List[Task]` | In-memory collection of all tasks |
| `next_id` | `int` | Counter for generating unique task IDs |

**Operations**:

#### add_task(title: str, description: str = "") → Task
Creates and adds a new task to the collection.

**Pre-conditions**:
- `title` must not be empty after stripping whitespace

**Post-conditions**:
- New task added to `tasks` list
- `next_id` incremented
- Task has unique ID
- Task has current timestamp

**Returns**: The newly created `Task` object

**Validation**:
- Strip whitespace from title and description
- Reject if title is empty
- Truncate title/description if exceeds reasonable limits (implementation detail)

---

#### get_task(task_id: int) → Task | None
Retrieves a task by its ID.

**Pre-conditions**:
- `task_id` is a positive integer

**Returns**:
- `Task` object if found
- `None` if not found

**Implementation**: Linear search through `tasks` list

---

#### update_task(task_id: int, title: str | None = None, description: str | None = None) → bool
Updates task fields by ID.

**Pre-conditions**:
- Task with `task_id` exists
- If `title` provided, must not be empty after stripping

**Post-conditions**:
- Specified fields updated on task
- `created_at` and `id` remain unchanged

**Returns**:
- `True` if update successful
- `False` if task not found or validation fails

---

#### delete_task(task_id: int) → bool
Removes a task from the collection.

**Pre-conditions**:
- Task with `task_id` exists

**Post-conditions**:
- Task removed from `tasks` list
- No gaps in remaining IDs (IDs are never reused)

**Returns**:
- `True` if deletion successful
- `False` if task not found

---

#### toggle_task(task_id: int) → Task | None
- `pending` (int): Number of pending tasks
- `percentage` (float): Completion percentage (0.0-100.0)

**Calculation**:
- `completed` = count of tasks where `completed == True`
- `pending` = `total - completed`
- `percentage` = `(completed / total * 100)` if `total > 0` else `0.0`

---

#### search_tasks(keyword: str) → List[Task]
Finds tasks matching keyword in title or description.

**Pre-conditions**:
- `keyword` is a non-empty string

**Returns**:
- List of tasks where keyword appears in title or description (case-insensitive)
- Empty list if no matches found

**Implementation**:
- Use list comprehension with `.lower()` for case-insensitive matching

---

#### filter_tasks(status: bool | None = None, priority: Priority | None = None, category: str | None = None, due_date_filter: str | None = None) → List[Task]
Filters tasks by multiple criteria using AND logic.

**Pre-conditions**:
- At least one filter parameter is not None

**Returns**:
- List of tasks matching all provided filter criteria
- All tasks if all parameters are None

**Due Date Filter Options**:
- `"due_today"`: Tasks due today
- `"upcoming"`: Tasks due in next 7 days
- `"overdue"`: Tasks past their due date

**Implementation**:
- Combine predicates with `all()` function
- Apply to task list for efficient filtering

---

#### sort_tasks(tasks: List[Task], by: str = "created_at") → List[Task]
Sorts tasks by specified criteria.

**Parameters**:
- `tasks`: List of tasks to sort (default: all tasks)
- `by`: Sort criterion - `"created_at"`, `"priority"`, `"due_date"`, or `"title"`

**Returns**:
- New sorted list (does not modify original list)

**Sort Orders**:
- `"priority"`: High → Medium → Low
- `"due_date"`: Nearest → Farthest (None at end)
- `"title"`: A → Z (alphabetically)
- `"created_at"`: Newest → Oldest

**Implementation**:
- Use Python `sorted()` with custom `key` function
- Priority sorting uses custom order dict: `{Priority.HIGH: 0, Priority.MEDIUM: 1, Priority.LOW: 2}`

---

#### get_overdue_and_upcoming() → dict
Calculates tasks due soon or overdue.

**Returns**: Dictionary with keys:
- `overdue` (List[Task]): Tasks with `due_date < datetime.now()`
- `upcoming` (List[Task]): Tasks due within next 24 hours, not overdue
- `count` (int): Total count of overdue + upcoming tasks

**Implementation**:
- Iterate through all tasks
- Compare `due_date` with `datetime.now()`
- Separate into overdue and upcoming lists

---

## Relationships

```
TaskManager (1) ──manages──> (*) Task
```

- One TaskManager instance manages multiple Task instances
- Tasks have no references to TaskManager (unidirectional)
- Tasks are independent entities (no parent-child relationships between tasks)
- No cascade delete (only TaskManager holds task references)

## Data Flow

### Creating a Task
1. UI layer calls `TaskManager.add_task(title, description)`
2. TaskManager validates title (not empty)
3. TaskManager creates Task with `next_id`
4. TaskManager increments `next_id`
5. TaskManager appends Task to `tasks` list
6. TaskManager returns Task object
7. UI layer displays updated task list

### Updating Task Status
1. UI layer calls `TaskManager.toggle_task(task_id)`
2. TaskManager finds task by ID (linear search)
3. TaskManager flips `completed` boolean
4. TaskManager returns success status
5. UI layer refreshes table and statistics

### Deleting a Task
1. UI layer calls `TaskManager.delete_task(task_id)`
2. TaskManager finds task by ID
3. TaskManager removes task from list
4. TaskManager returns success status
5. UI layer refreshes table and statistics

## Invariants

The following must ALWAYS be true:

1. **Unique IDs**: No two tasks have the same ID
2. **Positive IDs**: All task IDs are positive integers (>= 1)
3. **Monotonic IDs**: `next_id` always increases, never decreases
4. **Valid Titles**: No task has an empty title
5. **Immutable Creation Time**: `created_at` never changes after task creation
6. **Immutable IDs**: Task IDs never change after creation
7. **Valid Priority**: All task priorities are High, Medium, or Low
8. **Valid Recurrence**: All recurrence patterns are None, Daily, Weekly, or Monthly
9. **Due Date Consistency**: If task has recurrence, it must have a due date
10. **Completed Timestamp**: `completed_at` is set only when task is marked complete

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| add_task | O(1) | O(1) | Append to list |
| get_task | O(n) | O(1) | Linear search |
| update_task | O(n) | O(1) | Linear search + update |
| delete_task | O(n) | O(1) | Linear search + remove |
| toggle_task | O(n) | O(1) | Linear search + update |
| search_tasks | O(n) | O(m) | n tasks, m matches (list comprehension) |
| filter_tasks | O(n) | O(k) | n tasks, k filter predicates (all()) |
| sort_tasks | O(n log n) | O(n) | Python timsort with key function |
| get_overdue_and_upcoming | O(n) | O(1) | Full list iteration, two result lists |
| get_stats | O(n) | O(1) | Full list iteration |

**Justification for O(n) operations**:
- Expected task count: 10-100 (typical usage)
- Linear search acceptable for this scale
- Simpler implementation than dict-based lookup
- No premature optimization needed

## Edge Cases

### Empty Collection
- `get_stats()` returns `{"total": 0, "completed": 0, "pending": 0, "percentage": 0.0}`
- `get_task()` always returns `None`
- `update_task()`, `delete_task()`, `toggle_task()` always return `False`

### Long Titles/Descriptions
- UI layer truncates display (not data model responsibility)
- Data model accepts strings up to Python's string limit
- Recommendation: UI validates length before calling TaskManager

### Rapid Task Creation
- IDs continue incrementing (no overflow risk for reasonable usage)
- Python int has unlimited precision (no 32-bit overflow)
- Memory limit: ~10MB for 10,000 tasks (rough estimate)

### Invalid IDs
- Negative or zero IDs never returned by TaskManager
- UI layer validates numeric input before calling operations
- `get_task(invalid_id)` returns `None` (safe handling)

## Memory Footprint Estimate

Per task (approximate):
- `id`: 28 bytes (Python int object)
- `title`: 50 bytes (string, average length)
- `description`: 100 bytes (string, average length)
- `completed`: 28 bytes (Python bool object)
- `created_at`: 48 bytes (datetime object)
- Overhead: 50 bytes (object, pointers)

**Total per task**: ~304 bytes

**Capacity estimates**:
- 100 tasks: ~30 KB
- 1,000 tasks: ~300 KB
- 10,000 tasks: ~3 MB

All well within memory constraints for a desktop CLI application.

## Testing Considerations

### Unit Tests (TaskManager)
- Test ID generation (uniqueness, incrementing)
- Test validation (empty titles rejected)
- Test CRUD operations (all success and failure paths)
- Test statistics calculation (empty, partial, full completion)
- Test edge cases (invalid IDs, non-existent tasks)

### Property-Based Tests
- Invariants hold after any sequence of operations
- IDs always unique
- Statistics always sum correctly

### Performance Tests
- Measure operations with 100, 1000, 10000 tasks
- Verify no degradation under success criteria (<1 second for 100 tasks)

## Migration Notes

**N/A** - No persistence, no migrations. Data exists only in memory during application runtime.
