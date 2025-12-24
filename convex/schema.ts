import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    writings: defineTable({
        timerDuration: v.union(v.number(), v.null()), // Remaining time in seconds, null for infinite timer
        createdBy: v.string(), // For now just a string, can be linked to users table later when auth is added
        updatedAt: v.number(), // Timestamp for last update
    }),
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
