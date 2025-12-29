"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { ChevronRightIcon, EllipsisIcon } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function WritingsListContent() {
    const writings = useQuery(api.writing.list);
    const toggleSharing = useMutation(api.writing.toggleSharing);
    const deleteWriting = useMutation(api.writing.deleteWriting);
    const [, setNow] = useState(Date.now());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [writingToDelete, setWritingToDelete] =
        useState<Id<"writings"> | null>(null);

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
            toast.success("Writing shared");
        }

        // Copy link to clipboard
        const shareUrl = `${window.location.origin}/writings/${writingId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopiedId(writingId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy link");
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
        toast.success("Writing made private");
    };

    const handleDeleteClick = async (
        e: React.MouseEvent,
        writingId: Id<"writings">
    ) => {
        e.preventDefault();
        e.stopPropagation();

        // Skip confirmation if Control key is held
        if (e.ctrlKey || e.metaKey) {
            await deleteWriting({ id: writingId });
            toast.success("Writing deleted");
            return;
        }

        setWritingToDelete(writingId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (writingToDelete) {
            await deleteWriting({ id: writingToDelete });
            toast.success("Writing deleted");
            setDeleteDialogOpen(false);
            setWritingToDelete(null);
        }
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

                const shareButtonText =
                    copiedId === writing._id
                        ? "Copied"
                        : writing.shared
                          ? "Copy link"
                          : "Share";

                const textPreview = writing.textPreview
                    ? writing.textPreview.slice(0, 100)
                    : "New Writing";

                return (
                    <Link
                        key={writing._id}
                        href={`/writings/${writing._id}`}
                        className="border-border bg-card hover:bg-accent/20 block rounded-lg border p-6 transition-colors hover:duration-0"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1 overflow-hidden">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-foreground max-w-md truncate font-medium">
                                        {textPreview}
                                    </h2>
                                    {isTimerRunning && (
                                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                            Active
                                        </span>
                                    )}
                                    {writing.shared && (
                                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            Shared
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">
                                            {createdDate.toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                        <span className="text-muted-foreground">
                                            ·
                                        </span>
                                        <span className="text-muted-foreground">
                                            Edited{" "}
                                            {formatRelativeTime(
                                                writing.updatedAt
                                            )}
                                        </span>
                                    </div>

                                    <span className="text-muted-foreground hidden md:inline">
                                        ·
                                    </span>

                                    <div className="flex items-center gap-2">
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
                                            {shareButtonText}
                                        </Button>

                                        {writing.shared && (
                                            <>
                                                <span className="text-muted-foreground">
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

                                        <span className="text-muted-foreground">
                                            ·
                                        </span>
                                        <Button
                                            onClick={(e) =>
                                                handleDeleteClick(
                                                    e,
                                                    writing._id
                                                )
                                            }
                                            className="text-muted-foreground hover:text-destructive text-sm underline decoration-dotted underline-offset-2 transition-colors"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-muted-foreground">
                                <ChevronRightIcon />
                            </div>
                        </div>
                    </Link>
                );
            })}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete writing?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your writing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
