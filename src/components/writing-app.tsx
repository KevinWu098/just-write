"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";

import { TimerAdjust } from "./timer-adjust";
import { TimerDisplay } from "./timer-display";
import { TimerSelect } from "./timer-select";
import { WritingEditor } from "./writing-editor";

export type WritingState = "idle" | "writing" | "locked";

export function WritingApp() {
    const [state, setState] = useState<WritingState>("idle");
    const [duration, setDuration] = useState<number | null>(5);
    const [wordCount, setWordCount] = useState(0);
    const [showTimerAdjust, setShowTimerAdjust] = useState(false);

    const handleStart = useCallback(() => {
        setState("writing");
    }, []);

    const handleTimerEnd = useCallback(() => {
        setState("locked");
    }, []);

    const handleReset = useCallback(() => {
        setState("idle");
        setWordCount(0);
    }, []);

    const handleContentChange = useCallback(
        (_content: string, newWordCount: number) => {
            setWordCount(newWordCount);
        },
        []
    );

    const handleChangeDuration = useCallback((newDuration: number | null) => {
        setDuration(newDuration);
        setShowTimerAdjust(false);
    }, []);

    const isLocked = state === "locked" && duration !== null;

    if (state === "idle") {
        return (
            <main className="bg-background flex min-h-dvh flex-col items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-foreground font-serif text-5xl font-medium">
                            Just Write
                        </h1>
                    </div>
                    <TimerSelect
                        selectedDuration={duration}
                        onSelectDuration={setDuration}
                        onStart={handleStart}
                    />
                </div>
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
                        onContentChange={handleContentChange}
                    />
                </div>
                {isLocked && (
                    <div className="bg-muted/50 border-border sticky bottom-0 border-t backdrop-blur-sm">
                        <div className="mx-auto max-w-3xl px-4 py-4 text-center">
                            <p className="text-muted-foreground font-serif italic">
                                Time's up. Your thoughts have been captured.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
