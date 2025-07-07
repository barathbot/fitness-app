"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserData } from "@/app/page"
import { Activity, Upload, Smartphone, ArrowLeft } from "lucide-react"

interface BodyCompositionPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function BodyCompositionPage({ userData, onNext, onBack, onUpdate }: BodyCompositionPageProps) {
  const [bodyFat, setBodyFat] = useState(userData.bodyComposition?.bodyFat?.toString() || "")
  const [muscleMass, setMuscleMass] = useState(userData.bodyComposition?.muscleMass?.toString() || "")
  const [visceralFat, setVisceralFat] = useState(userData.bodyComposition?.visceralFat?.toString() || "")
  const [bmr, setBmr] = useState(userData.bodyComposition?.bmr?.toString() || "")

  const handleSubmit = () => {
    onUpdate({
      bodyComposition: {
        bodyFat: Number.parseFloat(bodyFat) || 0,
        muscleMass: Number.parseFloat(muscleMass) || 0,
        visceralFat: Number.parseFloat(visceralFat) || 0,
        bmr: Number.parseFloat(bmr) || 0,
      },
    })
    onNext()
  }

  const handleGoogleFitConnect = () => {
    // Simulate Google Fit connection
    alert("Google Fit integration coming soon!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Activity className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">Body Composition</CardTitle>
            <CardDescription className="text-purple-200">
              Connect your smartwatch or enter your body composition data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="smartwatch" className="text-white data-[state=active]:bg-purple-600">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Smartwatch
                </TabsTrigger>
                <TabsTrigger value="manual" className="text-white data-[state=active]:bg-purple-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Manual
                </TabsTrigger>
              </TabsList>

              <TabsContent value="smartwatch" className="space-y-4">
                <div className="text-center py-8">
                  <Smartphone className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-white mb-4">
                    Connect your smartwatch to automatically sync your body composition data
                  </p>
                  <Button
                    onClick={handleGoogleFitConnect}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Connect Google Fit
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bodyFat" className="text-white">
                      Body Fat (%)
                    </Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      placeholder="15"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="muscleMass" className="text-white">
                      Muscle Mass (kg)
                    </Label>
                    <Input
                      id="muscleMass"
                      type="number"
                      placeholder="45"
                      value={muscleMass}
                      onChange={(e) => setMuscleMass(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visceralFat" className="text-white">
                      Visceral Fat Level
                    </Label>
                    <Input
                      id="visceralFat"
                      type="number"
                      placeholder="8"
                      value={visceralFat}
                      onChange={(e) => setVisceralFat(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bmr" className="text-white">
                      BMR (calories/day)
                    </Label>
                    <Input
                      id="bmr"
                      type="number"
                      placeholder="1800"
                      value={bmr}
                      onChange={(e) => setBmr(e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                    />
                  </div>
                </div>
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
