'use client';

import { FilterConfig } from '@/types/task';

interface TaskFiltersProps {
  filter: FilterConfig;
  onFilterChange: (filter: FilterConfig) => void;
  onSearchChange: (query: string) => void;
}

export default function TaskFilters({ filter, onFilterChange, onSearchChange }: TaskFiltersProps) {
  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityChange = (priority: 'high' | 'medium' | 'low' | null) => {
    onFilterChange({ ...filter, priority });
  };

  const handleCategoryChange = (category: 'work' | 'home' | 'personal' | null) => {
    onFilterChange({ ...filter, category });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filter.searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Search tasks..."
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <div className="flex space-x-2">
            {(['all', 'active', 'completed'] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`flex-1 px-2 py-1 text-xs rounded ${
                  filter.status === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleStatusChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="flex space-x-1">
            {(['high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                className={`flex-1 px-2 py-1 text-xs rounded ${
                  filter.priority === priority
                    ? priority === 'high'
                      ? 'bg-red-600 text-white'
                      : priority === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handlePriorityChange(priority)}
              >
                {priority.charAt(0).toUpperCase()}
              </button>
            ))}
            <button
              type="button"
              className={`flex-1 px-2 py-1 text-xs rounded ${
                filter.priority === null
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handlePriorityChange(null)}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {(['work', 'home', 'personal'] as const).map((category) => (
            <button
              key={category}
              type="button"
              className={`px-3 py-1 text-sm rounded-full ${
                filter.category === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
          <button
            type="button"
            className={`px-3 py-1 text-sm rounded-full ${
              filter.category === null
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
}