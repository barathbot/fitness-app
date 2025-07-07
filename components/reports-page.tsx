"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import { TrendingUp, Flame, Clock, Target, BarChart3, Activity, Award, Filter, Download, Home } from "lucide-react"

interface ReportsPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onBackToDashboard: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function ReportsPage({ userData, onNext, onBack, onBackToDashboard, onUpdate }: ReportsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "strength" | "cardio" | "flexibility">("all")

  // Mock data - in real app this would come from userData.workoutReports
  const workoutReports = userData.workoutReports || [
    {
      id: "workout_1",
      date: new Date().toISOString(),
      workoutName: "Upper Body Strength",
      duration: "42 minutes",
      caloriesBurned: 285,
      exercisesCompleted: 5,
      totalExercises: 5,
      completionRate: 100,
      type: "strength",
    },
    {
      id: "workout_2",
      date: new Date(Date.now() - 86400000).toISOString(),
      workoutName: "Cardio Blast",
      duration: "35 minutes",
      caloriesBurned: 320,
      exercisesCompleted: 4,
      totalExercises: 4,
      completionRate: 100,
      type: "cardio",
    },
    {
      id: "workout_3",
      date: new Date(Date.now() - 172800000).toISOString(),
      workoutName: "Lower Body Power",
      duration: "38 minutes",
      caloriesBurned: 295,
      exercisesCompleted: 5,
      totalExercises: 6,
      completionRate: 83,
      type: "strength",
    },
  ]

  // Calculate statistics
  const totalWorkouts = workoutReports.length
  const totalCalories = workoutReports.reduce((sum, workout) => sum + workout.caloriesBurned, 0)
  const totalMinutes = workoutReports.reduce((sum, workout) => {
    const minutes = Number.parseInt(workout.duration.split(" ")[0])
    return sum + minutes
  }, 0)
  const averageCompletion = workoutReports.reduce((sum, workout) => sum + workout.completionRate, 0) / totalWorkouts

  const filteredReports = workoutReports.filter((report) => {
    if (selectedFilter === "all") return true
    return report.type === selectedFilter
  })

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-red-600"
      case "cardio":
        return "bg-orange-600"
      case "flexibility":
        return "bg-green-600"
      default:
        return "bg-purple-600"
    }
  }

  const handleExportReports = () => {
    // Mock export functionality
    alert("Reports exported successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Workout Reports
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Track your fitness progress and achievements
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onBackToDashboard}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleExportReports}
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalWorkouts}</div>
              <div className="text-purple-200 text-sm">Total Workouts</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalCalories}</div>
              <div className="text-purple-200 text-sm">Calories Burned</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalMinutes}</div>
              <div className="text-purple-200 text-sm">Minutes Trained</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round(averageCompletion)}%</div>
              <div className="text-purple-200 text-sm">Avg Completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">Filter by:</span>
              </div>

              <div className="flex gap-2">
                {["all", "strength", "cardio", "flexibility"].map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    onClick={() => setSelectedFilter(filter as any)}
                    className={
                      selectedFilter === filter
                        ? "bg-purple-600 text-white"
                        : "bg-slate-700 text-purple-200 hover:bg-slate-600"
                    }
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 ml-auto">
                {["week", "month", "all"].map((period) => (
                  <Button
                    key={period}
                    size="sm"
                    onClick={() => setSelectedPeriod(period as any)}
                    className={
                      selectedPeriod === period
                        ? "bg-orange-600 text-white"
                        : "bg-slate-700 text-purple-200 hover:bg-slate-600"
                    }
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white">Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((workout, index) => (
                <div key={workout.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getWorkoutTypeColor(workout.type)}`} />
                      <div>
                        <h3 className="text-white font-semibold">{workout.workoutName}</h3>
                        <p className="text-purple-200 text-sm">{new Date(workout.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        workout.completionRate === 100
                          ? "bg-green-600 text-white"
                          : workout.completionRate >= 80
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                      }
                    >
                      {workout.completionRate}% Complete
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <Clock className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-white text-sm">{workout.duration}</div>
                    </div>
                    <div className="text-center">
                      <Flame className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                      <div className="text-white text-sm">{workout.caloriesBurned} cal</div>
                    </div>
                    <div className="text-center">
                      <Target className="h-4 w-4 text-green-400 mx-auto mb-1" />
                      <div className="text-white text-sm">
                        {workout.exercisesCompleted}/{workout.totalExercises} exercises
                      </div>
                    </div>
                  </div>

                  <Progress value={workout.completionRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Trends */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Weekly Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Consistency</span>
                    <span className="text-white">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Intensity</span>
                    <span className="text-white">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Achievements</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-purple-200 text-sm">3 Day Streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-purple-200 text-sm">1000+ Calories Burned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span className="text-purple-200 text-sm">Perfect Week</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onBackToDashboard}
            variant="outline"
            className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
