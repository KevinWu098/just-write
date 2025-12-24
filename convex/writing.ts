import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";

// Initialize ProseMirror Sync component
const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);

// Export the sync API
export const {
    getSnapshot,
    submitSnapshot,
    latestVersion,
    getSteps,
    submitSteps,
} = prosemirrorSync.syncApi({
    // Optional: You can add authorization here later
    // authorize: async (ctx, docId) => { ... }
});

// Create a new writing with an empty ProseMirror document
export const create = mutation({
    args: {
        timerDuration: v.optional(v.union(v.number(), v.null())),
    },
    handler: async (ctx, args) => {
        const writingId = await ctx.db.insert("writings", {
            timerDuration: args.timerDuration ?? 5,
            createdBy: "anonymous", // TODO: Add auth later
            updatedAt: Date.now(),
        });

        // Initialize the ProseMirror document
        try {
            await prosemirrorSync.create(ctx, writingId, {
                type: "doc",
                content: [],
            });
        } catch (error) {
            console.error("Error creating ProseMirror document:", error);
            // Document might already exist, that's okay
        }

        return writingId;
    },
});

// Get a single writing by ID (with metadata)
export const get = query({
    args: {
        id: v.id("writings"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get all writings (for future use)
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("writings").order("desc").collect();
    },
});

// Update timer duration
export const updateTimer = mutation({
    args: {
        id: v.id("writings"),
        timerDuration: v.union(v.number(), v.null()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            timerDuration: args.timerDuration,
            updatedAt: Date.now(),
        });
    },
});
