"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { Target, TrendingDown, Minus, TrendingUp, ArrowLeft } from "lucide-react"

interface GoalsPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function GoalsPage({ userData, onNext, onBack, onUpdate }: GoalsPageProps) {
  const [selectedGoal, setSelectedGoal] = useState(userData.primaryGoal || "")

  const goals = [
    {
      id: "lose-weight",
      title: "Lose Weight",
      description: "Burn fat and achieve a leaner physique",
      icon: TrendingDown,
      color: "from-red-500 to-orange-500",
    },
    {
      id: "maintain",
      title: "Maintain Physique",
      description: "Keep your current body composition",
      icon: Minus,
      color: "from-blue-500 to-purple-500",
    },
    {
      id: "gain-weight",
      title: "Gain Weight",
      description: "Build muscle mass and increase strength",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const handleSubmit = () => {
    if (selectedGoal) {
      onUpdate({ primaryGoal: selectedGoal as "lose-weight" | "maintain" | "gain-weight" })
      onNext()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">What's your primary goal?</CardTitle>
            <CardDescription className="text-purple-200">
              Choose your main fitness objective to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => {
              const Icon = goal.icon
              return (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedGoal === goal.id
                      ? "bg-gradient-to-r " + goal.color + " border-white/20"
                      : "bg-slate-700/30 border-purple-500/20 hover:bg-slate-700/50"
                  }`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-white" />
                      <div>
                        <h3 className="text-white font-semibold">{goal.title}</h3>
                        <p className="text-purple-200 text-sm">{goal.description}</p>
                      </div>
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
