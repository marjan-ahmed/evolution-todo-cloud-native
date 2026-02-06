// Task entity type definition
export interface Task {
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

// Filter Configuration type
export interface FilterConfig {
  status?: 'all' | 'active' | 'completed';
  priority?: 'high' | 'medium' | 'low' | null;
  category?: 'work' | 'home' | 'personal' | null;
  searchQuery?: string;
}

// Sort Configuration type
export interface SortConfig {
  by: 'date' | 'priority' | 'title' | 'dueDate';
  order: 'asc' | 'desc';
}

// Task Manager return type
export interface UseTaskManagerReturn {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: FilterConfig) => void;
  setSort: (sort: SortConfig) => void;
  setSearchQuery: (query: string) => void;
  filter: FilterConfig;
  sort: SortConfig;
  getFilteredAndSortedTasks: () => Task[];
}