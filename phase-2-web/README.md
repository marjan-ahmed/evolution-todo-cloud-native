# Interactive Web Todo Application

A modern, responsive web-based todo application built with Next.js, TypeScript, and Tailwind CSS. The application provides advanced task management features with an intuitive user interface.

## Features

- **Task Management**: Add, view, edit, and delete tasks
- **Status Tracking**: Mark tasks as complete/incomplete
- **Priority Levels**: Assign high, medium, or low priority to tasks
- **Categories**: Organize tasks into work, home, or personal categories
- **Due Dates**: Set due dates with calendar picker
- **Search & Filter**: Find tasks by keyword or filter by status, priority, or category
- **Statistics**: View task completion rates and other metrics
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark Mode**: Automatic dark/light mode based on system preference
- **Persistent Storage**: Tasks saved in browser's localStorage

## Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: Component-based UI library
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Date manipulation utilities
- **uuid**: Unique ID generation
- **Lucide React**: Icon library (coming soon)

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd phase-2-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To build the application for production:

```bash
npm run build
```

Then run the production server:

```bash
npm run start
```

## Project Structure

```
phase-2-web/
├── src/
│   ├── app/                 # Next.js pages and layout
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md
```

## Components

### Core Components

- **TaskForm**: Component for adding and editing tasks
- **TaskTable**: Displays tasks in a responsive table format
- **TaskStats**: Shows task statistics and completion rates
- **TaskFilters**: Provides filtering and search functionality

### Custom Hooks

- **useTaskManager**: Manages all task operations and state
- **useLocalStorage**: Handles persistent storage in localStorage

## Data Model

The application uses a Task entity with the following properties:

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  priority: 'high' | 'medium' | 'low';
  category?: 'work' | 'home' | 'personal';
  dueDate?: string; // ISO date string or null
  recurrence?: 'daily' | 'weekly' | 'monthly' | null;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
