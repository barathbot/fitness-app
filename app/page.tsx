"use client"

import { useState } from "react"
import { AuthPage } from "@/components/auth-page"
import { UserDetailsPage } from "@/components/user-details-page"
import { GoalsPage } from "@/components/goals-page"
import { BodyCompositionPage } from "@/components/body-composition-page"
import { BodyModelPage } from "@/components/body-model-page"
import { SpecificGoalsPage } from "@/components/specific-goals-page"
import { WorkoutPlanPage } from "@/components/workout-plan-page"
import { ModelComparisonPage } from "@/components/model-comparison-page"
import { RecommendationsPage } from "@/components/recommendations-page"
import { DashboardPage } from "@/components/dashboard-page"
import { DailyWorkoutPage } from "@/components/daily-workout-page"
import { ExerciseDetailPage } from "@/components/exercise-detail-page"
import { WorkoutTimerPage } from "@/components/workout-timer-page"
import { DailyProgressPage } from "@/components/daily-progress-page"
import { DailySummaryPage } from "@/components/daily-summary-page"
import { WeeklyPerformancePage } from "@/components/weekly-performance-page"
import { ChatbotRecommendationPage } from "@/components/chatbot-recommendation-page"
import { WorkoutCompletionPage } from "@/components/workout-completion-page"
import { ReportsPage } from "@/components/reports-page"
import { SettingsPage } from "@/components/settings-page"

export type UserData = {
  email?: string
  height?: number
  weight?: number
  gender?: "male" | "female" | "other"
  primaryGoal?: "lose-weight" | "maintain" | "gain-weight"
  bodyComposition?: {
    bodyFat?: number
    muscleMass?: number
    visceralFat?: number
    bmr?: number
  }
  customizedModel?: any
  specificGoals?: string[]
  workoutPlan?: any
  currentExercise?: any
  dailyProgress?: any
  weeklyStats?: any
  workoutReports?: any[]
  totalWorkoutsCompleted?: number
  totalCaloriesBurned?: number
  lastWorkoutDate?: string
  appSettings?: any
  completedExercises?: string[]
}

export default function FitnessApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState<UserData>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const steps = [
    "auth",
    "user-details",
    "goals",
    "body-composition",
    "body-model",
    "specific-goals",
    "workout-plan",
    "model-comparison",
    "recommendations",
    "dashboard", // New dashboard after setup
    "daily-workout",
    "exercise-detail",
    "workout-timer",
    "daily-progress",
    "daily-summary",
    "weekly-performance",
    "chatbot-recommendation",
    "workout-completion",
    "reports",
    "settings",
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToDashboard = () => {
    const dashboardIndex = steps.indexOf("dashboard")
    if (dashboardIndex !== -1) {
      setCurrentStep(dashboardIndex)
    }
  }

  const goToReports = () => {
    const reportsIndex = steps.indexOf("reports")
    if (reportsIndex !== -1) {
      setCurrentStep(reportsIndex)
    }
  }

  const goToSettings = () => {
    const settingsIndex = steps.indexOf("settings")
    if (settingsIndex !== -1) {
      setCurrentStep(settingsIndex)
    }
  }

  const startWorkout = () => {
    const workoutIndex = steps.indexOf("daily-workout")
    if (workoutIndex !== -1) {
      setCurrentStep(workoutIndex)
    }
  }

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const markWorkoutComplete = (dayIndex: number) => {
    const updatedUserData = { ...userData }
    if (updatedUserData.workoutPlan?.weeklySchedule?.[dayIndex]) {
      updatedUserData.workoutPlan.weeklySchedule[dayIndex].completed = true
    }
    setUserData(updatedUserData)
  }

  const updateWorkoutProgress = (exerciseId: string, completed: boolean) => {
    const updatedUserData = { ...userData }
    if (!updatedUserData.completedExercises) {
      updatedUserData.completedExercises = []
    }

    if (completed && !updatedUserData.completedExercises.includes(exerciseId)) {
      updatedUserData.completedExercises.push(exerciseId)
    } else if (!completed) {
      updatedUserData.completedExercises = updatedUserData.completedExercises.filter((id) => id !== exerciseId)
    }

    setUserData(updatedUserData)
  }

  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthenticated={() => {
          setIsAuthenticated(true)
          setCurrentStep(1)
        }}
      />
    )
  }

  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case "user-details":
        return <UserDetailsPage userData={userData} onNext={nextStep} onUpdate={updateUserData} />
      case "goals":
        return <GoalsPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "body-composition":
        return <BodyCompositionPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "body-model":
        return <BodyModelPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "specific-goals":
        return <SpecificGoalsPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "workout-plan":
        return <WorkoutPlanPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "model-comparison":
        return <ModelComparisonPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "recommendations":
        return <RecommendationsPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "dashboard":
        return (
          <DashboardPage
            userData={userData}
            onStartWorkout={startWorkout}
            onViewReports={goToReports}
            onOpenSettings={goToSettings}
            onUpdate={updateUserData}
            onMarkWorkoutComplete={markWorkoutComplete}
          />
        )
      case "daily-workout":
        return (
          <DailyWorkoutPage userData={userData} onNext={nextStep} onBack={goToDashboard} onUpdate={updateUserData} />
        )
      case "exercise-detail":
        return <ExerciseDetailPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "workout-timer":
        return <WorkoutTimerPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "daily-progress":
        return <DailyProgressPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "daily-summary":
        return <DailySummaryPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
      case "weekly-performance":
        return (
          <WeeklyPerformancePage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
        )
      case "chatbot-recommendation":
        return (
          <ChatbotRecommendationPage
            userData={userData}
            onNext={nextStep}
            onBack={prevStep}
            onUpdate={updateUserData}
          />
        )
      case "workout-completion":
        return (
          <WorkoutCompletionPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />
        )
      case "reports":
        return (
          <ReportsPage
            userData={userData}
            onNext={goToSettings}
            onBack={prevStep}
            onBackToDashboard={goToDashboard}
            onUpdate={updateUserData}
          />
        )
      case "settings":
        return (
          <SettingsPage
            userData={userData}
            onBack={goToReports}
            onBackToDashboard={goToDashboard}
            onUpdate={updateUserData}
          />
        )
      default:
        return <div>Loading...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderCurrentStep()}
    </div>
  )
}
