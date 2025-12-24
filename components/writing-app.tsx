"use client"

import { useState, useCallback } from "react"
import { WritingEditor } from "./writing-editor"
import { TimerDisplay } from "./timer-display"
import { TimerAdjust } from "./timer-adjust"
import { TimerSelect } from "./timer-select"

export type WritingState = "idle" | "writing" | "locked"

export function WritingApp() {
  const [state, setState] = useState<WritingState>("idle")
  const [duration, setDuration] = useState<number | null>(5)
  const [wordCount, setWordCount] = useState(0)
  const [showTimerAdjust, setShowTimerAdjust] = useState(false)

  const handleStart = useCallback(() => {
    setState("writing")
  }, [])

  const handleTimerEnd = useCallback(() => {
    setState("locked")
  }, [])

  const handleReset = useCallback(() => {
    setState("idle")
    setWordCount(0)
  }, [])

  const handleContentChange = useCallback((_content: string, newWordCount: number) => {
    setWordCount(newWordCount)
  }, [])

  const handleChangeDuration = useCallback((newDuration: number | null) => {
    setDuration(newDuration)
    setShowTimerAdjust(false)
  }, [])

  const isLocked = state === "locked" && duration !== null

  if (state === "idle") {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-serif font-medium text-foreground">Just Write</h1>
          </div>
          <TimerSelect selectedDuration={duration} onSelectDuration={setDuration} onStart={handleStart} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col bg-background">
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto w-full">
            <TimerDisplay duration={duration} isRunning={state === "writing"} onTimerEnd={handleTimerEnd} />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground tabular-nums">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
              {state === "writing" && (
                <button
                  onClick={() => setShowTimerAdjust(!showTimerAdjust)}
                  className={
                    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" +
                    (showTimerAdjust ? " underline" : "")
                  }
                >
                  {duration === null ? "End Session" : "Adjust Time"}
                </button>
              )}
              {isLocked && (
                <button
                  onClick={handleReset}
                  className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  New Session
                </button>
              )}
            </div>
          </div>
        </header>
        {showTimerAdjust && state === "writing" && (
          <div className="bg-muted/50 backdrop-blur-sm border-b border-border">
            <TimerAdjust
              currentDuration={duration}
              onChangeDuration={handleChangeDuration}
              onCancel={() => setShowTimerAdjust(false)}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <WritingEditor isLocked={isLocked} onContentChange={handleContentChange} />
        </div>
        {isLocked && (
          <div className="sticky bottom-0 bg-muted/50 backdrop-blur-sm border-t border-border">
            <div className="px-4 py-4 max-w-3xl mx-auto text-center">
              <p className="text-muted-foreground font-serif italic">Time's up. Your thoughts have been captured.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
