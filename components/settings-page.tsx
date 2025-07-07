"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { UserData } from "@/app/page"
import { User, Bell, Shield, Target, Smartphone, Download, Trash2, SettingsIcon, Home } from "lucide-react"

interface SettingsPageProps {
  userData: UserData
  onBack: () => void
  onBackToDashboard: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function SettingsPage({ userData, onBack, onBackToDashboard, onUpdate }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    // Profile Settings
    notifications: true,
    workoutReminders: true,
    progressUpdates: true,

    // Workout Settings
    restTimerSound: true,
    autoNextExercise: false,
    defaultRestTime: [60], // seconds
    workoutIntensity: [7], // 1-10 scale

    // App Settings
    darkMode: true,
    hapticFeedback: true,
    autoSync: true,

    // Privacy Settings
    shareProgress: false,
    anonymousData: true,

    // Units
    weightUnit: "kg",
    distanceUnit: "km",
  })

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onUpdate({ appSettings: newSettings })
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all workout data? This cannot be undone.")) {
      onUpdate({
        workoutReports: [],
        totalWorkoutsCompleted: 0,
        totalCaloriesBurned: 0,
      })
      alert("Workout data has been reset.")
    }
  }

  const handleExportData = () => {
    alert("Your workout data has been exported successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <SettingsIcon className="h-6 w-6" />
                  Settings
                </CardTitle>
                <CardDescription className="text-purple-200">Customize your fitness app experience</CardDescription>
              </div>
              <Button
                onClick={onBackToDashboard}
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Settings */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Height</div>
                <div className="text-purple-200 text-sm">{userData.height || 170} cm</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
              >
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Weight</div>
                <div className="text-purple-200 text-sm">{userData.weight || 70} kg</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
              >
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Fitness Goal</div>
                <div className="text-purple-200 text-sm capitalize">
                  {userData.primaryGoal?.replace("-", " ") || "Not set"}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/30 text-purple-200 hover:bg-purple-600/20 bg-transparent"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Push Notifications</div>
                <div className="text-purple-200 text-sm">Receive workout reminders and updates</div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Workout Reminders</div>
                <div className="text-purple-200 text-sm">Daily workout reminder notifications</div>
              </div>
              <Switch
                checked={settings.workoutReminders}
                onCheckedChange={(checked) => handleSettingChange("workoutReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Progress Updates</div>
                <div className="text-purple-200 text-sm">Weekly progress and achievement notifications</div>
              </div>
              <Switch
                checked={settings.progressUpdates}
                onCheckedChange={(checked) => handleSettingChange("progressUpdates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Workout Settings */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Workout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Rest Timer Sound</div>
                <div className="text-purple-200 text-sm">Play sound when rest time ends</div>
              </div>
              <Switch
                checked={settings.restTimerSound}
                onCheckedChange={(checked) => handleSettingChange("restTimerSound", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Auto Next Exercise</div>
                <div className="text-purple-200 text-sm">Automatically start next exercise after rest</div>
              </div>
              <Switch
                checked={settings.autoNextExercise}
                onCheckedChange={(checked) => handleSettingChange("autoNextExercise", checked)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium">Default Rest Time</div>
                <Badge className="bg-purple-600 text-white">{settings.defaultRestTime[0]}s</Badge>
              </div>
              <Slider
                value={settings.defaultRestTime}
                onValueChange={(value) => handleSettingChange("defaultRestTime", value)}
                max={180}
                min={30}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>30s</span>
                <span>180s</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium">Workout Intensity</div>
                <Badge className="bg-orange-600 text-white">{settings.workoutIntensity[0]}/10</Badge>
              </div>
              <Slider
                value={settings.workoutIntensity}
                onValueChange={(value) => handleSettingChange("workoutIntensity", value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>Easy</span>
                <span>Intense</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Haptic Feedback</div>
                <div className="text-purple-200 text-sm">Vibration feedback for interactions</div>
              </div>
              <Switch
                checked={settings.hapticFeedback}
                onCheckedChange={(checked) => handleSettingChange("hapticFeedback", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Auto Sync</div>
                <div className="text-purple-200 text-sm">Automatically sync workout data</div>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange("autoSync", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Weight Unit</div>
                <div className="text-purple-200 text-sm">Preferred weight measurement</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSettingChange("weightUnit", "kg")}
                  className={
                    settings.weightUnit === "kg"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 text-purple-200 hover:bg-slate-600"
                  }
                >
                  KG
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSettingChange("weightUnit", "lbs")}
                  className={
                    settings.weightUnit === "lbs"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 text-purple-200 hover:bg-slate-600"
                  }
                >
                  LBS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleExportData} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Workout Data
            </Button>

            <Button onClick={handleResetData} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBackToDashboard}
          variant="outline"
          className="w-full border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
