import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    isRecurring: v.boolean(),
    recurringType: v.optional(v.union(v.literal("weekly"), v.literal("daily"))),
    recurringDays: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("todos", {
      userId,
      title: args.title,
      description: args.description,
      completed: false,
      dueDate: args.dueDate,
      isRecurring: args.isRecurring,
      recurringType: args.recurringType,
      recurringDays: args.recurringDays,
      completedDates: [],
    });
  },
});

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getTodosForDate = query({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const startOfDay = new Date(args.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(args.date);
    endOfDay.setHours(23, 59, 59, 999);

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const dayOfWeek = new Date(args.date).getDay();

    return todos.filter((todo) => {
      if (todo.isRecurring) {
        // Check if this recurring task should appear on this day
        if (todo.recurringType === "weekly" && todo.recurringDays) {
          return todo.recurringDays.includes(dayOfWeek);
        }
        if (todo.recurringType === "daily") {
          return true;
        }
        return false;
      } else {
        // One-time task - check if due date matches
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          return dueDate >= startOfDay && dueDate <= endOfDay;
        }
        return false;
      }
    });
  },
});

export const toggleTodo = mutation({
  args: { 
    todoId: v.id("todos"),
    date: v.optional(v.number()) // for recurring tasks, track which date was completed
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.todoId);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found");
    }

    if (todo.isRecurring && args.date) {
      // For recurring tasks, track completion by date
      const completedDates = todo.completedDates || [];
      const dateKey = new Date(args.date).setHours(0, 0, 0, 0);
      
      if (completedDates.includes(dateKey)) {
        // Remove completion for this date
        await ctx.db.patch(args.todoId, {
          completedDates: completedDates.filter(d => d !== dateKey)
        });
      } else {
        // Add completion for this date
        await ctx.db.patch(args.todoId, {
          completedDates: [...completedDates, dateKey]
        });
      }
    } else {
      // For one-time tasks, toggle completed status
      await ctx.db.patch(args.todoId, {
        completed: !todo.completed
      });
    }
  },
});

export const deleteTodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.todoId);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found");
    }

    await ctx.db.delete(args.todoId);
  },
});
