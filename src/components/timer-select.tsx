"use client";

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
                            onClick={() => onSelectDuration(duration)}
                            className={cn(
                                "h-14 w-14 rounded-lg text-lg font-medium transition-all duration-200 hover:duration-0",
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
            </div>

            <p
                className={cn(
                    "text-muted-foreground text-center text-sm",
                    selectedDuration === null
                        ? "opacity-100"
                        : "pointer-events-auto opacity-0"
                )}
            >
                Unlimited mode won't lock your writing.
            </p>

            <button
                onClick={onStart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 text-lg font-medium transition-colors"
            >
                Begin
            </button>
        </div>
    );
}
