"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import { ArrowLeft, Play, Clock, Target, Flame, BoneIcon as Muscle, CheckCircle2 } from "lucide-react"

interface DailyWorkoutPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function DailyWorkoutPage({ userData, onNext, onBack, onUpdate }: DailyWorkoutPageProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<any>(null)

  // Get today's workout from the user's actual plan
  const getTodayWorkout = () => {
    const workoutPlan = userData.workoutPlan
    if (!workoutPlan?.weeklySchedule) {
      // Fallback to default workout
      return {
        day: "Day 1",
        date: new Date().toLocaleDateString(),
        focus: "Upper Body Strength",
        estimatedDuration: "45 minutes",
        estimatedCalories: "320 calories",
        exercises: [
          {
            id: "push-ups",
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
          },
          // ... other default exercises
        ],
      }
    }

    // Find today's workout from the plan
    const today = new Date().getDay()
    const todaySchedule =
      workoutPlan.weeklySchedule.find((day) => day.isToday) ||
      workoutPlan.weeklySchedule[today] ||
      workoutPlan.weeklySchedule[0]

    // Convert schedule to detailed workout
    const exerciseDetails = {
      "Push-ups": {
        id: "push-ups",
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
      },
      Squats: {
        id: "squats",
        name: "Bodyweight Squats",
        sets: 3,
        reps: "15-20",
        duration: "4 minutes",
        restTime: "60 seconds",
        difficulty: "Beginner",
        targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
        calories: 60,
        description: "Fundamental lower body movement",
        benefits: "Strengthens legs, improves mobility",
      },
      Plank: {
        id: "plank",
        name: "Plank Hold",
        sets: 3,
        reps: "30-45 seconds",
        duration: "3 minutes",
        restTime: "45 seconds",
        difficulty: "Intermediate",
        targetMuscles: ["Core", "Shoulders", "Back"],
        calories: 35,
        description: "Isometric core strengthening exercise",
        benefits: "Builds core strength, improves posture",
      },
      Lunges: {
        id: "lunges",
        name: "Forward Lunges",
        sets: 3,
        reps: "10 each leg",
        duration: "5 minutes",
        restTime: "60 seconds",
        difficulty: "Beginner",
        targetMuscles: ["Quadriceps", "Glutes", "Calves"],
        calories: 55,
        description: "Unilateral leg strengthening exercise",
        benefits: "Improves balance, builds leg strength",
      },
      Burpees: {
        id: "burpees",
        name: "Burpees",
        sets: 3,
        reps: "8-12",
        duration: "4 minutes",
        restTime: "90 seconds",
        difficulty: "High",
        targetMuscles: ["Full Body", "Core", "Cardio"],
        calories: 80,
        description: "High-intensity full body exercise",
        benefits: "Burns calories, improves cardiovascular fitness",
      },
      "Mountain Climbers": {
        id: "mountain-climbers",
        name: "Mountain Climbers",
        sets: 3,
        reps: "20 each leg",
        duration: "4 minutes",
        restTime: "60 seconds",
        difficulty: "Intermediate",
        targetMuscles: ["Core", "Shoulders", "Legs"],
        calories: 70,
        description: "High-intensity cardio and core exercise",
        benefits: "Burns calories, improves cardiovascular fitness",
      },
      // Add more exercise mappings as needed
    }

    const detailedExercises = (todaySchedule.exercises || []).map((exerciseName) => {
      return (
        exerciseDetails[exerciseName] || {
          id: exerciseName.toLowerCase().replace(/\s+/g, "-"),
          name: exerciseName,
          sets: 3,
          reps: "10-15",
          duration: "3 minutes",
          restTime: "60 seconds",
          difficulty: "Beginner",
          targetMuscles: ["General"],
          calories: 40,
          description: `${exerciseName} exercise`,
          benefits: "Improves fitness and strength",
        }
      )
    })

    return {
      day: todaySchedule.day,
      date: new Date().toLocaleDateString(),
      focus: todaySchedule.workoutName,
      estimatedDuration: todaySchedule.duration,
      estimatedCalories: `${detailedExercises.reduce((sum, ex) => sum + ex.calories, 0)} calories`,
      exercises: detailedExercises,
    }
  }

  const todayWorkout = getTodayWorkout()

  const progressPercentage = (completedExercises.length / todayWorkout.exercises.length) * 100

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise)
    onUpdate({ currentExercise: exercise })
    onNext() // Go to exercise detail page
  }

  const toggleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    )
  }

  const handleCompleteWorkout = () => {
    if (completedExercises.length === todayWorkout.exercises.length) {
      onUpdate({
        dailyProgress: {
          date: todayWorkout.date,
          completedExercises: completedExercises.length,
          totalExercises: todayWorkout.exercises.length,
          estimatedCalories: todayWorkout.estimatedCalories,
          duration: todayWorkout.estimatedDuration,
        },
      })
      // Skip to workout completion page
      onNext()
      onNext()
      onNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">{todayWorkout.focus}</CardTitle>
                <CardDescription className="text-purple-200">
                  {todayWorkout.day} • {todayWorkout.date}
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-orange-500 text-white">
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-purple-200">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{todayWorkout.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200">
                <Flame className="h-4 w-4" />
                <span className="text-sm">{todayWorkout.estimatedCalories}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="space-y-4 mb-6">
          {todayWorkout.exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id)
            return (
              <Card
                key={exercise.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isCompleted
                    ? "bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30"
                    : "bg-slate-800/50 border-purple-500/20 hover:bg-slate-700/50"
                } backdrop-blur-sm`}
                onClick={() => handleExerciseClick(exercise)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{exercise.name}</h3>
                          <p className="text-purple-200 text-sm">
                            {exercise.sets} sets • {exercise.reps} reps
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {exercise.targetMuscles.map((muscle) => (
                          <Badge
                            key={muscle}
                            variant="outline"
                            className="text-xs border-purple-500/30 text-purple-200"
                          >
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-purple-300">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {exercise.calories} cal
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {exercise.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExerciseComplete(exercise.id)
                        }}
                        className={
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-xs text-purple-300">{isCompleted ? "Done" : "Start"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            onClick={handleCompleteWorkout}
            disabled={completedExercises.length !== todayWorkout.exercises.length}
            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
          >
            <Muscle className="h-4 w-4 mr-2" />
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  )
}
