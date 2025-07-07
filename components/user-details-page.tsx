"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserData } from "@/app/page"
import { User, Ruler, Weight } from "lucide-react"

interface UserDetailsPageProps {
  userData: UserData
  onNext: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function UserDetailsPage({ userData, onNext, onUpdate }: UserDetailsPageProps) {
  const [height, setHeight] = useState(userData.height?.toString() || "")
  const [weight, setWeight] = useState(userData.weight?.toString() || "")
  const [gender, setGender] = useState(userData.gender || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      height: Number.parseFloat(height),
      weight: Number.parseFloat(weight),
      gender: gender as "male" | "female" | "other",
    })
    onNext()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-white text-2xl">Tell us about yourself</CardTitle>
            <CardDescription className="text-purple-200">
              We need some basic information to personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-white flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-400" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-white flex items-center gap-2">
                  <Weight className="h-4 w-4 text-purple-400" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white">
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="male" className="text-white hover:bg-purple-600/20">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="text-white hover:bg-purple-600/20">
                      Female
                    </SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-purple-600/20">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
