"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserData } from "@/app/page"
import { ArrowLeft, Play, Clock, Target, Flame, BoneIcon as Muscle, Info, Timer } from "lucide-react"

interface ExerciseDetailPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function ExerciseDetailPage({ userData, onNext, onBack, onUpdate }: ExerciseDetailPageProps) {
  const exercise = userData.currentExercise || {
    name: "Push-ups",
    sets: 3,
    reps: "12-15",
    duration: "3 minutes",
    restTime: "60 seconds",
    difficulty: "Beginner",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    calories: 45,
    description: "Classic upper body exercise targeting chest and arms",
    benefits: "Builds chest strength, improves core stability",
    videoUrl: "/videos/pushups.mp4",
  }

  const [showInstructions, setShowInstructions] = useState(true)

  const instructions = [
    "Start in a plank position with hands slightly wider than shoulders",
    "Keep your body in a straight line from head to heels",
    "Lower your chest until it nearly touches the ground",
    "Push back up to the starting position",
    "Maintain controlled movement throughout",
    "Breathe in on the way down, out on the way up",
  ]

  const bodyEffects = [
    { area: "Chest", effect: "Increased muscle activation and strength", intensity: "High" },
    { area: "Shoulders", effect: "Improved stability and endurance", intensity: "Medium" },
    { area: "Triceps", effect: "Enhanced arm strength and definition", intensity: "High" },
    { area: "Core", effect: "Better stability and posture", intensity: "Medium" },
  ]

  const handleStartExercise = () => {
    onNext() // Go to workout timer page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">{exercise.name}</CardTitle>
            <CardDescription className="text-purple-200">{exercise.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-3">
              {exercise.targetMuscles.map((muscle: string) => (
                <Badge key={muscle} className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                  {muscle}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Video Section */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-orange-400" />
              Exercise Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-700/50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-white">Exercise demonstration video</p>
                <p className="text-purple-200 text-sm">Click to play tutorial</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="text-purple-200">
                <Clock className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs">Duration</div>
                <div className="text-white font-semibold">{exercise.duration}</div>
              </div>
              <div className="text-purple-200">
                <Target className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs">Sets × Reps</div>
                <div className="text-white font-semibold">
                  {exercise.sets} × {exercise.reps}
                </div>
              </div>
              <div className="text-purple-200">
                <Timer className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs">Rest</div>
                <div className="text-white font-semibold">{exercise.restTime}</div>
              </div>
              <div className="text-purple-200">
                <Flame className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs">Calories</div>
                <div className="text-white font-semibold">{exercise.calories}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions & Effects Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setShowInstructions(true)}
              className={
                showInstructions ? "bg-purple-600 text-white" : "bg-slate-700/50 text-purple-200 hover:bg-slate-600/50"
              }
            >
              <Info className="h-4 w-4 mr-2" />
              Instructions
            </Button>
            <Button
              onClick={() => setShowInstructions(false)}
              className={
                !showInstructions ? "bg-purple-600 text-white" : "bg-slate-700/50 text-purple-200 hover:bg-slate-600/50"
              }
            >
              <Muscle className="h-4 w-4 mr-2" />
              Body Effects
            </Button>
          </div>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              {showInstructions ? (
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold mb-4">How to Perform</h3>
                  <ol className="space-y-3">
                    {instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3 text-purple-200">
                        <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h4 className="text-orange-400 font-semibold mb-2">Benefits</h4>
                    <p className="text-orange-200">{exercise.benefits}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold mb-4">Body Effects After Completion</h3>
                  <div className="space-y-3">
                    {bodyEffects.map((effect, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">{effect.area}</div>
                          <div className="text-purple-200 text-sm">{effect.effect}</div>
                        </div>
                        <Badge
                          className={
                            effect.intensity === "High"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }
                        >
                          {effect.intensity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workout
          </Button>
          <Button
            onClick={handleStartExercise}
            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
          >
            <Timer className="h-4 w-4 mr-2" />
            Start Exercise
          </Button>
        </div>
      </div>
    </div>
  )
}
