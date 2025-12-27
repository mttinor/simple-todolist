'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { todosApi, Todo } from '@/lib/api';

interface WeeklyViewProps {
  selectedDate: Date;
  onUpdate?: () => void;
}

export function WeeklyView({ selectedDate, onUpdate }: WeeklyViewProps) {
  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Generate array of 7 days starting from Sunday
  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekStart = getWeekStart(selectedDate);
  const weekDays = getWeekDays(weekStart);
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleToggle = async (todoId: string, isRecurring: boolean, date: Date) => {
    try {
      await todosApi.toggle(todoId, isRecurring ? date.getTime() : undefined);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const isCompleted = (todo: Todo, date: Date) => {
    if (todo.isRecurring) {
      const dateKey = new Date(date).setHours(0, 0, 0, 0);
      const completedDates = todo.completedDates || [];
      return completedDates.includes(dateKey);
    }
    return todo.completed;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
      {weekDays.map((day, index) => (
        <DayCard
          key={day.toISOString()}
          date={day}
          dayName={dayNames[index]}
          onToggle={handleToggle}
          isCompleted={isCompleted}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

interface DayCardProps {
  date: Date;
  dayName: string;
  onToggle: (todoId: string, isRecurring: boolean, date: Date) => void;
  isCompleted: (todo: Todo, date: Date) => boolean;
  onUpdate?: () => void;
}

function DayCard({ date, dayName, onToggle, isCompleted, onUpdate }: DayCardProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await todosApi.getForDate(date.getTime());
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [date, onUpdate]);

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div
      className={`bg-white rounded-lg shadow-md border p-4 min-h-[300px] ${
        isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Day Header */}
      <div className="mb-4 text-center">
        <h3
          className={`font-semibold text-sm ${
            isToday ? 'text-blue-700' : 'text-gray-700'
          }`}
        >
          {dayName}
        </h3>
        <p
          className={`text-lg font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}
        >
          {date.getDate()}
        </p>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-xs">Loading...</p>
          </div>
        ) : todos && todos.length > 0 ? (
          todos.map((todo) => {
            const completed = isCompleted(todo, date);
            return (
              <div
                key={todo.id}
                className={`p-2 rounded border text-sm transition-all ${
                  completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => onToggle(todo.id, todo.isRecurring, date)}
                    className="flex-shrink-0 mt-0.5 cursor-pointer"
                    type="button"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                        completed
                          ? 'bg-green-500 border-green-500 text-white shadow-sm'
                          : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      {completed && (
                        <svg
                          className="w-2.5 h-2.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium leading-tight ${
                        completed ? 'line-through text-gray-600' : 'text-gray-900'
                      }`}
                    >
                      {todo.title}
                    </p>

                    {todo.description && (
                      <p
                        className={`text-xs mt-1 ${
                          completed ? 'line-through text-gray-500' : 'text-gray-600'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}

                    {todo.isRecurring && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        {todo.recurringType === 'daily' ? 'Daily' : 'Weekly'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-xs">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

