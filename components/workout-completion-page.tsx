"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import { Trophy, Star, Flame, Clock, Target, TrendingUp, Share2, ArrowRight } from "lucide-react"

interface WorkoutCompletionPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function WorkoutCompletionPage({ userData, onNext, onBack, onUpdate }: WorkoutCompletionPageProps) {
  const [showCelebration, setShowCelebration] = useState(true)
  const [achievements, setAchievements] = useState<string[]>([])

  // Mock workout completion data
  const completedWorkout = {
    name: "Upper Body Strength",
    date: new Date().toISOString(),
    duration: "42 minutes",
    caloriesBurned: 285,
    exercisesCompleted: 5,
    totalExercises: 5,
    completionRate: 100,
    personalBests: ["Push-ups: 15 reps", "Plank: 45 seconds"],
  }

  useEffect(() => {
    // Store workout data in reports
    const newWorkoutReport = {
      id: `workout_${Date.now()}`,
      ...completedWorkout,
      type: "strength",
    }

    const existingReports = userData.workoutReports || []
    const updatedReports = [...existingReports, newWorkoutReport]

    // Update user data with new workout
    onUpdate({
      workoutReports: updatedReports,
      totalWorkoutsCompleted: (userData.totalWorkoutsCompleted || 0) + 1,
      totalCaloriesBurned: (userData.totalCaloriesBurned || 0) + completedWorkout.caloriesBurned,
      lastWorkoutDate: completedWorkout.date,
    })

    // Check for achievements
    const newAchievements = []
    if (updatedReports.length === 1) newAchievements.push("First Workout Complete!")
    if (updatedReports.length === 10) newAchievements.push("10 Workouts Milestone!")
    if (completedWorkout.completionRate === 100) newAchievements.push("Perfect Workout!")
    if (completedWorkout.caloriesBurned > 300) newAchievements.push("Calorie Crusher!")

    setAchievements(newAchievements)

    // Hide celebration after 3 seconds
    setTimeout(() => setShowCelebration(false), 3000)
  }, [])

  const handleShare = () => {
    alert("Workout shared successfully!")
  }

  const handleViewReports = () => {
    onNext() // Go to reports page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${showCelebration ? "scale-110" : "scale-100"}`}>
          <div className="relative">
            <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-yellow-400/20 rounded-full animate-ping" />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Workout Complete!</h1>
          <p className="text-purple-200 text-lg">Amazing job crushing your fitness goals!</p>
        </div>

        {/* Workout Summary */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">{completedWorkout.name}</CardTitle>
            <CardDescription className="text-purple-200">
              {new Date(completedWorkout.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedWorkout.duration}</div>
                <div className="text-purple-200 text-sm">Duration</div>
              </div>

              <div className="text-center">
                <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedWorkout.caloriesBurned}</div>
                <div className="text-purple-200 text-sm">Calories</div>
              </div>

              <div className="text-center">
                <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {completedWorkout.exercisesCompleted}/{completedWorkout.totalExercises}
                </div>
                <div className="text-purple-200 text-sm">Exercises</div>
              </div>

              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedWorkout.completionRate}%</div>
                <div className="text-purple-200 text-sm">Complete</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-200">Completion Rate</span>
                <span className="text-white">{completedWorkout.completionRate}%</span>
              </div>
              <Progress value={completedWorkout.completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Personal Bests */}
        {completedWorkout.personalBests.length > 0 && (
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Personal Bests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedWorkout.personalBests.map((best, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg"
                  >
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white">{best}</span>
                    <Badge className="bg-green-600 text-white ml-auto">New!</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg"
                  >
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-medium">{achievement}</span>
                    <Badge className="bg-yellow-600 text-white ml-auto">Unlocked!</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Achievement
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleViewReports} className="bg-blue-600 hover:bg-blue-700 text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
