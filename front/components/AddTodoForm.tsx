'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { todosApi, CreateTodoDto } from '@/lib/api';

interface AddTodoFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTodoForm({ onClose, onSuccess }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (isRecurring && recurringType === 'weekly' && selectedDays.length === 0) {
      toast.error('Please select at least one day for weekly recurring tasks');
      return;
    }

    try {
      const data: CreateTodoDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        isRecurring,
        recurringType: isRecurring ? recurringType : undefined,
        recurringDays:
          isRecurring && recurringType === 'weekly'
            ? selectedDays
            : isRecurring && recurringType === 'daily'
            ? [0, 1, 2, 3, 4, 5, 6]
            : undefined,
      };

      await todosApi.create(data);
      toast.success('Task added successfully!');
      onSuccess();
      onClose();

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsRecurring(false);
      setRecurringType('weekly');
      setSelectedDays([]);
    } catch (error) {
      toast.error('Failed to add task');
      console.error(error);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Add New Task</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description..."
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
          Recurring Task
        </label>
      </div>

      {isRecurring && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recurrence Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="weekly"
                  checked={recurringType === 'weekly'}
                  onChange={(e) => setRecurringType(e.target.value as 'weekly')}
                  className="mr-2"
                />
                Weekly
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="daily"
                  checked={recurringType === 'daily'}
                  onChange={(e) => setRecurringType(e.target.value as 'daily')}
                  className="mr-2"
                />
                Daily
              </label>
            </div>
          </div>

          {recurringType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dayNames.map((day, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(index)}
                      onChange={() => toggleDay(index)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isRecurring && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

