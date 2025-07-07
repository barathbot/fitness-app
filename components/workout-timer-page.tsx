"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react"

interface WorkoutTimerPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function WorkoutTimerPage({ userData, onNext, onBack, onUpdate }: WorkoutTimerPageProps) {
  const exercise = userData.currentExercise
  const [currentSet, setCurrentSet] = useState(1)
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(60) // 60 seconds rest
  const [isCompleted, setIsCompleted] = useState(false)

  const totalSets = exercise?.sets || 3
  const exerciseDuration = 45 // 45 seconds per set

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (isResting) {
          setRestTime((prevRestTime) => {
            if (prevRestTime <= 1) {
              setIsResting(false)
              setTime(0)
              return 60
            }
            return prevRestTime - 1
          })
        } else {
          setTime((prevTime) => {
            if (prevTime >= exerciseDuration - 1) {
              if (currentSet < totalSets) {
                setIsResting(true)
                setCurrentSet((prevSet) => prevSet + 1)
                return 0
              } else {
                setIsCompleted(true)
                setIsActive(false)
                return exerciseDuration
              }
            }
            return prevTime + 1
          })
        }
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, isResting, currentSet, totalSets, exerciseDuration])

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  const resetTimer = useCallback(() => {
    setTime(0)
    setRestTime(60)
    setCurrentSet(1)
    setIsActive(false)
    setIsResting(false)
    setIsCompleted(false)
  }, [])

  const handleCompleteExercise = () => {
    onNext() // Return to daily workout page
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    if (isResting) {
      return ((60 - restTime) / 60) * 100
    }
    return (time / exerciseDuration) * 100
  }

  const getCurrentPhase = () => {
    if (isCompleted) return "Completed!"
    if (isResting) return `Rest - Set ${currentSet - 1} Complete`
    return `Set ${currentSet} of ${totalSets}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">{exercise?.name || "Exercise"}</CardTitle>
            <CardDescription className="text-purple-200">{getCurrentPhase()}</CardDescription>
          </CardHeader>
        </Card>

        {/* Timer Display */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                {isResting ? formatTime(restTime) : formatTime(time)}
              </div>
              <div className="text-purple-200">
                {isResting ? "Rest Time" : `${formatTime(Math.max(0, exerciseDuration - time))} remaining`}
              </div>
            </div>

            <div className="mb-6">
              <Progress value={getProgress()} className="h-3 mb-2" />
              <div className="text-sm text-purple-200">{isResting ? "Rest Progress" : "Set Progress"}</div>
            </div>

            {/* Set Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: totalSets }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i + 1 < currentSet
                      ? "bg-green-600 text-white"
                      : i + 1 === currentSet
                        ? "bg-purple-600 text-white"
                        : "bg-slate-600 text-slate-300"
                  }`}
                >
                  {i + 1 < currentSet ? "✓" : i + 1}
                </div>
              ))}
            </div>

            {/* Control Buttons */}
            {!isCompleted ? (
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={toggleTimer}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8"
                >
                  {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent px-8"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Exercise Complete!</h3>
                <p className="text-purple-200 mb-6">Great job! You've completed all sets.</p>
                <Button
                  onClick={handleCompleteExercise}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Exercise
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Info */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-purple-200 text-sm">Target Reps</div>
                <div className="text-white font-semibold">{exercise?.reps || "12-15"}</div>
              </div>
              <div>
                <div className="text-purple-200 text-sm">Rest Between Sets</div>
                <div className="text-white font-semibold">{exercise?.restTime || "60s"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exercise Details
        </Button>
      </div>
    </div>
  )
}
