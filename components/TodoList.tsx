'use client';

import { toast } from 'sonner';
import { todosApi, Todo } from '@/lib/api';

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
  onUpdate: () => void;
}

export function TodoList({ todos, selectedDate, onUpdate }: TodoListProps) {
  const handleToggle = async (todoId: string, isRecurring: boolean) => {
    try {
      await todosApi.toggle(
        todoId,
        isRecurring ? selectedDate.getTime() : undefined
      );
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleDelete = async (todoId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await todosApi.delete(todoId);
        toast.success('Task deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete task');
        console.error(error);
      }
    }
  };

  const isCompleted = (todo: Todo) => {
    if (todo.isRecurring) {
      const dateKey = new Date(selectedDate).setHours(0, 0, 0, 0);
      const completedDates = todo.completedDates || [];
      return completedDates.includes(dateKey);
    }
    return todo.completed;
  };

  const getRecurringLabel = (todo: Todo) => {
    if (!todo.isRecurring) return null;

    if (todo.recurringType === 'daily') {
      return 'Daily';
    } else if (todo.recurringType === 'weekly') {
      return 'Weekly';
    }
    return 'Recurring';
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks for this day
        </h3>
        <p className="text-gray-600">Add a new task to get started!</p>
      </div>
    );
  }

  const completedTodos = todos.filter((todo) => isCompleted(todo));
  const pendingTodos = todos.filter((todo) => !isCompleted(todo));

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Pending Tasks ({pendingTodos.length})
          </h3>
          <div className="space-y-3">
            {pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isCompleted={isCompleted(todo)}
                onToggle={() => handleToggle(todo.id, todo.isRecurring)}
                onDelete={() => handleDelete(todo.id)}
                recurringLabel={getRecurringLabel(todo)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Completed Tasks ({completedTodos.length})
          </h3>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isCompleted={isCompleted(todo)}
                onToggle={() => handleToggle(todo.id, todo.isRecurring)}
                onDelete={() => handleDelete(todo.id)}
                recurringLabel={getRecurringLabel(todo)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  recurringLabel: string | null;
}

function TodoItem({
  todo,
  isCompleted,
  onToggle,
  onDelete,
  recurringLabel,
}: TodoItemProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        isCompleted
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0 cursor-pointer"
          type="button"
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isCompleted
                ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isCompleted && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`font-medium ${
                isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h4>
            {recurringLabel && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {recurringLabel}
              </span>
            )}
          </div>

          {todo.description && (
            <p
              className={`text-sm ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>

        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

