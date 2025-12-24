"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { api } from "../../convex/_generated/api";

const DURATIONS = [5, 10, 15, 20, 30, null] as const;

export function TimerSelect() {
    const router = useRouter();
    const [selectedDuration, setSelectedDuration] =
        useState<(typeof DURATIONS)[number]>(5);
    const createWriting = useMutation(api.writing.create);

    async function handleStart() {
        try {
            const writingId = await createWriting({
                timerDuration: selectedDuration,
            });
            router.push(`/${writingId}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create writing");
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-muted-foreground block text-center text-sm font-medium">
                    Choose your session length
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                    {DURATIONS.map((duration) => (
                        <Button
                            key={duration ?? "unlimited"}
                            onClick={() => setSelectedDuration(duration)}
                            className={cn(
                                "h-14 w-14 rounded-lg text-lg font-medium transition-all duration-200 hover:duration-0",
                                "border-border hover:border-accent/50 border",
                                selectedDuration === duration
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-foreground hover:bg-secondary"
                            )}
                        >
                            {duration ?? "∞"}
                        </Button>
                    ))}
                </div>

                <p
                    className={cn(
                        "text-muted-foreground text-center text-sm",
                        selectedDuration === null
                            ? "opacity-100"
                            : "pointer-events-auto opacity-0"
                    )}
                >
                    {"Unlimited mode won't lock your writing."}
                </p>
            </div>

            <Button
                onClick={handleStart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 text-lg font-medium transition-colors"
            >
                Begin
            </Button>
        </div>
    );
}
