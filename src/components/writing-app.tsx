"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArrowLeftIcon, EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TimerAdjust } from "@/components/timer-adjust";
import { TimerDisplay } from "@/components/timer-display";
import { WritingEditor } from "@/components/writing-editor";

type Writing = {
    _id: Id<"writings">;
    timerDuration: number | null;
    timerStartedAt: number | null;
    createdBy: string;
    updatedAt: number;
    _creationTime: number;
};

interface WritingAppProps {
    document?: Writing | null;
    id: string;
    readOnly?: boolean;
    isAuthenticated?: boolean;
}

export function WritingApp({
    document,
    id,
    readOnly = false,
    isAuthenticated = true,
}: WritingAppProps) {
    const updateTimer = useMutation(api.writing.updateTimer);
    const startTimer = useMutation(api.writing.startTimer);
    const sync = useTiptapSync(api.writing, id);
    const [duration, setDuration] = useState<number | null>(
        document?.timerDuration ?? 10
    );
    const [wordCount, setWordCount] = useState(0);
    const [showTimerAdjust, setShowTimerAdjust] = useState(false);
    const [editor, setEditor] = useState<any>(null);

    // Derive timer ended state from document data
    const timerEnded =
        document && document.timerStartedAt && document.timerDuration !== null
            ? (Date.now() - document.timerStartedAt) / 1000 >=
              document.timerDuration * 60
            : false;

    // Derive state from timerEnded and readOnly
    const isWriting = !timerEnded && !readOnly;
    const isLocked = readOnly || timerEnded;

    // Start the timer immediately when document loads (not in read-only mode)
    useEffect(() => {
        if (document && !document.timerStartedAt && !readOnly) {
            void startTimer({ id: document._id });
        }
    }, [document, startTimer, readOnly]);

    // Update duration when document changes
    useEffect(() => {
        if (document) {
            setDuration(document.timerDuration);
        }
    }, [document?.timerDuration]);

    // Update word count when editor content changes
    useEffect(() => {
        if (editor) {
            const updateWordCount = () => {
                const text = editor.getText();
                const count = text.trim() ? text.trim().split(/\s+/).length : 0;
                setWordCount(count);
            };

            // Initial word count
            updateWordCount();

            // Listen for updates
            editor.on("update", updateWordCount);
            return () => {
                editor.off("update", updateWordCount);
            };
        }
    }, [editor]);

    const handleTimerEnd = useCallback(() => {
        // Timer ended - no need to set state, it's derived
    }, []);

    const handleReset = useCallback(() => {
        // Navigate to home to start a new session
        window.location.href = "/";
    }, []);

    const handleChangeDuration = useCallback(
        (newDuration: number | null) => {
            setDuration(newDuration);
            setShowTimerAdjust(false);
            if (document) {
                void updateTimer({
                    id: document._id,
                    timerDuration: newDuration,
                });
            }
        },
        [document, updateTimer]
    );

    // Set editor editability based on locked state
    useEffect(() => {
        if (editor) {
            editor.setEditable(!isLocked);
        }
    }, [editor, isLocked]);

    // Handle loading state
    if (sync.isLoading) {
        return (
            <main className="bg-background flex min-h-dvh flex-col items-center justify-center">
                <div className="my-16 flex items-center justify-center">
                    <EllipsisIcon className="text-muted-foreground mx-auto size-8" />
                </div>
            </main>
        );
    }

    // If document doesn't exist yet, show create button
    if (sync.initialContent === null) {
        return (
            <main className="bg-background flex min-h-dvh flex-col items-center justify-center">
                <Button
                    onClick={() => sync.create({ type: "doc", content: [] })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
                >
                    Initialize Document
                </Button>
            </main>
        );
    }

    return (
        <main className="bg-background flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col">
                <header className="bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-sm">
                    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-4">
                            <Link
                                href={readOnly ? "/" : "/writings"}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title={
                                    readOnly
                                        ? "Go to home"
                                        : "Back to all writings"
                                }
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Link>
                            <TimerDisplay
                                duration={duration}
                                startedAt={document?.timerStartedAt ?? null}
                                isRunning={!timerEnded}
                                onTimerEnd={handleTimerEnd}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-muted-foreground text-sm tabular-nums">
                                {wordCount} {wordCount === 1 ? "word" : "words"}
                            </span>
                            {readOnly && !isAuthenticated && (
                                <Link
                                    href={`/sign-in?redirect_url=${encodeURIComponent(
                                        window.location.href
                                    )}`}
                                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors hover:underline"
                                >
                                    Sign In
                                </Link>
                            )}
                            {isWriting && (
                                <Button
                                    onClick={() =>
                                        setShowTimerAdjust(!showTimerAdjust)
                                    }
                                    className={
                                        "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors" +
                                        (showTimerAdjust ? " underline" : "")
                                    }
                                >
                                    {duration === null
                                        ? "End Session"
                                        : "Adjust Time"}
                                </Button>
                            )}
                            {!readOnly && isLocked && (
                                <Button
                                    onClick={handleReset}
                                    className="text-accent hover:text-accent text-sm font-medium transition-colors"
                                >
                                    New Session
                                </Button>
                            )}
                        </div>
                    </div>
                </header>
                {showTimerAdjust && isWriting && (
                    <div className="bg-muted/50 border-border border-b backdrop-blur-sm">
                        <TimerAdjust
                            currentDuration={duration}
                            onChangeDuration={handleChangeDuration}
                            onCancel={() => setShowTimerAdjust(false)}
                        />
                    </div>
                )}
                <div className="flex flex-1 flex-col">
                    <WritingEditor
                        isLocked={isLocked}
                        initialContent={sync.initialContent}
                        syncExtension={sync.extension}
                        onEditorReady={setEditor}
                    />
                </div>
                {(readOnly || (timerEnded && duration !== null)) && (
                    <div className="bg-muted/50 border-border sticky bottom-0 border-t backdrop-blur-sm">
                        <div className="mx-auto max-w-3xl px-4 py-4 text-center">
                            <p className="text-muted-foreground font-serif italic">
                                {readOnly
                                    ? "You're viewing this writing in read-only mode."
                                    : "Time's up. Your thoughts have been captured."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
