"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { UserData } from "@/app/page"
import { ArrowLeft, Bot, Send, Sparkles, TrendingUp } from "lucide-react"

interface ChatbotRecommendationPageProps {
  userData: UserData
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export function ChatbotRecommendationPage({ userData, onBack, onUpdate }: ChatbotRecommendationPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content: `Hi! I've analyzed your 3-week progress and I'm impressed! You've gained 4.9% muscle mass and lost 12.2% body fat. Based on your performance, I can help optimize your workout plan. What would you like to focus on?`,
      timestamp: new Date(),
      suggestions: [
        "Increase muscle building intensity",
        "Add more cardio for fat loss",
        "Focus on strength training",
        "Improve workout variety",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickSuggestions = [
    { text: "I want to build more muscle", icon: "💪", category: "muscle" },
    { text: "Help me lose more fat", icon: "🔥", category: "fat-loss" },
    { text: "Increase my strength", icon: "⚡", category: "strength" },
    { text: "I'm getting bored with current exercises", icon: "🔄", category: "variety" },
    { text: "I want to train more frequently", icon: "📅", category: "frequency" },
    { text: "Suggest nutrition improvements", icon: "🥗", category: "nutrition" },
  ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(message)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase()

    let response = ""
    let suggestions: string[] = []

    if (lowerMessage.includes("muscle") || lowerMessage.includes("build")) {
      response = `Great choice! Based on your current progress, I recommend increasing your training intensity. Here's an optimized muscle-building plan:

🎯 **New Recommendations:**
• Increase sets from 3 to 4 for compound exercises
• Add progressive overload (5-10% weight increase weekly)
• Include isolation exercises for lagging muscle groups
• Extend rest periods to 90-120 seconds for strength gains

📈 **Expected Results:**
• 15-20% faster muscle growth
• Improved strength gains
• Better muscle definition

Would you like me to update your workout plan with these changes?`

      suggestions = ["Yes, update my plan", "Show me the new exercises", "What about nutrition?"]
    } else if (lowerMessage.includes("fat") || lowerMessage.includes("lose")) {
      response = `Excellent! Your fat loss progress is already impressive. Let's accelerate it further:

🔥 **Enhanced Fat Loss Strategy:**
• Add 2 HIIT sessions per week (15-20 minutes)
• Incorporate compound movements with shorter rest (45-60 seconds)
• Include metabolic circuits
• Add morning cardio sessions (optional)

📊 **Projected Impact:**
• 25-30% faster fat loss
• Improved cardiovascular fitness
• Better muscle definition

This should help you reach your goal 3-4 weeks earlier!`

      suggestions = ["Add HIIT to my plan", "Show me metabolic circuits", "Adjust my nutrition"]
    } else if (lowerMessage.includes("strength")) {
      response = `Perfect! Let's focus on maximizing your strength gains:

⚡ **Strength-Focused Modifications:**
• Prioritize compound movements (squats, deadlifts, bench press)
• Reduce reps to 3-6 range with heavier weights
• Increase rest periods to 2-3 minutes
• Add powerlifting techniques

💪 **Expected Outcomes:**
• 20-25% strength increase in 4 weeks
• Better neuromuscular coordination
• Improved functional fitness

Ready to become significantly stronger?`

      suggestions = ["Yes, make me stronger", "Show me powerlifting techniques", "What about safety?"]
    } else if (lowerMessage.includes("bored") || lowerMessage.includes("variety")) {
      response = `I understand! Variety keeps workouts exciting and prevents plateaus:

🔄 **Fresh Workout Variations:**
• Introduce new exercise variations weekly
• Add functional training movements
• Include plyometric exercises
• Try different training styles (circuit, pyramid, drop sets)

🎯 **Benefits:**
• Prevent adaptation plateaus
• Target muscles from different angles
• Keep motivation high
• Improve overall athleticism

Let's spice up your routine!`

      suggestions = ["Show me new exercises", "Add functional training", "Try different styles"]
    } else {
      response = `I understand your concern! Based on your excellent progress so far, here are some general recommendations:

✨ **Overall Optimization:**
• Your current plan is working well (4.9% muscle gain!)
• Consider periodization for continued progress
• Focus on recovery and sleep quality
• Track your nutrition more closely

📈 **Next Steps:**
• Gradually increase training intensity
• Add variety to prevent plateaus
• Consider working with a nutrition coach

What specific aspect would you like to improve most?`

      suggestions = ["Improve my recovery", "Track nutrition better", "Increase training intensity", "Add more variety"]
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      suggestions,
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Bot className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">AI Fitness Coach</CardTitle>
            <CardDescription className="text-purple-200">
              Get personalized recommendations based on your progress
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progress Summary */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Your Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">+4.9%</div>
                <div className="text-purple-200 text-sm">Muscle Mass</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-400">-12.2%</div>
                <div className="text-purple-200 text-sm">Body Fat</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">18</div>
                <div className="text-purple-200 text-sm">Workouts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white"
                        : "bg-slate-700/50 text-white border border-purple-500/20"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="mr-2 mb-2 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 text-white border border-purple-500/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-purple-200 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-400" />
              Quick Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="justify-start border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent p-3 h-auto"
                >
                  <span className="text-lg mr-3">{suggestion.icon}</span>
                  <span className="text-sm">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your workout plan..."
                className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
              />
              <Button
                onClick={() => handleSendMessage(inputMessage)}
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Weekly Performance
        </Button>
      </div>
    </div>
  )
}
