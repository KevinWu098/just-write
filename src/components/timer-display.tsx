"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface TimerDisplayProps {
    duration: number | null;
    startedAt: number | null;
    isRunning: boolean;
    onTimerEnd: () => void;
    onTimeUpdate?: (timeInSeconds: number) => void;
}

export function TimerDisplay({
    duration,
    startedAt,
    isRunning,
    onTimerEnd,
    onTimeUpdate,
}: TimerDisplayProps) {
    const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const localStartTimeRef = useRef<number | null>(null);

    // Calculate current time based on startedAt (or local start time)
    const calculateCurrentTime = useCallback(() => {
        // Use server time if available, otherwise use local start time
        const effectiveStartTime = startedAt || localStartTimeRef.current;

        if (!effectiveStartTime) {
            // Timer hasn't started yet
            if (duration !== null) {
                return { timeLeft: duration * 60, elapsedTime: 0 };
            }
            return { timeLeft: 0, elapsedTime: 0 };
        }

        const elapsed = Math.floor((Date.now() - effectiveStartTime) / 1000);

        if (duration === null) {
            // Infinite timer - count up
            return { timeLeft: 0, elapsedTime: elapsed };
        } else {
            // Timed mode - count down
            const totalSeconds = duration * 60;
            const remaining = Math.max(0, totalSeconds - elapsed);
            return { timeLeft: remaining, elapsedTime: elapsed };
        }
    }, [startedAt, duration]);

    // Initialize and update time based on startedAt
    useEffect(() => {
        const { timeLeft: newTimeLeft, elapsedTime: newElapsedTime } =
            calculateCurrentTime();
        setTimeLeft(newTimeLeft);
        setElapsedTime(newElapsedTime);
        const shouldEnd =
            newTimeLeft === 0 && duration !== null && startedAt !== null;
        setHasEnded(shouldEnd);

        // If timer has already ended when component loads, call onTimerEnd
        if (shouldEnd && !hasEnded) {
            onTimerEnd();
        }
    }, [startedAt, duration, calculateCurrentTime, hasEnded, onTimerEnd]);

    useEffect(() => {
        if (!isRunning || hasEnded) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            localStartTimeRef.current = null; // Reset local start time
            return;
        }

        // Set local start time if not set and server time not available
        if (!startedAt && !localStartTimeRef.current) {
            localStartTimeRef.current = Date.now();
        }

        // Clear local start time if server time is available
        if (startedAt && localStartTimeRef.current) {
            localStartTimeRef.current = null;
        }

        // Update every second based on elapsed time from startedAt
        intervalRef.current = setInterval(() => {
            const { timeLeft: newTimeLeft, elapsedTime: newElapsedTime } =
                calculateCurrentTime();

            if (duration === null) {
                setElapsedTime(newElapsedTime);
            } else {
                setTimeLeft(newTimeLeft);

                if (newTimeLeft <= 0 && !hasEnded) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    setHasEnded(true);
                    onTimerEnd();
                }

                // Update parent with remaining time in seconds
                onTimeUpdate?.(newTimeLeft);
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [
        isRunning,
        hasEnded,
        startedAt,
        duration,
        onTimerEnd,
        onTimeUpdate,
        calculateCurrentTime,
    ]);

    if (hasEnded) {
        // Calculate total time elapsed (the full duration that was completed)
        const totalSeconds = duration ? duration * 60 : 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return (
            <div className="flex items-center gap-3">
                <div className="relative flex h-7 w-7 items-center justify-center">
                    <span className="text-accent text-2xl">✓</span>
                </div>
                <span className="text-muted-foreground font-mono text-xl tabular-nums">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                </span>
            </div>
        );
    }

    if (duration === null) {
        const safeElapsedTime = Math.max(0, elapsedTime);
        const minutes = Math.floor(safeElapsedTime / 60);
        const seconds = safeElapsedTime % 60;
        return (
            <div className="flex items-center gap-3">
                <div className="relative flex h-7 w-7 items-center justify-center">
                    <span className="text-accent text-2xl">∞</span>
                </div>
                <span className="text-muted-foreground font-mono text-xl tabular-nums">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                </span>
            </div>
        );
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
    const isLow = timeLeft <= 60 && timeLeft > 0;

    return (
        <div className="flex items-center gap-3">
            <div className={cn("relative h-7 w-7")}>
                <svg
                    className="h-7 w-7 -rotate-90 transition-all duration-1000 ease-in-out"
                    viewBox="0 0 36 36"
                >
                    <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-muted"
                        strokeWidth="2"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className={cn(
                            "transition-all duration-1000 ease-in-out",
                            isLow ? "stroke-destructive" : "stroke-accent"
                        )}
                        strokeWidth="2"
                        strokeDasharray={`${progress} 100`}
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <span
                className={cn(
                    "font-mono text-xl tabular-nums transition-colors",
                    isLow ? "text-destructive" : "text-foreground"
                )}
            >
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
            </span>
        </div>
    );
}
