"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface TimerSelectProps {
    selectedDuration: number | null;
    onSelectDuration: (duration: number | null) => void;
    onStart: () => void;
}

const DURATIONS: (number | null)[] = [5, 10, 15, 20, 30, null];

export function TimerSelect({
    selectedDuration,
    onSelectDuration,
    onStart,
}: TimerSelectProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDurationSelect = (duration: number | null) => {
        if (duration === null && selectedDuration !== null) {
            setShowConfirmation(true);
        } else {
            onSelectDuration(duration);
            setShowConfirmation(false);
        }
    };

    const confirmUnlimited = () => {
        onSelectDuration(null);
        setShowConfirmation(false);
    };

    const cancelUnlimited = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-muted-foreground block text-center text-sm font-medium">
                    Choose your session length
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                    {DURATIONS.map((duration) => (
                        <button
                            key={duration ?? "unlimited"}
                            onClick={() => handleDurationSelect(duration)}
                            className={cn(
                                "h-14 w-14 rounded-lg text-lg font-medium transition-all duration-200",
                                "border-border hover:border-accent/50 border",
                                selectedDuration === duration
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-foreground hover:bg-secondary"
                            )}
                        >
                            {duration ?? "∞"}
                        </button>
                    ))}
                </div>
                <p className="text-muted-foreground text-center text-sm">
                    {selectedDuration === null ? "unlimited" : "minutes"}
                </p>
            </div>

            {showConfirmation && (
                <div className="bg-secondary/50 border-border space-y-3 rounded-lg border p-4">
                    <p className="text-foreground text-center text-sm">
                        Unlimited mode won't lock your writing. Are you sure?
                    </p>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={cancelUnlimited}
                            className="bg-card border-border hover:bg-secondary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmUnlimited}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                        >
                            Yes, unlimited
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={onStart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-4 text-lg font-medium transition-colors"
            >
                Begin Writing
            </button>
        </div>
    );
}
