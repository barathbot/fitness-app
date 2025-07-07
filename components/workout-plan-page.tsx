"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserData } from "@/app/page"
import { ArrowLeft, Bot, User, Dumbbell, Clock, Target } from "lucide-react"

interface WorkoutPlanPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function WorkoutPlanPage({ userData, onNext, onBack, onUpdate }: WorkoutPlanPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const predefinedPlans = [
    {
      id: "beginner-strength",
      name: "Beginner Strength",
      duration: "4 weeks",
      frequency: "3x/week",
      focus: "Building foundation strength",
      exercises: ["Squats", "Push-ups", "Planks", "Lunges"],
    },
    {
      id: "muscle-building",
      name: "Muscle Building",
      duration: "6 weeks",
      frequency: "4x/week",
      focus: "Hypertrophy and muscle growth",
      exercises: ["Bench Press", "Deadlifts", "Pull-ups", "Rows"],
    },
    {
      id: "fat-loss",
      name: "Fat Loss Circuit",
      duration: "4 weeks",
      frequency: "5x/week",
      focus: "High-intensity fat burning",
      exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "HIIT"],
    },
    {
      id: "full-body",
      name: "Full Body Workout",
      duration: "5 weeks",
      frequency: "3x/week",
      focus: "Complete body conditioning",
      exercises: ["Compound movements", "Functional training", "Core work"],
    },
  ]

  const generateAIPlan = async () => {
    setIsGenerating(true)

    // Simulate AI generation based on user data
    setTimeout(() => {
      const aiPlan = {
        id: "ai-generated",
        name: "Personalized AI Plan",
        duration: "6 weeks",
        frequency: "4x/week",
        focus: `Customized for ${userData.primaryGoal} with ${userData.specificGoals?.join(", ")}`,
        exercises: ["Custom exercises based on your 3D model", "Targeted muscle groups", "Progressive overload"],
        aiGenerated: true,
      }
      setSelectedPlan(aiPlan)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSubmit = () => {
    // Store the complete selected plan with all details
    const selectedPlanWithDetails = {
      ...selectedPlan,
      selectedAt: new Date().toISOString(),
      currentWeek: 1,
      weeklySchedule: selectedPlan.weeklySchedule || [],
    }

    onUpdate({ workoutPlan: selectedPlanWithDetails })
    onNext()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Choose Your Workout Plan</CardTitle>
            <CardDescription className="text-purple-200">
              Get an AI-generated plan or choose from our predefined options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="ai" className="text-white data-[state=active]:bg-purple-600">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Generated
                </TabsTrigger>
                <TabsTrigger value="predefined" className="text-white data-[state=active]:bg-purple-600">
                  <User className="h-4 w-4 mr-2" />
                  Choose Yourself
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="space-y-4">
                <div className="text-center py-8">
                  <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">AI-Powered Workout Plan</h3>
                  <p className="text-purple-200 mb-6">
                    Generate a personalized workout plan based on your goals, body composition, and 3D model
                  </p>

                  {selectedPlan?.aiGenerated ? (
                    <Card className="bg-gradient-to-r from-purple-600 to-orange-500 border-white/20 mb-4">
                      <CardContent className="p-4">
                        <div className="text-white">
                          <h4 className="font-semibold mb-2">{selectedPlan.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {selectedPlan.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              {selectedPlan.frequency}
                            </div>
                          </div>
                          <p className="text-sm mt-2 opacity-90">{selectedPlan.focus}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button
                      onClick={generateAIPlan}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
                    >
                      {isGenerating ? "Generating..." : "Generate AI Plan"}
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="predefined" className="space-y-3">
                {predefinedPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPlan?.id === plan.id
                        ? "bg-gradient-to-r from-purple-600 to-orange-500 border-white/20"
                        : "bg-slate-700/30 border-purple-500/20 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{plan.name}</h3>
                          <p className="text-purple-200 text-sm mb-2">{plan.focus}</p>
                          <div className="flex gap-4 text-xs text-purple-300">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {plan.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Dumbbell className="h-3 w-3" />
                              {plan.frequency}
                            </span>
                          </div>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6">
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
                disabled={!selectedPlan}
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
