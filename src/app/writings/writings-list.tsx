"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useQuery } from "convex/react";
import { ChevronRightIcon } from "lucide-react";

import { api } from "convex/_generated/api";

export function WritingsList() {
    const writings = useQuery(api.writing.list);
    const [, setNow] = useState(Date.now());

    // Update every second to keep timer status fresh
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!writings) {
        return null;
    }

    if (writings.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                <p className="mb-4">No writings yet.</p>
                <Link
                    href="/"
                    className="text-foreground font-medium hover:underline"
                >
                    Start your first writing →
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
                        href={`/${writing._id}`}
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
                                <p className="text-muted-foreground text-sm">
                                    {writing.timerDuration === null
                                        ? "No timer"
                                        : `${writing.timerDuration} minute${writing.timerDuration !== 1 ? "s" : ""}`}
                                    {" · "}
                                    Last edited{" "}
                                    {formatRelativeTime(writing.updatedAt)}
                                </p>
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
