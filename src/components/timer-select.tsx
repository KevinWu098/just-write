"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DURATIONS = [5, 10, 15, 20, 30, null] as const;
const PENDING_WRITING_KEY = "pendingWritingTimer";

export function TimerSelect() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();
    const [selectedDuration, setSelectedDuration] =
        useState<(typeof DURATIONS)[number]>(10);
    const createWriting = useMutation(api.writing.create);
    const [isPending, startTransition] = useTransition();

    // Check for pending writing on mount after auth loads
    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const pendingTimer = sessionStorage.getItem(PENDING_WRITING_KEY);
        if (!pendingTimer) return;

        // Clear immediately to prevent re-triggering
        sessionStorage.removeItem(PENDING_WRITING_KEY);

        // Create writing in a transition for better UX
        startTransition(async () => {
            try {
                const duration =
                    pendingTimer === "null"
                        ? null
                        : Number.parseInt(pendingTimer);
                const writingId = await createWriting({
                    timerDuration: Number.isNaN(duration) ? null : duration,
                });
                router.push(`/writings/${writingId}`);
            } catch (error) {
                console.error("Error creating writing:", error);
                toast.error("Failed to create writing");
            }
        });
    }, [isLoaded, isSignedIn, createWriting, router]);

    async function handleStart() {
        if (!isSignedIn) {
            // Store timer duration in sessionStorage and redirect to sign-in
            const timerParam =
                selectedDuration === null ? "null" : String(selectedDuration);
            sessionStorage.setItem(PENDING_WRITING_KEY, timerParam);
            router.push("/sign-in");
            return;
        }

        startTransition(async () => {
            try {
                const writingId = await createWriting({
                    timerDuration: selectedDuration,
                });
                router.push(`/writings/${writingId}`);
            } catch (error) {
                console.error(error);
                toast.error("Failed to create writing");
            }
        });
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

            <div className="space-y-3">
                <Button
                    onClick={handleStart}
                    disabled={isPending || !isLoaded}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 text-lg font-medium transition-colors disabled:opacity-50"
                >
                    {isPending ? "Creating..." : "Begin"}
                </Button>

                <Link href="/writings">
                    <Button className="text-muted-foreground w-full text-sm font-medium hover:underline">
                        View previous writings
                    </Button>
                </Link>
            </div>
        </div>
    );
}
