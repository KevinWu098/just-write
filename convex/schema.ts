import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    writings: defineTable({
        timerDuration: v.union(v.number(), v.null()), // Initial timer duration in minutes, null for infinite timer
        timerStartedAt: v.union(v.number(), v.null()), // Timestamp when timer started (null if not started)
        createdBy: v.string(), // For now just a string, can be linked to users table later when auth is added
        updatedAt: v.number(), // Timestamp for last update
    }),
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
