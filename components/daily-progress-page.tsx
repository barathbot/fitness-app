"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeft, TrendingUp } from "lucide-react"
import * as THREE from "three"

interface DailyProgressPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

function DailyComparisonModel({
  title,
  isAfter = false,
  position,
  userData,
}: {
  title: string
  isAfter?: boolean
  position: [number, number, number]
  userData: UserData
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Simulate daily improvements (smaller than weekly/monthly)
  const dailyImprovement = isAfter
    ? {
        muscleTone: 1.02, // 2% improvement
        posture: 1.01, // 1% improvement
        definition: 1.015, // 1.5% improvement
      }
    : {
        muscleTone: 1,
        posture: 1,
        definition: 1,
      }

  const height = (userData.height || 170) / 170
  const gender = userData.gender || "male"

  const genderMultipliers =
    gender === "female"
      ? { shoulder: 0.85, chest: 0.9, waist: 0.8, hip: 1.1 }
      : { shoulder: 1.0, chest: 1.0, waist: 0.9, hip: 0.9 }

  const proportions = {
    height: height,
    shoulderWidth: 0.25 * height * genderMultipliers.shoulder * dailyImprovement.posture,
    chestDepth: 0.12 * height * genderMultipliers.chest * dailyImprovement.muscleTone,
    waistWidth: 0.18 * height * genderMultipliers.waist,
    armThickness: 0.08 * dailyImprovement.muscleTone,
    legThickness: 0.12 * dailyImprovement.muscleTone,
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

  const materialColor = isAfter ? "#10b981" : "#6366f1"
  const opacity = isAfter ? 0.9 : 0.7

  return (
    <group position={position}>
      <Text position={[0, 3.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
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

export function DailyProgressPage({ userData, onNext, onBack, onUpdate }: DailyProgressPageProps) {
  const dailyChanges = [
    { metric: "Muscle Activation", change: "+2%", color: "text-green-400" },
    { metric: "Posture", change: "+1%", color: "text-blue-400" },
    { metric: "Endurance", change: "+3%", color: "text-purple-400" },
    { metric: "Flexibility", change: "+1.5%", color: "text-orange-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Daily Progress Comparison</CardTitle>
            <CardDescription className="text-purple-200">
              See the immediate effects of today's workout on your body
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <DailyComparisonModel title="Before Workout" position={[-2.5, 0, 0]} userData={userData} />
                <DailyComparisonModel title="After Workout" isAfter={true} position={[2.5, 0, 0]} userData={userData} />

                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Daily Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dailyChanges.map((change, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-purple-200">{change.metric}</span>
                      <span className={`font-semibold ${change.color}`}>{change.change}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Today's Achievement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                    <div className="text-purple-200 mb-4">Workout Completed</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-purple-300">Exercises</div>
                        <div className="text-white font-semibold">5/5</div>
                      </div>
                      <div>
                        <div className="text-purple-300">Duration</div>
                        <div className="text-white font-semibold">45 min</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-6">
              <p className="text-purple-200 text-sm">
                Daily changes are subtle but consistent progress leads to significant transformations over time.
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
                View Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
