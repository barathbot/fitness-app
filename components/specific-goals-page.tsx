"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeft, Zap, Dumbbell, TrendingUp, Scale, Users } from "lucide-react"

interface SpecificGoalsPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function SpecificGoalsPage({ userData, onNext, onBack, onUpdate }: SpecificGoalsPageProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>(userData.specificGoals?.[0] || "")

  const specificGoals = [
    {
      id: "strength",
      title: "Increasing Strength",
      description: "Build raw power and lift heavier weights",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "muscle",
      title: "Building Muscles",
      description: "Increase muscle mass and definition",
      icon: Dumbbell,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "weight-gain",
      title: "Weight Gain",
      description: "Healthy weight increase with muscle growth",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "weight-loss",
      title: "Weight Loss",
      description: "Burn fat while maintaining muscle",
      icon: Scale,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "personal-training",
      title: "Personal Training",
      description: "One-on-one coaching (Coming Soon)",
      icon: Users,
      color: "from-purple-500 to-indigo-500",
      comingSoon: true,
    },
  ]

  const selectGoal = (goalId: string) => {
    if (specificGoals.find((g) => g.id === goalId)?.comingSoon) return
    setSelectedGoal(goalId)
  }

  const handleSubmit = () => {
    onUpdate({ specificGoals: [selectedGoal] })
    onNext()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Specific Goals</CardTitle>
            <CardDescription className="text-purple-200">Select your primary fitness objective</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {specificGoals.map((goal) => {
              const Icon = goal.icon
              const isSelected = selectedGoal === goal.id
              const isComingSoon = goal.comingSoon

              return (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isComingSoon
                      ? "bg-slate-700/20 border-slate-600/30 opacity-60"
                      : isSelected
                        ? "bg-gradient-to-r " + goal.color + " border-white/20"
                        : "bg-slate-700/30 border-purple-500/20 hover:bg-slate-700/50"
                  }`}
                  onClick={() => selectGoal(goal.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-white" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{goal.title}</h3>
                          {isComingSoon && (
                            <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">Soon</span>
                          )}
                        </div>
                        <p className="text-purple-200 text-sm">{goal.description}</p>
                      </div>
                      {isSelected && !isComingSoon && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedGoal}
                className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
