'use client';

import { useState } from 'react';
import { TaskForm, TaskTable, TaskStats, TaskFilters } from '@/components';
import { useTaskManager } from '@/hooks';
import { Task } from '@/types';

export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, getFilteredAndSortedTasks, filter, setFilter, setSearchQuery } = useTaskManager();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const filteredTasks = getFilteredAndSortedTasks();

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask.id, {
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      category: updatedTask.category,
      dueDate: updatedTask.dueDate,
    });
    setEditingTask(null);
    setShowEditForm(false);
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditForm(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm(`Are you sure you want to delete task "${tasks.find(t => t.id === id)?.title}"?`)) {
      deleteTask(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowEditForm(false);
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            TaskFlow Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Manage your tasks efficiently with advanced organization features
          </p>
        </div>

        <TaskStats tasks={tasks} />

        {!showEditForm ? (
          <>
            <TaskForm onSubmit={handleAddTask} />
            <TaskFilters
              filter={filter}
              onFilterChange={handleFilterChange}
              onSearchChange={setSearchQuery}
            />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Tasks</h2>
              <TaskTable
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </>
        ) : (
          <EditTaskForm
            task={editingTask!}
            onUpdate={handleUpdateTask}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
}

// Separate component for editing tasks
function EditTaskForm({ task, onUpdate, onCancel }: { task: Task; onUpdate: (task: Task) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(task.priority);
  const [category, setCategory] = useState<'work' | 'home' | 'personal' | undefined>(task.category);
  const [dueDate, setDueDate] = useState<string>(task.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    onUpdate({
      ...task,
      title,
      description: description || undefined,
      priority,
      category: category || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Task</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Task title"
            maxLength={500}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Task description (optional)"
            rows={3}
            maxLength={2000}
          />
        </div>

        <div>
          <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="edit-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="edit-category"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value ? e.target.value as 'work' | 'home' | 'personal' : undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">None</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="edit-dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}