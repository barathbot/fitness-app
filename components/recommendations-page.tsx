"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeft, Calendar, Bot, Play, CheckCircle } from "lucide-react"

interface RecommendationsPageProps {
  userData: UserData
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
  onNext: () => void
}

export function RecommendationsPage({ userData, onBack, onUpdate, onNext }: RecommendationsPageProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const durations = [
    {
      id: "1-month",
      title: "1 Month Plan",
      description: "Quick start program for immediate results",
      icon: "🚀",
      focus: "Foundation building and habit formation",
    },
    {
      id: "3-month",
      title: "3 Month Plan",
      description: "Comprehensive transformation program",
      icon: "💪",
      focus: "Significant body composition changes",
    },
    {
      id: "6-month",
      title: "6 Month Plan",
      description: "Complete lifestyle transformation",
      icon: "🏆",
      focus: "Major strength and physique improvements",
    },
    {
      id: "1-year",
      title: "1 Year Plan",
      description: "Long-term mastery and optimization",
      icon: "👑",
      focus: "Elite fitness level achievement",
    },
  ]

  const generateRecommendations = async (duration: string) => {
    setIsGenerating(true)
    setSelectedDuration(duration)

    // Simulate AI recommendation generation
    setTimeout(() => {
      const mockRecommendations = [
        {
          phase: "Phase 1: Foundation",
          weeks: "1-4",
          focus: "Building base strength and form",
          workouts: ["Full body workouts 3x/week", "Cardio 2x/week", "Rest and recovery"],
        },
        {
          phase: "Phase 2: Progression",
          weeks: "5-8",
          focus: "Increasing intensity and volume",
          workouts: ["Upper/Lower split 4x/week", "HIIT cardio 2x/week", "Flexibility training"],
        },
        {
          phase: "Phase 3: Specialization",
          weeks: "9-12",
          focus: "Goal-specific training",
          workouts: ["Targeted muscle groups", "Advanced techniques", "Performance tracking"],
        },
      ]

      setRecommendations(mockRecommendations)
      setIsGenerating(false)
    }, 2000)
  }

  const startWorkoutPlan = () => {
    onNext() // Navigate to daily workout page instead of showing alert
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Bot className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">AI Workout Recommendations</CardTitle>
            <CardDescription className="text-purple-200">
              Get personalized workout plan recommendations based on your timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDuration ? (
              <div className="space-y-4">
                <h3 className="text-white text-lg mb-4">Choose your commitment timeline:</h3>
                {durations.map((duration) => (
                  <Card
                    key={duration.id}
                    className="cursor-pointer transition-all duration-200 bg-slate-700/30 border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-400/40"
                    onClick={() => generateRecommendations(duration.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{duration.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{duration.title}</h4>
                          <p className="text-purple-200 text-sm mb-1">{duration.description}</p>
                          <p className="text-purple-300 text-xs">{duration.focus}</p>
                        </div>
                        <Calendar className="h-5 w-5 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {isGenerating ? (
                  <div className="text-center py-8">
                    <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-white text-lg mb-2">Generating Your Plan...</h3>
                    <p className="text-purple-200">Analyzing your data and creating personalized recommendations</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-white text-xl mb-2">
                        Your {durations.find((d) => d.id === selectedDuration)?.title} Recommendation
                      </h3>
                      <p className="text-purple-200">
                        Based on your goal: {userData.specificGoals?.[0]?.replace("-", " ")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <Card key={index} className="bg-slate-700/30 border-purple-500/20">
                          <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              {rec.phase}
                            </CardTitle>
                            <CardDescription className="text-purple-200">
                              {rec.weeks} • {rec.focus}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {rec.workouts.map((workout: string, idx: number) => (
                                <li key={idx} className="text-purple-200 text-sm flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                  {workout}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="bg-gradient-to-r from-purple-600 to-orange-500 border-white/20">
                      <CardContent className="p-6 text-center">
                        <h4 className="text-white text-lg font-semibold mb-2">Ready to Start?</h4>
                        <p className="text-white/90 text-sm mb-4">
                          Your personalized workout plan is ready. Begin your transformation journey today!
                        </p>
                        <Button
                          onClick={startWorkoutPlan}
                          className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start My Workout Plan
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {selectedDuration && !isGenerating && (
                <Button
                  onClick={() => {
                    setSelectedDuration("")
                    setRecommendations([])
                  }}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                >
                  Choose Different Timeline
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
