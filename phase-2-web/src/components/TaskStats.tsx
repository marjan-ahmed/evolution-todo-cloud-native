'use client';

import { Task } from '@/types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  // Calculate statistics
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate priority distribution
  const highPriority = tasks.filter(task => task.priority === 'high').length;
  const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
  const lowPriority = tasks.filter(task => task.priority === 'low').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{total}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</div>
        <div className="mt-1 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{pending}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</div>
        <div className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">{completed}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</div>
        <div className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">{completionRate}%</div>
      </div>
    </div>
  );
}