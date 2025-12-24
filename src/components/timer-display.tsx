"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface TimerDisplayProps {
    duration: number | null;
    isRunning: boolean;
    onTimerEnd: () => void;
    onTimeUpdate?: (timeInSeconds: number) => void;
}

export function TimerDisplay({
    duration,
    isRunning,
    onTimerEnd,
    onTimeUpdate,
}: TimerDisplayProps) {
    const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isResuming, setIsResuming] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (duration !== null) {
            setTimeLeft(duration * 60);
            setHasEnded(false);
        } else {
            setElapsedTime(0);
            setHasEnded(false);
        }
    }, [duration]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPaused(true);
            } else {
                setIsPaused(false);
                setIsResuming(true);
                setTimeout(() => {
                    setIsResuming(false);
                }, 1000);
            }
        };

        const handleBlur = () => {
            setIsPaused(true);
        };

        const handleFocus = () => {
            setIsPaused(false);
            setIsResuming(true);
            setTimeout(() => {
                setIsResuming(false);
            }, 1000);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    useEffect(() => {
        if (!isRunning || hasEnded || isPaused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            if (duration === null) {
                setElapsedTime((prev) => prev + 1);
            } else {
                // Timed mode: count down
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        setHasEnded(true);
                        onTimerEnd();
                        return 0;
                    }
                    const newTime = prev - 1;
                    // Update parent with remaining time in seconds
                    onTimeUpdate?.(newTime);
                    return newTime;
                });
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, hasEnded, isPaused, onTimerEnd, duration, onTimeUpdate]);

    if (duration === null) {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        return (
            <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center">
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
            <div
                className={cn(
                    "relative h-10 w-10",
                    isResuming && "animate-pulse"
                )}
            >
                <svg
                    className={cn(
                        "h-10 w-10 -rotate-90 transition-all ease-in-out",
                        isResuming ? "duration-1000" : "duration-1000"
                    )}
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
                            "transition-all ease-in-out",
                            isResuming ? "duration-1000" : "duration-1000",
                            isLow ? "stroke-destructive" : "stroke-accent"
                        )}
                        strokeWidth="2"
                        strokeDasharray={`${progress} 100`}
                        strokeLinecap="round"
                    />
                </svg>
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity ease-in-out",
                        isPaused
                            ? "opacity-100 duration-0"
                            : "opacity-0 duration-1000"
                    )}
                >
                    <div className="bg-accent mr-0.5 h-3 w-1 rounded-sm" />
                    <div className="bg-accent h-3 w-1 rounded-sm" />
                </div>
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
