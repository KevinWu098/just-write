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
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const writingId = await ctx.db.insert("writings", {
            timerDuration:
                args.timerDuration !== undefined ? args.timerDuration : 5,
            timerStartedAt: null,
            createdBy: identity.subject,
            updatedAt: Date.now(),
            shared: false,
            sessionEnded: false,
        });

        try {
            await prosemirrorSync.create(ctx, writingId, {
                type: "doc",
                content: [],
            });
        } catch (error) {
            // Document might already exist, that's okay
            console.error("Error creating ProseMirror document:", error);
        }

        return writingId;
    },
});

export const get = query({
    args: {
        id: v.id("writings"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const writing = await ctx.db.get(args.id);

        if (!writing) {
            return null;
        }

        // Allow access if:
        // 1. User is the owner
        // 2. Document is shared (even if not authenticated)
        if (identity && writing.createdBy === identity.subject) {
            return writing;
        }

        if (writing.shared) {
            return writing;
        }

        return null;
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const writings = await ctx.db
            .query("writings")
            .filter((q) => q.eq(q.field("createdBy"), identity.subject))
            .order("desc")
            .collect();

        const writingsWithPreview = await Promise.all(
            writings.map(async (writing) => {
                try {
                    const snapshot = await ctx.runQuery(
                        components.prosemirrorSync.lib.getSnapshot,
                        { id: writing._id }
                    );
                    let textPreview = "";

                    // Extract text from ProseMirror document
                    if (snapshot.content) {
                        const doc = JSON.parse(snapshot.content);
                        const extractText = (node: any): string => {
                            if (node.text) {
                                return node.text;
                            }
                            if (node.content && Array.isArray(node.content)) {
                                return node.content
                                    .map((child: any) => extractText(child))
                                    .join(" ");
                            }
                            return "";
                        };

                        textPreview = extractText(doc).trim();
                    }

                    return {
                        ...writing,
                        textPreview: textPreview || null,
                    };
                } catch (error) {
                    // If there's an error fetching the snapshot, just return without preview
                    return {
                        ...writing,
                        textPreview: null,
                    };
                }
            })
        );

        return writingsWithPreview;
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
        endSession: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const writing = await ctx.db.get(args.id);
        if (!writing) return;

        // If ending an unlimited session
        if (args.endSession && writing.timerDuration === null) {
            await ctx.db.patch(args.id, {
                sessionEnded: true,
                updatedAt: Date.now(),
            });
            return;
        }

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

export const toggleSharing = mutation({
    args: {
        id: v.id("writings"),
        shared: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const writing = await ctx.db.get(args.id);

        if (!writing) {
            throw new Error("Writing not found");
        }

        if (writing.createdBy !== identity.subject) {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            shared: args.shared,
            updatedAt: Date.now(),
        });
    },
});

export const getShared = query({
    args: {
        id: v.id("writings"),
    },
    handler: async (ctx, args) => {
        const writing = await ctx.db.get(args.id);

        if (!writing) {
            return null;
        }

        if (!writing.shared) {
            return null;
        }

        return writing;
    },
});
