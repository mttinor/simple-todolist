import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  todos: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    dueDate: v.optional(v.number()), // timestamp
    isRecurring: v.boolean(),
    recurringType: v.optional(v.union(v.literal("weekly"), v.literal("daily"))),
    recurringDays: v.optional(v.array(v.number())), // 0-6 for Sunday-Saturday
    completedDates: v.optional(v.array(v.number())), // timestamps of completion dates for recurring tasks
  })
    .index("by_user", ["userId"])
    .index("by_user_and_due_date", ["userId", "dueDate"])
    .index("by_user_and_recurring", ["userId", "isRecurring"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
