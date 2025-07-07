"use client"

import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import { AuthPage } from "./components/AuthPage"
import { UserDetailsPage } from "./components/UserDetailsPage"
import { GoalsPage } from "./components/GoalsPage"
import { DashboardPage } from "./components/DashboardPage"
import type { UserData } from "./types/UserData"

type AppStep =
  | "auth"
  | "user-details"
  | "goals"
  | "body-composition"
  | "specific-goals"
  | "body-model"
  | "model-comparison"
  | "workout-plan"
  | "recommendations"
  | "dashboard"
  | "daily-workout"
  | "exercise-detail"
  | "workout-timer"
  | "workout-completion"
  | "daily-progress"
  | "daily-summary"
  | "weekly-performance"
  | "chatbot-recommendation"
  | "reports"
  | "settings"

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("auth")
  const [userData, setUserData] = useState<UserData>({})

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const stepOrder: AppStep[] = [
      "auth",
      "user-details",
      "goals",
      "body-composition",
      "specific-goals",
      "body-model",
      "model-comparison",
      "workout-plan",
      "recommendations",
      "dashboard",
      "daily-workout",
      "exercise-detail",
      "workout-timer",
      "workout-completion",
      "daily-progress",
      "daily-summary",
      "weekly-performance",
      "chatbot-recommendation",
      "reports",
      "settings",
    ]

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const stepOrder: AppStep[] = [
      "auth",
      "user-details",
      "goals",
      "body-composition",
      "specific-goals",
      "body-model",
      "model-comparison",
      "workout-plan",
      "recommendations",
      "dashboard",
      "daily-workout",
      "exercise-detail",
      "workout-timer",
      "workout-completion",
      "daily-progress",
      "daily-summary",
      "weekly-performance",
      "chatbot-recommendation",
      "reports",
      "settings",
    ]

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const goToStep = (step: AppStep) => {
    setCurrentStep(step)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "auth":
        return <AuthPage onAuthenticated={nextStep} />

      case "user-details":
        return <UserDetailsPage userData={userData} onNext={nextStep} onUpdate={updateUserData} />

      case "goals":
        return <GoalsPage userData={userData} onNext={nextStep} onBack={prevStep} onUpdate={updateUserData} />

      case "dashboard":
        return (
          <DashboardPage
            userData={userData}
            onStartWorkout={() => goToStep("daily-workout")}
            onViewReports={() => goToStep("reports")}
            onOpenSettings={() => goToStep("settings")}
            onUpdate={updateUserData}
          />
        )

      default:
        return <AuthPage onAuthenticated={nextStep} />
    }
  }

  return (
    <>
      <StatusBar style="light" />
      {renderCurrentStep()}
    </>
  )
}
