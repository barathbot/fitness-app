"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/app/page"
import {
  Play,
  BarChart3,
  Settings,
  Calendar,
  Target,
  Flame,
  Clock,
  Trophy,
  TrendingUp,
  User,
  Dumbbell,
  Activity,
} from "lucide-react"

interface DashboardPageProps {
  userData: UserData
  onStartWorkout: () => void
  onViewReports: () => void
  onOpenSettings: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function DashboardPage({
  userData,
  onStartWorkout,
  onViewReports,
  onOpenSettings,
  onUpdate,
}: DashboardPageProps) {
  const [selectedDay, setSelectedDay] = useState(0)

  // Use actual workout plan data from user's selections
  const getWorkoutPlan = () => {
    if (userData.workoutPlan) {
      return userData.workoutPlan
    }

    // Generate dynamic workout based on user's goals and plan
    const goal = userData.specificGoals?.[0] || "muscle"
    const planType = userData.workoutPlan?.id || "beginner-strength"

    const workoutPlans = {
      "beginner-strength": {
        name: "Beginner Strength",
        duration: "4 weeks",
        frequency: "3x/week",
        currentWeek: 1,
        totalWeeks: 4,
        weeklySchedule: [
          {
            day: "Monday",
            workoutName: "Upper Body Strength",
            exercises: ["Push-ups", "Shoulder Press", "Tricep Dips", "Plank"],
            duration: "45 min",
            difficulty: "Beginner",
            completed: false,
            isToday: new Date().getDay() === 1,
          },
          {
            day: "Tuesday",
            workoutName: "Rest Day",
            exercises: ["Light stretching", "Walking"],
            duration: "20 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 2,
          },
          {
            day: "Wednesday",
            workoutName: "Lower Body Power",
            exercises: ["Squats", "Lunges", "Calf Raises", "Glute Bridges"],
            duration: "40 min",
            difficulty: "Beginner",
            completed: false,
            isToday: new Date().getDay() === 3,
          },
          {
            day: "Thursday",
            workoutName: "Rest Day",
            exercises: ["Yoga", "Meditation"],
            duration: "30 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 4,
          },
          {
            day: "Friday",
            workoutName: "Full Body Circuit",
            exercises: ["Burpees", "Mountain Climbers", "Planks", "Jumping Jacks"],
            duration: "35 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 5,
          },
          {
            day: "Saturday",
            workoutName: "Active Recovery",
            exercises: ["Light cardio", "Stretching"],
            duration: "25 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 6,
          },
          {
            day: "Sunday",
            workoutName: "Rest Day",
            exercises: ["Complete rest"],
            duration: "0 min",
            difficulty: "Rest",
            completed: false,
            isToday: new Date().getDay() === 0,
          },
        ],
      },
      "muscle-building": {
        name: "Muscle Building",
        duration: "6 weeks",
        frequency: "4x/week",
        currentWeek: 1,
        totalWeeks: 6,
        weeklySchedule: [
          {
            day: "Monday",
            workoutName: "Chest & Triceps",
            exercises: ["Bench Press", "Push-ups", "Tricep Dips", "Chest Flyes"],
            duration: "50 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 1,
          },
          {
            day: "Tuesday",
            workoutName: "Back & Biceps",
            exercises: ["Pull-ups", "Rows", "Bicep Curls", "Lat Pulldowns"],
            duration: "50 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 2,
          },
          {
            day: "Wednesday",
            workoutName: "Rest Day",
            exercises: ["Light stretching"],
            duration: "20 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 3,
          },
          {
            day: "Thursday",
            workoutName: "Legs & Glutes",
            exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"],
            duration: "55 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 4,
          },
          {
            day: "Friday",
            workoutName: "Shoulders & Core",
            exercises: ["Shoulder Press", "Lateral Raises", "Planks", "Russian Twists"],
            duration: "45 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 5,
          },
          {
            day: "Saturday",
            workoutName: "Rest Day",
            exercises: ["Active recovery"],
            duration: "30 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 6,
          },
          {
            day: "Sunday",
            workoutName: "Rest Day",
            exercises: ["Complete rest"],
            duration: "0 min",
            difficulty: "Rest",
            completed: false,
            isToday: new Date().getDay() === 0,
          },
        ],
      },
      "fat-loss": {
        name: "Fat Loss Circuit",
        duration: "4 weeks",
        frequency: "5x/week",
        currentWeek: 1,
        totalWeeks: 4,
        weeklySchedule: [
          {
            day: "Monday",
            workoutName: "HIIT Cardio",
            exercises: ["Burpees", "Jump Squats", "Mountain Climbers", "High Knees"],
            duration: "30 min",
            difficulty: "High",
            completed: false,
            isToday: new Date().getDay() === 1,
          },
          {
            day: "Tuesday",
            workoutName: "Strength Circuit",
            exercises: ["Push-ups", "Squats", "Planks", "Lunges"],
            duration: "35 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 2,
          },
          {
            day: "Wednesday",
            workoutName: "Cardio Blast",
            exercises: ["Jumping Jacks", "Burpees", "Sprint Intervals", "Jump Rope"],
            duration: "25 min",
            difficulty: "High",
            completed: false,
            isToday: new Date().getDay() === 3,
          },
          {
            day: "Thursday",
            workoutName: "Full Body HIIT",
            exercises: ["Thrusters", "Mountain Climbers", "Squat Jumps", "Push-ups"],
            duration: "30 min",
            difficulty: "High",
            completed: false,
            isToday: new Date().getDay() === 4,
          },
          {
            day: "Friday",
            workoutName: "Metabolic Circuit",
            exercises: ["Kettlebell Swings", "Burpees", "Battle Ropes", "Box Jumps"],
            duration: "35 min",
            difficulty: "High",
            completed: false,
            isToday: new Date().getDay() === 5,
          },
          {
            day: "Saturday",
            workoutName: "Active Recovery",
            exercises: ["Walking", "Stretching"],
            duration: "30 min",
            difficulty: "Low",
            completed: false,
            isToday: new Date().getDay() === 6,
          },
          {
            day: "Sunday",
            workoutName: "Rest Day",
            exercises: ["Complete rest"],
            duration: "0 min",
            difficulty: "Rest",
            completed: false,
            isToday: new Date().getDay() === 0,
          },
        ],
      },
    }

    return workoutPlans[planType] || workoutPlans["beginner-strength"]
  }

  const workoutPlan = getWorkoutPlan()

  // Calculate progress - add safety checks
  const completedWorkouts = workoutPlan.weeklySchedule?.filter((day) => day.completed).length || 0
  const totalWorkouts = workoutPlan.weeklySchedule?.filter((day) => day.workoutName !== "Rest Day").length || 1
  const weekProgress = (completedWorkouts / totalWorkouts) * 100

  // Find today's workout with safety check
  const todayWorkout = workoutPlan.weeklySchedule?.find((day) => day.isToday) || null

  // Mock stats
  const stats = {
    totalWorkouts: userData.totalWorkoutsCompleted || 12,
    totalCalories: userData.totalCaloriesBurned || 2840,
    currentStreak: 3,
    weeklyGoal: 4,
    completedThisWeek: completedWorkouts,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
            <p className="text-purple-200">Ready for today's workout?</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onViewReports}
              variant="outline"
              className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button
              onClick={onOpenSettings}
              variant="outline"
              className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
              <div className="text-purple-200 text-sm">Total Workouts</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalCalories}</div>
              <div className="text-purple-200 text-sm">Calories Burned</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-purple-200 text-sm">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {stats.completedThisWeek}/{stats.weeklyGoal}
              </div>
              <div className="text-purple-200 text-sm">Weekly Goal</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Workout
                </CardTitle>
                <CardDescription className="text-purple-200">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayWorkout ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{todayWorkout.workoutName}</h3>
                        <div className="flex items-center gap-4 text-purple-200 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {todayWorkout.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {todayWorkout.difficulty}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-orange-500 text-white">Today</Badge>
                    </div>

                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Exercises</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(todayWorkout.exercises || []).map((exercise, index) => (
                          <div key={index} className="flex items-center gap-2 text-purple-200 text-sm">
                            <Dumbbell className="h-3 w-3" />
                            {exercise}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={onStartWorkout}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
                      size="lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg mb-2">Rest Day!</h3>
                    <p className="text-purple-200">Take a well-deserved break today.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Weekly Schedule</CardTitle>
                <CardDescription className="text-purple-200">
                  Week {workoutPlan.currentWeek} of {workoutPlan.totalWeeks}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(workoutPlan.weeklySchedule || []).map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        day.isToday
                          ? "bg-gradient-to-r from-purple-600/20 to-orange-500/20 border border-purple-500/30"
                          : day.completed
                            ? "bg-green-600/20 border border-green-500/30"
                            : "bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-purple-200 text-sm font-medium w-16">{day.day}</div>
                          <div>
                            <div className="text-white font-medium">{day.workoutName}</div>
                            <div className="text-purple-200 text-sm">{day.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {day.isToday && <Badge className="bg-purple-600 text-white text-xs">Today</Badge>}
                          {day.completed && (
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold">{workoutPlan.name}</h3>
                    <p className="text-purple-200 text-sm">
                      {workoutPlan.duration} • {workoutPlan.frequency}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-200">Week Progress</span>
                      <span className="text-white">{Math.round(weekProgress)}%</span>
                    </div>
                    <Progress value={weekProgress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-200">Plan Progress</span>
                      <span className="text-white">
                        {workoutPlan.currentWeek}/{workoutPlan.totalWeeks} weeks
                      </span>
                    </div>
                    <Progress value={(workoutPlan.currentWeek / workoutPlan.totalWeeks) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Workouts</span>
                    <span className="text-white font-semibold">
                      {stats.completedThisWeek}/{stats.weeklyGoal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Calories</span>
                    <span className="text-white font-semibold">1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Minutes</span>
                    <span className="text-white font-semibold">185</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Streak</span>
                    <span className="text-white font-semibold">{stats.currentStreak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={onViewReports}
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button
                  onClick={onOpenSettings}
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
