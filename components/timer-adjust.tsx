"use client"

import { useState } from "react"
import { Plus, Infinity, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerAdjustProps {
  currentDuration: number | null
  onChangeDuration: (duration: number | null) => void
  onCancel: () => void
}

const TIME_OPTIONS = [5, 10, 15, 20, 30]

export function TimerAdjust({ currentDuration, onChangeDuration, onCancel }: TimerAdjustProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(currentDuration)
  const [showUnlimitedConfirm, setShowUnlimitedConfirm] = useState(false)

  const handleAddTime = (minutes: number) => {
    if (currentDuration === null) return
    const newDuration = currentDuration + minutes
    onChangeDuration(newDuration)
  }

  const handleSelectUnlimited = () => {
    setShowUnlimitedConfirm(true)
  }

  const confirmUnlimited = () => {
    onChangeDuration(null)
    setShowUnlimitedConfirm(false)
  }

  const handleSwitch = () => {
    if (selectedDuration === null) {
      setShowUnlimitedConfirm(true)
    } else {
      onChangeDuration(selectedDuration)
    }
  }

  if (showUnlimitedConfirm) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Switch to unlimited writing? Your timer will stop.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={confirmUnlimited}
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              Continue Unlimited
            </button>
            <button
              onClick={() => setShowUnlimitedConfirm(false)}
              className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto w-full space-y-6">
      {currentDuration !== null && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Add more time</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {TIME_OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleAddTime(minutes)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all"
              >
                <Plus className="w-4 h-4 text-accent" />
                <span className="font-mono text-sm">{minutes} min</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-muted/50 px-2 text-muted-foreground">Or switch to</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {TIME_OPTIONS.map((minutes) => (
            <button
              key={minutes}
              onClick={() => setSelectedDuration(minutes)}
              className={cn(
                "px-5 py-2.5 rounded-lg font-mono text-sm transition-all border",
                selectedDuration === minutes
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background border-border hover:border-accent hover:bg-accent/5",
              )}
            >
              {minutes} min
            </button>
          ))}
          <button
            onClick={() => setSelectedDuration(null)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm transition-all border flex items-center gap-2",
              selectedDuration === null
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-background border-border hover:border-accent hover:bg-accent/5",
            )}
          >
            <Infinity className="w-4 h-4" />
            <span className="font-mono">Unlimited</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSwitch}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <Check className="w-4 h-4" />
            Switch
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
