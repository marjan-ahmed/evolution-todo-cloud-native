import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, FilterConfig, SortConfig, UseTaskManagerReturn } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useTaskManager(): UseTaskManagerReturn {
  // Initialize with localStorage or empty array
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-app-tasks', []);

  // Initialize filter and sort configs
  const [filter, setFilter] = useLocalStorage<FilterConfig>('todo-app-filter', {
    status: 'all',
    priority: null,
    category: null,
    searchQuery: ''
  });

  const [sort, setSort] = useLocalStorage<SortConfig>('todo-app-sort', {
    by: 'date',
    order: 'desc'
  });

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Title is required');
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title.trim(),
      description: taskData.description?.trim(),
      completed: taskData.completed ?? false,
      createdAt: now,
      updatedAt: now,
      priority: taskData.priority ?? 'medium',
      category: taskData.category,
      dueDate: taskData.dueDate,
      recurrence: taskData.recurrence ?? null
    };

    setTasks([...tasks, newTask]);
  };

  // Update an existing task
  const updateTask = (id: string, updates: Partial<Task>) => {
    if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
      throw new Error('Title is required');
    }

    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          ...updates,
          title: updates.title ? updates.title.trim() : task.title,
          description: updates.description !== undefined ? updates.description?.trim() : task.description,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle task completion status
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }));
  };

  // Set filter configuration
  const setFilterConfig = (newFilter: FilterConfig) => {
    setFilter(newFilter);
  };

  // Set sort configuration
  const setSortConfig = (newSort: SortConfig) => {
    setSort(newSort);
  };

  // Set search query
  const setSearchQuery = (query: string) => {
    setFilter(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  // Get filtered and sorted tasks
  const getFilteredAndSortedTasks = (): Task[] => {
    let filteredTasks = [...tasks];

    // Apply status filter
    if (filter.status && filter.status !== 'all') {
      if (filter.status === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
      } else if (filter.status === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
      }
    }

    // Apply priority filter
    if (filter.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
    }

    // Apply category filter
    if (filter.category) {
      filteredTasks = filteredTasks.filter(task => task.category === filter.category);
    }

    // Apply search filter
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const query = filter.searchQuery.toLowerCase().trim();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'priority':
          // Map priority to numeric value for comparison (high: 2, medium: 1, low: 0)
          const priorityValues: Record<string, number> = { high: 2, medium: 1, low: 0 };
          comparison = priorityValues[b.priority] - priorityValues[a.priority]; // Descending: high first
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
      }

      // Apply ascending/descending order
      return sort.order === 'asc' ? comparison : -comparison;
    });

    return filteredTasks;
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter: setFilterConfig,
    setSort: setSortConfig,
    setSearchQuery,
    filter,
    sort,
    getFilteredAndSortedTasks
  };
}