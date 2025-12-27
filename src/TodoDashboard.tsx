import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AddTodoForm } from "./AddTodoForm";
import { TodoList } from "./TodoList";
import { WeeklyView } from "./WeeklyView";

export function TodoDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [showAddForm, setShowAddForm] = useState(false);

  const todosForDate = useQuery(api.todos.getTodosForDate, { 
    date: selectedDate.getTime() 
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatWeek = (date: Date) => {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (view === "daily") {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === "weekly") {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getViewTitle = () => {
    if (view === "daily") return formatDate(selectedDate);
    if (view === "weekly") return formatWeek(selectedDate);
    return selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      {/* View Toggle and Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("daily")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === "daily" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === "weekly" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === "monthly" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Monthly View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
          >
            Today
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {getViewTitle()}
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          + Add Task
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <AddTodoForm onClose={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Content based on view */}
      {view === "daily" && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <TodoList todos={todosForDate || []} selectedDate={selectedDate} />
        </div>
      )}

      {view === "weekly" && (
        <div className="space-y-4">
          <WeeklyView selectedDate={selectedDate} />
        </div>
      )}

      {view === "monthly" && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(selectedDate).map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded cursor-pointer transition-colors ${
                  day ? 'hover:bg-gray-50' : ''
                } ${
                  day && day.toDateString() === new Date().toDateString() 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'border-gray-200'
                }`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div className="font-semibold text-sm mb-1">{day.getDate()}</div>
                    <MonthlyTodoPreview date={day} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MonthlyTodoPreview({ date }: { date: Date }) {
  const todos = useQuery(api.todos.getTodosForDate, { date: date.getTime() });
  
  if (!todos || todos.length === 0) return null;

  const completedCount = todos.filter(todo => {
    if (todo.isRecurring) {
      const dateKey = new Date(date).setHours(0, 0, 0, 0);
      return todo.completedDates?.includes(dateKey);
    }
    return todo.completed;
  }).length;

  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-600">
        {completedCount}/{todos.length} done
      </div>
      {todos.slice(0, 2).map((todo, index) => (
        <div key={index} className="text-xs p-1 bg-gray-100 rounded truncate">
          {todo.title}
        </div>
      ))}
      {todos.length > 2 && (
        <div className="text-xs text-gray-500">+{todos.length - 2} more</div>
      )}
    </div>
  );
}
