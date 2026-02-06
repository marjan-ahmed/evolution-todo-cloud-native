# Data Model: Interactive Web Todo Application

**Feature**: `/specs/002-web-todo-app/spec.md` | **Plan**: `/specs/002-web-todo-app/plan.md`

## Overview

This document defines the data structures, relationships, and validation rules for the Interactive Web Todo Application. The data model supports all functional requirements including basic task management, advanced organization features, and persistence.

## Entities

### 1. Task Entity

The Task entity represents a single todo item with all associated properties and metadata.

#### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| id | string | ✅ | - | UUID format | Unique identifier for the task |
| title | string | ✅ | - | Min length 1, Max length 500 | Task title/description |
| description | string | ❌ | "" | Max length 2000 | Detailed task description |
| completed | boolean | ✅ | false | Boolean | Completion status |
| createdAt | string (ISO date) | ✅ | - | Valid ISO date string | Creation timestamp |
| updatedAt | string (ISO date) | ✅ | - | Valid ISO date string | Last update timestamp |
| priority | string | ✅ | "medium" | Enum: "high", "medium", "low" | Priority level |
| category | string | ❌ | null | Enum: "work", "home", "personal" or null | Category classification |
| dueDate | string (ISO date) | ❌ | null | Valid ISO date string or null | Due date for the task |
| recurrence | string | ❌ | null | Enum: "daily", "weekly", "monthly" or null | Recurrence pattern |

#### Example

```json
{
  "id": "task-12345",
  "title": "Complete project proposal",
  "description": "Finish the Q4 project proposal document and send for review",
  "completed": false,
  "createdAt": "2026-01-01T10:30:00.000Z",
  "updatedAt": "2026-01-01T10:30:00.000Z",
  "priority": "high",
  "category": "work",
  "dueDate": "2026-01-15T23:59:59.000Z",
  "recurrence": null
}
```

#### Validation Rules

1. **Title Validation**:
   - Required field (cannot be null or empty string)
   - Minimum length: 1 character
   - Maximum length: 500 characters
   - Must not contain only whitespace

2. **Description Validation**:
   - Optional field
   - Maximum length: 2000 characters

3. **Status Validation**:
   - Completed must be boolean (true/false)

4. **Priority Validation**:
   - Required field
   - Must be one of: "high", "medium", "low"
   - Case-sensitive

5. **Category Validation**:
   - Optional field
   - If provided, must be one of: "work", "home", "personal"
   - Case-sensitive

6. **Due Date Validation**:
   - Optional field
   - If provided, must be valid ISO 8601 date string
   - Can be in the past, present, or future

7. **Recurrence Validation**:
   - Optional field
   - If provided, must be one of: "daily", "weekly", "monthly"
   - Case-sensitive

### 2. Filter Configuration Entity

The Filter Configuration entity represents the current filtering state applied to tasks.

#### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| status | string | ❌ | "all" | Enum: "all", "active", "completed" | Filter by completion status |
| priority | string | ❌ | null | Enum: "high", "medium", "low" or null | Filter by priority level |
| category | string | ❌ | null | Enum: "work", "home", "personal" or null | Filter by category |
| searchQuery | string | ❌ | "" | String | Text search query |

#### Example

```json
{
  "status": "active",
  "priority": "high",
  "category": null,
  "searchQuery": ""
}
```

### 3. Sort Configuration Entity

The Sort Configuration entity represents the current sorting applied to tasks.

#### Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| by | string | ✅ | "date" | Enum: "date", "priority", "title", "dueDate" | Sort criterion |
| order | string | ✅ | "desc" | Enum: "asc", "desc" | Sort order |

#### Example

```json
{
  "by": "date",
  "order": "desc"
}
```

## Relationships

### Task Relationships

The Task entity is independent with no direct relationships to other entities. However, it participates in logical groupings:

1. **By Status**: Tasks grouped by completed/completed status
2. **By Priority**: Tasks grouped by priority level (high/medium/low)
3. **By Category**: Tasks grouped by category (work/home/personal)
4. **By Due Date**: Tasks grouped by due date proximity

## Storage Model

### localStorage Schema

Tasks are stored in browser localStorage with the following structure:

```
localStorage key: "todo-app-tasks"
localStorage value: JSON string of Task[] array
```

Example:
```json
[
  {
    "id": "task-12345",
    "title": "Complete project proposal",
    // ... other task properties
  },
  {
    "id": "task-67890",
    "title": "Buy groceries",
    // ... other task properties
  }
]
```

### localStorage Metadata

Additional localStorage keys for application state:

```
"todo-app-filter": JSON string of Filter Configuration
"todo-app-sort": JSON string of Sort Configuration
"todo-app-settings": JSON string of user preferences
```

## Data Lifecycle

### Creation

1. User creates a new task via UI
2. Frontend validates input data
3. System generates unique ID (UUID v4)
4. System sets createdAt to current timestamp
5. System sets updatedAt to current timestamp
6. System applies default values for optional fields
7. Task is added to tasks array
8. Tasks array is serialized and saved to localStorage

### Reading

1. Application loads tasks array from localStorage
2. JSON string is parsed into Task[] objects
3. Date strings are converted to Date objects where appropriate
4. Tasks are filtered and sorted based on current configuration

### Updating

1. User modifies a task via UI
2. Frontend validates updated data
3. System updates updatedAt timestamp
4. Modified task replaces original in tasks array
5. Tasks array is serialized and saved to localStorage

### Deletion

1. User deletes a task via UI
2. System removes task from tasks array
3. Tasks array is serialized and saved to localStorage

## Indexing Strategy

### Primary Index

- **Field**: id
- **Type**: Unique
- **Purpose**: Fast retrieval of specific tasks

### Secondary Indexes (Virtual)

These indexes are computed at runtime during filtering/sorting operations:

1. **Status Index**: Virtual grouping by completed field
2. **Priority Index**: Virtual grouping by priority field
3. **Category Index**: Virtual grouping by category field
4. **Date Index**: Virtual sorting by createdAt/updatedAt/dueDate fields
5. **Search Index**: Full-text search across title and description fields

## Data Integrity

### Consistency Rules

1. **Timestamp Consistency**: updatedAt must be >= createdAt for all operations
2. **Status Transition**: Only valid transitions allowed (pending ↔ completed)
3. **Unique IDs**: All task IDs must be unique within the collection
4. **Required Fields**: All required fields must have valid values

### Error Handling

1. **Validation Errors**: Reject operations with invalid data
2. **Storage Errors**: Gracefully handle localStorage quota exceeded
3. **Corruption Recovery**: Implement fallback for corrupted data
4. **Migration Support**: Handle schema evolution between versions

## Performance Considerations

### Query Performance

1. **Small Datasets**: Up to 100 tasks - All operations O(n)
2. **Medium Datasets**: 101-500 tasks - Filtering/sorting optimized with memoization
3. **Large Datasets**: 501-1000 tasks - Consider virtualization for display

### Memory Usage

1. **Average Task Size**: ~500 bytes per task (including all fields)
2. **Maximum Storage**: ~500KB for 1000 tasks (well under localStorage limits)
3. **Serialization Overhead**: Minimal with JSON format

## Migration Strategy

### Schema Evolution

Future schema changes will be handled with versioned migrations:

1. **Version Detection**: Check schema version in localStorage
2. **Migration Pipeline**: Apply sequential migrations to reach current version
3. **Backup Strategy**: Create backup before applying migrations
4. **Rollback Capability**: Maintain ability to rollback if needed

### Example Migration

From v1.0 to v1.1 (adding recurrence field):
```javascript
function migrateV1ToV2(tasks) {
  return tasks.map(task => ({
    ...task,
    recurrence: task.recurrence || null
  }));
}
```

## Security Considerations

### Data Protection

1. **Client-Side Only**: Data stored locally, no transmission over network
2. **No Sensitive Data**: No PII or sensitive information stored
3. **Sanitization**: Input sanitized to prevent XSS in display

### Privacy

1. **Local Storage**: Data remains on user's device only
2. **No Analytics**: No data transmitted to external services
3. **Clear Mechanism**: Easy data clearing through UI

## Backup and Recovery

### Auto-Save

1. **Immediate Persistence**: Changes saved to localStorage immediately
2. **Conflict Resolution**: Last-write-wins strategy for concurrent modifications

### Manual Export/Import (Future Enhancement)

1. **JSON Export**: Tasks exported as JSON file
2. **JSON Import**: Tasks imported from JSON file with validation
3. **Format Compatibility**: Maintain backward compatibility