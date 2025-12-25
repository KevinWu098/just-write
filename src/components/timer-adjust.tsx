"use client";

import { useState } from "react";

import { Check, Infinity, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TimerAdjustProps {
    open: boolean;
    currentDuration: number | null;
    onChangeDuration: (duration: number | null, resetTimer?: boolean) => void;
    onCancel: () => void;
}

const TIME_OPTIONS = [5, 10, 15, 20, 30];

export function TimerAdjust({
    open,
    currentDuration,
    onChangeDuration,
    onCancel,
}: TimerAdjustProps) {
    const [selectedDuration, setSelectedDuration] = useState<number | null>(
        currentDuration
    );
    const [showUnlimitedConfirm, setShowUnlimitedConfirm] = useState(false);

    const handleAddTime = (minutes: number) => {
        if (currentDuration === null) return;
        const newDuration = currentDuration + minutes;
        onChangeDuration(newDuration);
    };

    const handleSelectUnlimited = () => {
        setShowUnlimitedConfirm(true);
    };

    const confirmUnlimited = () => {
        onChangeDuration(null);
        setShowUnlimitedConfirm(false);
    };

    const handleSwitch = () => {
        if (selectedDuration === null) {
            setShowUnlimitedConfirm(true);
        } else {
            onChangeDuration(selectedDuration, true); // Reset timer when switching
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            onCancel();
        }
    };

    if (showUnlimitedConfirm) {
        return (
            <Dialog
                open={open}
                onOpenChange={handleOpenChange}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Confirm Unlimited</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-center">
                        <p className="text-muted-foreground">
                            Switch to unlimited writing? Your timer will stop.
                            This cannot be changed later.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                onClick={confirmUnlimited}
                                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg px-6 py-2 font-medium transition-colors"
                            >
                                Continue Unlimited
                            </Button>
                            <Button
                                onClick={() => setShowUnlimitedConfirm(false)}
                                className="text-muted-foreground hover:text-foreground px-6 py-2 transition-colors"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="max-w-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Adjust Time</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-2">
                    {currentDuration !== null && (
                        <div className="space-y-3">
                            <p className="text-muted-foreground text-center text-sm">
                                Add more time
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {TIME_OPTIONS.map((minutes) => (
                                    <Button
                                        key={minutes}
                                        onClick={() => handleAddTime(minutes)}
                                        className="bg-background border-border hover:border-accent hover:bg-accent/5 flex items-center gap-2 rounded-lg border px-2 py-2 transition-all"
                                    >
                                        <Plus className="text-accent h-4 w-4" />
                                        <span className="font-mono text-sm">
                                            {minutes} min
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="border-border w-full border-t"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background text-muted-foreground px-2">
                                Or switch to
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {TIME_OPTIONS.map((minutes) => (
                                <Button
                                    key={minutes}
                                    onClick={() => setSelectedDuration(minutes)}
                                    className={cn(
                                        "rounded-lg border px-5 py-2.5 font-mono text-sm transition-all",
                                        selectedDuration === minutes
                                            ? "bg-accent text-accent-foreground border-accent"
                                            : "bg-background border-border hover:border-accent hover:bg-accent/5"
                                    )}
                                >
                                    {minutes} min
                                </Button>
                            ))}
                            <Button
                                onClick={() => setSelectedDuration(null)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-all",
                                    selectedDuration === null
                                        ? "bg-accent text-accent-foreground border-accent"
                                        : "bg-background border-border hover:border-accent hover:bg-accent/5"
                                )}
                            >
                                <Infinity className="h-4 w-4" />
                                <span className="font-mono">Unlimited</span>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <Button
                                onClick={handleSwitch}
                                className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition-colors"
                            >
                                <Check className="h-4 w-4" />
                                Switch
                            </Button>
                            <Button
                                onClick={onCancel}
                                className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-6 py-2 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
