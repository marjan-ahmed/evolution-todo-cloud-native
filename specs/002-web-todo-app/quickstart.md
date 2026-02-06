# Quickstart Guide: Interactive Web Todo Application

**Feature**: Interactive Web Todo Application | **Spec**: [spec.md](./spec.md)

## Overview

This guide provides developers with everything needed to quickly set up, run, and contribute to the Interactive Web Todo Application. The application is a modern React/Next.js web app with TypeScript and Tailwind CSS.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.17.0 or higher
- **npm**: Version 9.0.0 or higher (or yarn/pnpm)
- **Git**: Version 2.0 or higher
- **Text Editor**: VS Code recommended with TypeScript/React extensions

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd phase-2-web
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies including:
- React 18.2+
- Next.js 14.0+
- TypeScript 5.0+
- Tailwind CSS
- date-fns
- lucide-react

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Verify Installation

Open your browser and navigate to `http://localhost:3000`. You should see the application running with the main dashboard interface.

## Project Structure

```
phase-2-web/
├── package.json              # Dependencies and scripts
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main dashboard page
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable UI components
│   │   ├── TaskTable.tsx
│   │   ├── TaskForm.tsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useTaskManager.ts
│   │   └── useLocalStorage.ts
│   └── types/               # TypeScript definitions
│       └── task.ts
└── tests/                   # Test files
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build production version |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check for code issues |
| `npm run type-check` | Run TypeScript compiler to check types |
| `npm run format` | Format code with Prettier |

## Core Concepts

### 1. Data Flow

The application follows a unidirectional data flow:
1. User interacts with UI components
2. Components call functions in custom hooks
3. Hooks update state and persist to localStorage
4. React re-renders components based on state changes

### 2. State Management

- **Local State**: React useState/useReducer for component-specific state
- **Global State**: Custom hooks (useTaskManager) for business logic
- **Persistence**: useLocalStorage hook for localStorage synchronization

### 3. Component Architecture

- **Atoms**: Basic UI elements (buttons, inputs, icons)
- **Molecules**: Combined atoms (input groups, button groups)
- **Organisms**: Complex components (task cards, filter panels)
- **Templates**: Layout structures
- **Pages**: Complete route views

## Common Tasks

### Adding a New Task

1. The TaskForm component collects user input
2. Input is validated before submission
3. useTaskManager.addTask() creates new task with unique ID
4. Task is added to state and persisted to localStorage
5. UI automatically updates to show new task

### Updating Task Status

1. User clicks checkbox in TaskTable
2. TaskTable calls useTaskManager.toggleTask()
3. Hook updates task status and timestamps
4. State updates trigger UI re-render
5. Statistics automatically update

### Filtering Tasks

1. User interacts with TaskFilters component
2. Filter state updates in useTaskManager hook
3. Computed property returns filtered task list
4. TaskTable re-renders with filtered results

## Development Best Practices

### 1. Component Creation

When creating new components:

```tsx
// components/NewComponent.tsx
'use client'

import { useState } from 'react'
import { Task } from '@/types/task'

interface NewComponentProps {
  tasks: Task[]
  onAction: (id: string) => void
}

export default function NewComponent({ tasks, onAction }: NewComponentProps) {
  // Component implementation
  return (
    <div className="container">
      {/* JSX with Tailwind classes */}
    </div>
  )
}
```

### 2. Hook Creation

When creating new hooks:

```ts
// hooks/useNewHook.ts
import { useState, useEffect } from 'react'

interface UseNewHookReturn {
  data: DataType
  loading: boolean
  error: string | null
}

export function useNewHook(params: Params): UseNewHookReturn {
  const [data, setData] = useState<DataType>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Effects and functions

  return { data, loading, error }
}
```

### 3. Type Definitions

Always use TypeScript for type safety:

```ts
// types/new-types.ts
export interface NewEntity {
  id: string
  name: string
  createdAt: string
  isActive: boolean
}

export type NewStatus = 'active' | 'inactive' | 'pending'
```

### 4. Styling with Tailwind

Use Tailwind utility classes with consistent design system:

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
    Component Title
  </h2>
  <p className="text-gray-600 dark:text-gray-300">
    Component content
  </p>
</div>
```

## Environment Configuration

### Development Environment

The application runs without special environment variables. All data is stored in browser localStorage.

### Production Environment

For deployment, ensure:
- Node.js 18+ runtime
- Sufficient disk space for user localStorage
- HTTPS for secure localStorage access

## Troubleshooting

### Common Issues

**Issue**: Application won't start
**Solution**: Verify Node.js version and run `npm install` again

**Issue**: Styles not loading
**Solution**: Check that Tailwind is properly configured and `globals.css` imports Tailwind directives

**Issue**: TypeScript errors
**Solution**: Run `npm run type-check` to identify specific issues

**Issue**: localStorage not persisting
**Solution**: Ensure browser allows localStorage and check for quota limits

### Debugging Tips

1. Use React DevTools browser extension for component inspection
2. Check browser console for errors and warnings
3. Use `console.log` in useEffect hooks to trace state changes
4. Verify localStorage content in browser developer tools

## Contributing

### Code Standards

- Use TypeScript for all new code
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks (no class components)
- Write descriptive commit messages
- Use present tense: "Add feature" not "Added feature"

### Testing

While formal tests aren't required for this project, ensure:
- Components render without errors
- User flows work as expected
- Responsive design works on different screen sizes
- Keyboard navigation functions properly

## Next Steps

1. **Explore Components**: Look at existing components to understand patterns
2. **Review Hooks**: Study useTaskManager for business logic patterns
3. **Check Types**: Review task.ts for data structure examples
4. **Run Locally**: Start the dev server and experiment with changes
5. **Follow Tasks**: Use the tasks.md file for structured implementation