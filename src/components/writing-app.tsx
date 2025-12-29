"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import type { Editor } from "@tiptap/react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArrowLeftIcon, EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TimerAdjust } from "@/components/timer-adjust";
import { TimerDisplay } from "@/components/timer-display";
import { WritingEditor } from "@/components/writing-editor/writing-editor";

type Writing = {
    _id: Id<"writings">;
    timerDuration: number | null;
    timerStartedAt: number | null;
    createdBy: string;
    updatedAt: number;
    _creationTime: number;
    sessionEnded?: boolean;
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
    const router = useRouter();
    const startTimer = useMutation(api.writing.startTimer);
    const updateTimer = useMutation(api.writing.updateTimer);

    const sync = useTiptapSync(api.writing, id);

    const [duration, setDuration] = useState<number | null>(() => {
        if (document?.timerDuration !== undefined) {
            return document.timerDuration;
        }
        return 10;
    });
    const [wordCount, setWordCount] = useState(0);
    const [showTimerAdjust, setShowTimerAdjust] = useState(false);
    const [editor, setEditor] = useState<Editor | null>(null);
    const [timerEnded, setTimerEnded] = useState(() => {
        if (
            document &&
            document.timerStartedAt &&
            document.timerDuration !== null
        ) {
            const elapsed = (Date.now() - document.timerStartedAt) / 1000;
            return elapsed >= document.timerDuration * 60;
        }
        return document?.sessionEnded ?? false;
    });

    const isWriting = !timerEnded && !readOnly;
    const isLocked = readOnly || timerEnded;

    useEffect(() => {
        if (document && !document.timerStartedAt && !readOnly) {
            void startTimer({ id: document._id });
        }
    }, [document, startTimer, readOnly]);

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
        setTimerEnded(true);
    }, []);

    const handleEndSession = useCallback(() => {
        if (document && duration === null) {
            void updateTimer({
                id: document._id,
                timerDuration: null,
                endSession: true,
            });
        }
    }, [document, duration, updateTimer]);

    const handleChangeDuration = useCallback(
        (newDuration: number | null, resetTimer = false) => {
            setDuration(newDuration);
            setShowTimerAdjust(false);
            if (document) {
                void updateTimer({
                    id: document._id,
                    timerDuration: newDuration,
                    resetTimer,
                });
            }
        },
        [document, updateTimer]
    );

    if (sync.isLoading || !sync.extension) {
        return (
            <main className="bg-background flex min-h-dvh flex-col items-center justify-center">
                <div className="my-16 flex items-center justify-center">
                    <EllipsisIcon className="text-muted-foreground mx-auto size-8" />
                </div>
            </main>
        );
    }

    return (
        <>
            <div className="flex h-dvh min-h-dvh flex-col">
                <header className="bg-background/80 border-border box-border h-12 border-b backdrop-blur-sm">
                    <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-2">
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
                                        duration === null
                                            ? handleEndSession()
                                            : setShowTimerAdjust(
                                                  !showTimerAdjust
                                              )
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
                                    onClick={() => router.push("/")}
                                    className="text-accent hover:text-accent text-sm font-medium transition-colors"
                                >
                                    New Session
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="relative h-0 grow">
                    <WritingEditor
                        isLocked={isLocked}
                        initialContent={sync.initialContent}
                        syncExtension={sync.extension}
                        onEditorReady={setEditor}
                        hasFooter={readOnly || timerEnded}
                    />
                </div>

                {(readOnly || timerEnded) && (
                    <div className="bg-muted/50 border-border sticky bottom-0 border-t backdrop-blur-sm">
                        <div className="mx-auto max-w-3xl px-4 py-4 text-center">
                            <p className="text-muted-foreground font-serif italic">
                                {readOnly
                                    ? "You're viewing this writing in read-only mode."
                                    : duration === null
                                      ? "Session ended. Your thoughts have been captured."
                                      : "Time's up. Your thoughts have been captured."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isWriting && (
                <TimerAdjust
                    open={showTimerAdjust}
                    currentDuration={duration}
                    onChangeDuration={handleChangeDuration}
                    onCancel={() => setShowTimerAdjust(false)}
                />
            )}
        </>
    );
}
