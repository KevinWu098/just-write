"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { ChevronRightIcon, EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

function WritingsListContent() {
    const writings = useQuery(api.writing.list);
    const toggleSharing = useMutation(api.writing.toggleSharing);
    const [, setNow] = useState(Date.now());
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleShare = async (
        e: React.MouseEvent,
        writingId: Id<"writings">,
        isCurrentlyShared: boolean
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isCurrentlyShared) {
            // Enable sharing
            await toggleSharing({ id: writingId, shared: true });
        }

        // Copy link to clipboard
        const shareUrl = `${window.location.origin}/writings/${writingId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedId(writingId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleToggleSharing = async (
        e: React.MouseEvent,
        writingId: Id<"writings">,
        shared: boolean
    ) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleSharing({ id: writingId, shared });
    };

    if (!writings) {
        return (
            <div className="my-16 flex items-center justify-center">
                <EllipsisIcon className="text-muted-foreground mx-auto size-8" />
            </div>
        );
    }

    if (writings.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                <p className="mb-4">No writings yet.</p>
                <Link
                    href="/"
                    className="text-foreground font-medium hover:underline"
                >
                    Begin →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {writings.map((writing) => {
                const createdDate = new Date(writing._creationTime);

                // Check if timer is actually running (started and not expired)
                let isTimerRunning = false;
                if (
                    writing.timerStartedAt !== null &&
                    writing.timerDuration !== null
                ) {
                    const elapsed = Date.now() - writing.timerStartedAt;
                    const totalDuration = writing.timerDuration * 60 * 1000; // Convert minutes to ms
                    isTimerRunning = elapsed < totalDuration;
                }

                return (
                    <Link
                        key={writing._id}
                        href={`/writings/${writing._id}`}
                        className="border-border bg-card hover:bg-accent/50 block rounded-lg border p-6 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-foreground font-medium">
                                        Writing from{" "}
                                        {createdDate.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </h2>
                                    {isTimerRunning && (
                                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-muted-foreground text-sm">
                                        Last edited{" "}
                                        {formatRelativeTime(writing.updatedAt)}
                                    </p>
                                    {writing.shared && (
                                        <>
                                            <span className="text-muted-foreground text-sm">
                                                ·
                                            </span>
                                            <Button
                                                onClick={(e) =>
                                                    handleShare(
                                                        e,
                                                        writing._id,
                                                        writing.shared ?? false
                                                    )
                                                }
                                                className="text-muted-foreground hover:text-foreground text-sm underline decoration-dotted underline-offset-2 transition-colors"
                                            >
                                                {copiedId === writing._id
                                                    ? "Copied"
                                                    : "Copy link"}
                                            </Button>
                                            <span className="text-muted-foreground text-sm">
                                                ·
                                            </span>
                                            <Button
                                                onClick={(e) =>
                                                    handleToggleSharing(
                                                        e,
                                                        writing._id,
                                                        false
                                                    )
                                                }
                                                className="text-muted-foreground hover:text-foreground text-sm underline decoration-dotted underline-offset-2 transition-colors"
                                            >
                                                Make private
                                            </Button>
                                        </>
                                    )}
                                    {!writing.shared && (
                                        <>
                                            <span className="text-muted-foreground text-sm">
                                                ·
                                            </span>
                                            <Button
                                                onClick={(e) =>
                                                    handleShare(
                                                        e,
                                                        writing._id,
                                                        false
                                                    )
                                                }
                                                className="text-muted-foreground hover:text-foreground text-sm underline decoration-dotted underline-offset-2 transition-colors"
                                            >
                                                {copiedId === writing._id
                                                    ? "Copied"
                                                    : "Share"}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-muted-foreground">
                                <ChevronRightIcon />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function WritingsList() {
    return (
        <Authenticated>
            <WritingsListContent />
        </Authenticated>
    );
}
