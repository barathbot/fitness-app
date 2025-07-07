"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { UserData } from "@/app/page"
import { ArrowLeft, Flame, Clock, Target, TrendingUp, Award, Calendar } from "lucide-react"

interface DailySummaryPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function DailySummaryPage({ userData, onNext, onBack, onUpdate }: DailySummaryPageProps) {
  const dailyStats = {
    caloriesBurned: 265,
    workoutDuration: "45 minutes",
    exercisesCompleted: 5,
    totalExercises: 5,
    averageHeartRate: 142,
    peakHeartRate: 168,
    activeMinutes: 38,
    restMinutes: 7,
  }

  const bodyCompositionChanges = [
    { metric: "Muscle Activation", before: "Baseline", after: "+2%", impact: "High" },
    { metric: "Metabolic Rate", before: "1,850 cal/day", after: "1,890 cal/day", impact: "Medium" },
    { metric: "Blood Flow", before: "Normal", after: "Enhanced", impact: "High" },
    { metric: "Flexibility", before: "Baseline", after: "+1.5%", impact: "Low" },
  ]

  const achievements = [
    { title: "First Workout Complete", description: "Completed your first daily workout", icon: "🎯" },
    { title: "Calorie Crusher", description: "Burned over 250 calories", icon: "🔥" },
    { title: "Perfect Form", description: "Completed all exercises", icon: "💪" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">Workout Complete!</CardTitle>
            <CardDescription className="text-purple-200">
              Great job! Here's your daily performance summary
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyStats.caloriesBurned}</div>
              <div className="text-orange-200 text-sm">Calories Burned</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyStats.workoutDuration}</div>
              <div className="text-purple-200 text-sm">Total Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Workout Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Exercises Completed</span>
              <div className="flex items-center gap-2">
                <Progress value={(dailyStats.exercisesCompleted / dailyStats.totalExercises) * 100} className="w-20" />
                <span className="text-white font-semibold">
                  {dailyStats.exercisesCompleted}/{dailyStats.totalExercises}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <div className="text-white font-semibold">{dailyStats.averageHeartRate} BPM</div>
                <div className="text-purple-200 text-sm">Avg Heart Rate</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <div className="text-white font-semibold">{dailyStats.peakHeartRate} BPM</div>
                <div className="text-purple-200 text-sm">Peak Heart Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <div className="text-white font-semibold">{dailyStats.activeMinutes} min</div>
                <div className="text-purple-200 text-sm">Active Time</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                <div className="text-white font-semibold">{dailyStats.restMinutes} min</div>
                <div className="text-purple-200 text-sm">Rest Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Composition Impact */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Body Composition Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bodyCompositionChanges.map((change, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">{change.metric}</div>
                  <div className="text-purple-200 text-sm">
                    {change.before} → {change.after}
                  </div>
                </div>
                <Badge
                  className={
                    change.impact === "High"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : change.impact === "Medium"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  }
                >
                  {change.impact}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-400" />
              Today's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="text-white font-semibold">{achievement.title}</div>
                  <div className="text-orange-200 text-sm">{achievement.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Weekly Progress
          </Button>
        </div>
      </div>
    </div>
  )
}
