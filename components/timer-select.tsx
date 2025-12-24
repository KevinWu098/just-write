"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

interface TimerSelectProps {
  selectedDuration: number | null
  onSelectDuration: (duration: number | null) => void
  onStart: () => void
}

const DURATIONS: (number | null)[] = [5, 10, 15, 20, 30, null]

export function TimerSelect({ selectedDuration, onSelectDuration, onStart }: TimerSelectProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDurationSelect = (duration: number | null) => {
    if (duration === null && selectedDuration !== null) {
      setShowConfirmation(true)
    } else {
      onSelectDuration(duration)
      setShowConfirmation(false)
    }
  }

  const confirmUnlimited = () => {
    onSelectDuration(null)
    setShowConfirmation(false)
  }

  const cancelUnlimited = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground text-center block">
          Choose your session length
        </label>
        <div className="flex justify-center gap-2 flex-wrap">
          {DURATIONS.map((duration) => (
            <button
              key={duration ?? "unlimited"}
              onClick={() => handleDurationSelect(duration)}
              className={cn(
                "w-14 h-14 rounded-lg text-lg font-medium transition-all duration-200",
                "border border-border hover:border-accent/50",
                selectedDuration === duration
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground hover:bg-secondary",
              )}
            >
              {duration ?? "∞"}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {selectedDuration === null ? "unlimited" : "minutes"}
        </p>
      </div>

      {showConfirmation && (
        <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm text-foreground text-center">Unlimited mode won't lock your writing. Are you sure?</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={cancelUnlimited}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-card border border-border hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmUnlimited}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Yes, unlimited
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
      >
        Begin Writing
      </button>
    </div>
  )
}
