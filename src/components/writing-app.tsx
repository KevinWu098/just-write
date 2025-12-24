"use client";

import { useCallback, useEffect, useState } from "react";

import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { TimerAdjust } from "@/components/timer-adjust";
import { TimerDisplay } from "@/components/timer-display";
import { editorExtensions, WritingEditor } from "@/components/writing-editor";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type WritingState = "idle" | "writing" | "locked";

type Writing = {
    _id: Id<"writings">;
    timerDuration: number | null;
    createdBy: string;
    updatedAt: number;
    _creationTime: number;
};

interface WritingAppProps {
    document?: Writing;
    id: string;
}

export function WritingApp({ document, id }: WritingAppProps) {
    const updateTimer = useMutation(api.writing.updateTimer);
    const sync = useTiptapSync(api.writing, id);
    const [state, setState] = useState<WritingState>("idle");
    const [duration, setDuration] = useState<number | null>(
        document?.timerDuration ?? 5
    );
    const [wordCount, setWordCount] = useState(0);
    const [showTimerAdjust, setShowTimerAdjust] = useState(false);
    const [editor, setEditor] = useState<any>(null);

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
                if (count > 0 && state === "idle") {
                    setState("writing");
                }
            };

            // Initial word count
            updateWordCount();

            // Listen for updates
            editor.on("update", updateWordCount);
            return () => {
                editor.off("update", updateWordCount);
            };
        }
    }, [editor, state]);

    const handleTimerEnd = useCallback(() => {
        setState("locked");
    }, []);

    const handleReset = useCallback(() => {
        setState("idle");
        setWordCount(0);
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

    const isLocked = state === "locked" && duration !== null;

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
                <p>Loading...</p>
            </main>
        );
    }

    // If document doesn't exist yet, show create button
    if (sync.initialContent === null) {
        return (
            <main className="bg-background flex min-h-dvh flex-col items-center justify-center">
                <button
                    onClick={() => sync.create({ type: "doc", content: [] })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2"
                >
                    Initialize Document
                </button>
            </main>
        );
    }

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
                        initialContent={sync.initialContent}
                        syncExtension={sync.extension}
                        onEditorReady={setEditor}
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
