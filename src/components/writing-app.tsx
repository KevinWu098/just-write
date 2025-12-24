"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { TimerAdjust } from "./timer-adjust";
import { TimerDisplay } from "./timer-display";
import { WritingEditor } from "./writing-editor";

export type WritingState = "idle" | "writing" | "locked";

// TODO: Replace with Convex types
type Document = {
    id: string;
    body: unknown;
    timerDuration: number | null;
};

interface WritingAppProps {
    document?: Document;
}

export function WritingApp({ document }: WritingAppProps) {
    const [state, setState] = useState<WritingState>("idle");
    const [duration, setDuration] = useState<number | null>(
        document?.timerDuration ?? 5
    );
    const [wordCount, setWordCount] = useState(0);
    const [showTimerAdjust, setShowTimerAdjust] = useState(false);
    const [editorContent, setEditorContent] = useState<unknown>(
        document?.body ?? { type: "doc", content: [] }
    );

    // Refs to track the latest values for debounced save
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSaveRef = useRef<{
        content: unknown;
        duration: number | null;
    } | null>(null);
    const documentRef = useRef(document);

    // Keep document ref in sync
    useEffect(() => {
        documentRef.current = document;
    }, [document]);

    // Function to immediately flush any pending saves
    const flushPendingSave = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        if (pendingSaveRef.current && documentRef.current) {
            // TODO: Implement Convex mutation
            // const { content, duration } = pendingSaveRef.current;
            pendingSaveRef.current = null;
        }
    }, []);

    // Set up event listeners to save before tab closes or becomes hidden
    useEffect(() => {
        const handleBeforeUnload = () => {
            flushPendingSave();
        };

        const handleVisibilityChange = () => {
            if (window.document.hidden) {
                flushPendingSave();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // Cleanup: flush any pending saves when component unmounts
        return () => {
            flushPendingSave();
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [flushPendingSave]);

    const handleTimerEnd = useCallback(() => {
        setState("locked");
    }, []);

    const handleReset = useCallback(() => {
        setState("idle");
        setWordCount(0);
    }, []);

    const handleContentChange = useCallback(
        (content: unknown, newWordCount: number) => {
            setState("writing");
            setWordCount(newWordCount);
            setEditorContent(content);
            // Debounce save to database if we have a document
            if (document) {
                // Clear existing timer
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }
                // Store pending save data
                pendingSaveRef.current = { content, duration };
                // Set new timer (debounce for 1 second)
                debounceTimerRef.current = setTimeout(() => {
                    // TODO: Implement Convex mutation
                    pendingSaveRef.current = null;
                    debounceTimerRef.current = null;
                }, 1000);
            }
        },
        [document, duration]
    );

    const handleChangeDuration = useCallback(
        (newDuration: number | null) => {
            setDuration(newDuration);
            setShowTimerAdjust(false);
            // Flush any pending saves and save duration immediately
            flushPendingSave();
            if (document) {
                // TODO: Implement Convex mutation
            }
        },
        [document, editorContent, flushPendingSave]
    );

    const isLocked = state === "locked" && duration !== null;

    return (
        <main className="bg-background flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col">
                <header className="bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-sm">
                    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
                        <TimerDisplay
                            duration={duration}
                            isRunning={state === "writing"}
                            onTimerEnd={handleTimerEnd}
                        />
                        <div className="flex items-center gap-4">
                            <span className="text-muted-foreground text-sm tabular-nums">
                                {wordCount} {wordCount === 1 ? "word" : "words"}
                            </span>
                            {state === "writing" && (
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
                            {isLocked && (
                                <Button
                                    onClick={handleReset}
                                    className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                                >
                                    New Session
                                </Button>
                            )}
                        </div>
                    </div>
                </header>
                {showTimerAdjust && state === "writing" && (
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
                        initialContent={document?.body}
                        onContentChange={handleContentChange}
                    />
                </div>
                {isLocked && (
                    <div className="bg-muted/50 border-border sticky bottom-0 border-t backdrop-blur-sm">
                        <div className="mx-auto max-w-3xl px-4 py-4 text-center">
                            <p className="text-muted-foreground font-serif italic">
                                {"Time's up. Your thoughts have been captured."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
