"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserData } from "@/app/page"
import { ArrowLeft, TrendingUp, BarChart3, Bot } from "lucide-react"
import * as THREE from "three"

interface WeeklyPerformancePageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

function WeeklyProgressModel({
  title,
  weekNumber,
  position,
  userData,
}: {
  title: string
  weekNumber: number
  position: [number, number, number]
  userData: UserData
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Progressive improvements over weeks
  const weeklyImprovement = {
    muscleMass: 1 + weekNumber * 0.03, // 3% per week
    bodyFat: 1 - weekNumber * 0.02, // 2% reduction per week
    definition: 1 + weekNumber * 0.025, // 2.5% per week
  }

  const height = (userData.height || 170) / 170
  const gender = userData.gender || "male"

  const genderMultipliers =
    gender === "female"
      ? { shoulder: 0.85, chest: 0.9, waist: 0.8, hip: 1.1 }
      : { shoulder: 1.0, chest: 1.0, waist: 0.9, hip: 0.9 }

  const proportions = {
    height: height,
    shoulderWidth: 0.25 * height * genderMultipliers.shoulder * (1 + weekNumber * 0.01),
    chestDepth: 0.12 * height * genderMultipliers.chest * weeklyImprovement.muscleMass,
    waistWidth: 0.18 * height * genderMultipliers.waist * weeklyImprovement.bodyFat,
    armThickness: 0.08 * weeklyImprovement.muscleMass,
    legThickness: 0.12 * weeklyImprovement.muscleMass,
  }

  const createBodyShape = () => {
    const bodyShape = new THREE.Shape()
    const sw = proportions.shoulderWidth
    const ww = proportions.waistWidth
    const h = proportions.height * 3

    bodyShape.moveTo(-sw, h * 0.4)
    bodyShape.quadraticCurveTo(-sw * 0.8, h * 0.2, -ww, 0)
    bodyShape.quadraticCurveTo(-ww * 1.1, -h * 0.1, -ww * 0.9, -h * 0.2)
    bodyShape.lineTo(ww * 0.9, -h * 0.2)
    bodyShape.quadraticCurveTo(ww * 1.1, -h * 0.1, ww, 0)
    bodyShape.quadraticCurveTo(sw * 0.8, h * 0.2, sw, h * 0.4)
    bodyShape.quadraticCurveTo(sw * 0.6, h * 0.5, 0, h * 0.45)
    bodyShape.quadraticCurveTo(-sw * 0.6, h * 0.5, -sw, h * 0.4)

    return new THREE.ExtrudeGeometry(bodyShape, {
      depth: proportions.chestDepth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    })
  }

  const createLimbGeometry = (length: number, thickness: number) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -length * 0.3, thickness * 0.1),
      new THREE.Vector3(0, -length * 0.7, thickness * 0.05),
      new THREE.Vector3(0, -length, 0),
    ])
    return new THREE.TubeGeometry(curve, 16, thickness, 8, false)
  }

  const bodyGeometry = createBodyShape()
  const armGeometry = createLimbGeometry(proportions.height * 1.2, proportions.armThickness)
  const legGeometry = createLimbGeometry(proportions.height * 1.5, proportions.legThickness)

  // Color progression from blue to green to gold
  const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"]
  const materialColor = colors[Math.min(weekNumber, 3)]
  const opacity = 0.7 + weekNumber * 0.1

  return (
    <group position={position}>
      <Text position={[0, 3.5, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>

      {/* Head */}
      <mesh position={[0, proportions.height * 1.8, 0]}>
        <sphereGeometry args={[0.15 * proportions.height, 12, 12]} />
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Torso */}
      <mesh ref={meshRef} position={[0, 0, -proportions.chestDepth / 2]} geometry={bodyGeometry}>
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Arms */}
      <mesh
        position={[-proportions.shoulderWidth * 0.9, proportions.height * 1.2, 0]}
        rotation={[0, 0, Math.PI / 8]}
        geometry={armGeometry}
      >
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>
      <mesh
        position={[proportions.shoulderWidth * 0.9, proportions.height * 1.2, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        geometry={armGeometry}
      >
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Legs */}
      <mesh position={[-proportions.waistWidth * 0.4, -proportions.height * 0.3, 0]} geometry={legGeometry}>
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>
      <mesh position={[proportions.waistWidth * 0.4, -proportions.height * 0.3, 0]} geometry={legGeometry}>
        <meshStandardMaterial color={materialColor} wireframe transparent opacity={opacity} />
      </mesh>

      {/* White outline */}
      <mesh position={[0, 0, -proportions.chestDepth / 2]} geometry={bodyGeometry}>
        <meshBasicMaterial color="#ffffff" wireframe opacity={0.2} transparent />
      </mesh>
    </group>
  )
}

export function WeeklyPerformancePage({ userData, onNext, onBack, onUpdate }: WeeklyPerformancePageProps) {
  const weeklyStats = [
    { week: "Week 1", workouts: 5, calories: 1320, avgDuration: "42 min" },
    { week: "Week 2", workouts: 6, calories: 1580, avgDuration: "45 min" },
    { week: "Week 3", workouts: 6, calories: 1650, avgDuration: "48 min" },
    { week: "Current", workouts: 1, calories: 265, avgDuration: "45 min" },
  ]

  const compositionChanges = [
    { metric: "Muscle Mass", week1: "45kg", current: "47.2kg", change: "+4.9%" },
    { metric: "Body Fat", week1: "18%", current: "15.8%", change: "-12.2%" },
    { metric: "BMI", week1: "22.4", current: "21.8", change: "-2.7%" },
    { metric: "Strength", week1: "Baseline", current: "+18%", change: "+18%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Weekly Performance Overview</CardTitle>
            <CardDescription className="text-purple-200">
              Track your transformation progress over the past weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 3D Model Progression */}
            <div className="h-96 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
              <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <WeeklyProgressModel title="Week 1" weekNumber={0} position={[-6, 0, 0]} userData={userData} />
                <WeeklyProgressModel title="Week 2" weekNumber={1} position={[-2, 0, 0]} userData={userData} />
                <WeeklyProgressModel title="Week 3" weekNumber={2} position={[2, 0, 0]} userData={userData} />
                <WeeklyProgressModel title="Current" weekNumber={3} position={[6, 0, 0]} userData={userData} />

                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Weekly Stats */}
              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Weekly Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyStats.map((week, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200 font-semibold">{week.week}</span>
                        <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                          {week.workouts} workouts
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-300">Calories: </span>
                          <span className="text-white">{week.calories}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Avg: </span>
                          <span className="text-white">{week.avgDuration}</span>
                        </div>
                      </div>
                      {index < weeklyStats.length - 1 && <div className="border-b border-slate-600/30" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Body Composition Changes */}
              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Composition Changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {compositionChanges.map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">{change.metric}</div>
                        <div className="text-purple-200 text-sm">
                          {change.week1} → {change.current}
                        </div>
                      </div>
                      <Badge
                        className={
                          change.change.startsWith("+") && change.metric !== "Body Fat"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : change.change.startsWith("-") ||
                                (change.change.startsWith("+") && change.metric === "Body Fat")
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }
                      >
                        {change.change}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progress Summary */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-orange-500/20 border-purple-500/30 mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold mb-4">3-Week Progress Summary</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-green-400">+4.9%</div>
                      <div className="text-purple-200 text-sm">Muscle Gain</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">-12.2%</div>
                      <div className="text-purple-200 text-sm">Fat Loss</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">18</div>
                      <div className="text-purple-200 text-sm">Total Workouts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mb-6">
              <p className="text-purple-200 text-sm mb-4">
                Your consistent effort is showing excellent results! Consider asking our AI for plan optimization.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={onNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              >
                <Bot className="h-4 w-4 mr-2" />
                Ask AI for Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
