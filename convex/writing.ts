import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";

const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);
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

export const create = mutation({
    args: {
        timerDuration: v.optional(v.union(v.number(), v.null())),
    },
    handler: async (ctx, args) => {
        const writingId = await ctx.db.insert("writings", {
            timerDuration:
                args.timerDuration !== undefined ? args.timerDuration : 5,
            timerStartedAt: null,
            createdBy: "anonymous", // TODO: Add auth later
            updatedAt: Date.now(),
        });

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

export const get = query({
    args: {
        id: v.id("writings"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("writings").order("desc").collect();
    },
});

export const startTimer = mutation({
    args: {
        id: v.id("writings"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            timerStartedAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const updateTimer = mutation({
    args: {
        id: v.id("writings"),
        timerDuration: v.union(v.number(), v.null()),
    },
    handler: async (ctx, args) => {
        const writing = await ctx.db.get(args.id);
        if (!writing) return;

        // If timer is running, calculate elapsed time and adjust start time
        let newStartTime = writing.timerStartedAt;
        if (writing.timerStartedAt && writing.timerDuration !== null) {
            const elapsed = Date.now() - writing.timerStartedAt;
            const oldTotalMs = writing.timerDuration * 60 * 1000;
            const newTotalMs = (args.timerDuration ?? 0) * 60 * 1000;
            // Adjust start time to maintain the same remaining time percentage
            newStartTime = Date.now() - (elapsed * newTotalMs) / oldTotalMs;
        }

        await ctx.db.patch(args.id, {
            timerDuration: args.timerDuration,
            timerStartedAt: newStartTime,
            updatedAt: Date.now(),
        });
    },
});
