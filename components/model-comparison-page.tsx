"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/app/page"
import { ArrowLeft, Eye } from "lucide-react"
import * as THREE from "three"

interface ModelComparisonPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

function ComparisonModel({
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Simulate body changes after workout plan
  const height = (userData.height || 170) / 170
  const weight = (userData.weight || 70) / 70
  const gender = userData.gender || "male"
  const primaryGoal = userData.specificGoals?.[0] || "muscle"

  // Simulate improvements based on selected goal
  const improvements = isAfter
    ? {
        strength: { muscleMass: 1.2, bodyFat: 0.85, definition: 1.3 },
        muscle: { muscleMass: 1.25, bodyFat: 0.8, definition: 1.4 },
        "weight-gain": { muscleMass: 1.15, bodyFat: 1.1, definition: 1.1 },
        "weight-loss": { muscleMass: 1.05, bodyFat: 0.7, definition: 1.2 },
      }[primaryGoal] || { muscleMass: 1.15, bodyFat: 0.8, definition: 1.2 }
    : { muscleMass: 1, bodyFat: 1, definition: 1 }

  const genderMultipliers =
    gender === "female"
      ? { shoulder: 0.85, chest: 0.9, waist: 0.8, hip: 1.1 }
      : { shoulder: 1.0, chest: 1.0, waist: 0.9, hip: 0.9 }

  const proportions = {
    height: height,
    shoulderWidth: 0.25 * height * genderMultipliers.shoulder * (isAfter ? 1.05 : 1),
    chestDepth: 0.12 * height * genderMultipliers.chest * improvements.muscleMass,
    waistWidth: 0.18 * height * genderMultipliers.waist * improvements.bodyFat,
    armThickness: 0.08 * improvements.muscleMass * improvements.definition,
    legThickness: 0.12 * improvements.muscleMass * improvements.definition,
  }

  // Create body shape
  const createBodyShape = () => {
    const bodyShape = new THREE.Shape()
    const sw = proportions.shoulderWidth
    const ww = proportions.waistWidth
    const h = proportions.height * 3

    bodyShape.moveTo(-sw, h * 0.4)
    bodyShape.quadraticCurveTo(-sw * 0.8, h * 0.2, -ww, 0)
    bodyShape.quadraticCurveTo(-ww * 1.2, -h * 0.1, -ww * 0.9, -h * 0.2)
    bodyShape.lineTo(ww * 0.9, -h * 0.2)
    bodyShape.quadraticCurveTo(ww * 1.2, -h * 0.1, ww, 0)
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

  // Color coding for improvements
  const getBodyPartColor = (bodyPart: string) => {
    if (!isAfter) return "#6366f1"

    const improvementLevel = improvements.muscleMass + improvements.definition - 1
    if (bodyPart === "arms" || bodyPart === "chest") {
      return improvementLevel > 0.3 ? "#10b981" : improvementLevel > 0.15 ? "#f59e0b" : "#6366f1"
    }
    if (bodyPart === "waist") {
      return improvements.bodyFat < 0.9 ? "#10b981" : "#6366f1"
    }
    return improvementLevel > 0.2 ? "#10b981" : "#6366f1"
  }

  const opacity = isAfter ? 0.9 : 0.7

  return (
    <group ref={groupRef} position={position}>
      <Text position={[0, 3.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>

      {/* Head */}
      <mesh position={[0, proportions.height * 1.8, 0]}>
        <sphereGeometry args={[0.15 * proportions.height, 12, 12]} />
        <meshStandardMaterial color={getBodyPartColor("head")} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Torso */}
      <mesh ref={meshRef} position={[0, 0, -proportions.chestDepth / 2]} geometry={bodyGeometry}>
        <meshStandardMaterial color={getBodyPartColor("chest")} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Arms */}
      <mesh
        position={[-proportions.shoulderWidth * 0.9, proportions.height * 1.2, 0]}
        rotation={[0, 0, Math.PI / 8]}
        geometry={armGeometry}
      >
        <meshStandardMaterial color={getBodyPartColor("arms")} wireframe transparent opacity={opacity} />
      </mesh>
      <mesh
        position={[proportions.shoulderWidth * 0.9, proportions.height * 1.2, 0]}
        rotation={[0, 0, -Math.PI / 8]}
        geometry={armGeometry}
      >
        <meshStandardMaterial color={getBodyPartColor("arms")} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Legs */}
      <mesh position={[-proportions.waistWidth * 0.4, -proportions.height * 0.3, 0]} geometry={legGeometry}>
        <meshStandardMaterial color={getBodyPartColor("legs")} wireframe transparent opacity={opacity} />
      </mesh>
      <mesh position={[proportions.waistWidth * 0.4, -proportions.height * 0.3, 0]} geometry={legGeometry}>
        <meshStandardMaterial color={getBodyPartColor("legs")} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Improvement highlights for enhanced model */}
      {isAfter && (
        <>
          {/* Muscle definition highlights */}
          <mesh position={[0, 0, -proportions.chestDepth / 2]} geometry={bodyGeometry}>
            <meshBasicMaterial color="#10b981" wireframe opacity={0.2} transparent />
          </mesh>
        </>
      )}
    </group>
  )
}

export function ModelComparisonPage({ userData, onNext, onBack, onUpdate }: ModelComparisonPageProps) {
  const primaryGoal = userData.specificGoals?.[0] || "muscle"

  const getGoalBasedDifferences = () => {
    const baseDifferences = {
      strength: [
        { area: "Muscle Mass", before: "45kg", after: "54kg", change: "+9kg" },
        { area: "Body Fat", before: "18%", after: "15%", change: "-3%" },
        { area: "Chest", before: "95cm", after: "100cm", change: "+5cm" },
        { area: "Arms", before: "32cm", after: "38cm", change: "+6cm" },
        { area: "Strength", before: "100%", after: "140%", change: "+40%" },
      ],
      muscle: [
        { area: "Muscle Mass", before: "45kg", after: "56kg", change: "+11kg" },
        { area: "Body Fat", before: "18%", after: "12%", change: "-6%" },
        { area: "Chest", before: "95cm", after: "105cm", change: "+10cm" },
        { area: "Arms", before: "32cm", after: "40cm", change: "+8cm" },
        { area: "Definition", before: "Low", after: "High", change: "+High" },
      ],
      "weight-gain": [
        { area: "Total Weight", before: "70kg", after: "78kg", change: "+8kg" },
        { area: "Muscle Mass", before: "45kg", after: "52kg", change: "+7kg" },
        { area: "Body Fat", before: "18%", after: "20%", change: "+2%" },
        { area: "Chest", before: "95cm", after: "100cm", change: "+5cm" },
        { area: "Overall Size", before: "Medium", after: "Large", change: "+Large" },
      ],
      "weight-loss": [
        { area: "Total Weight", before: "70kg", after: "62kg", change: "-8kg" },
        { area: "Body Fat", before: "18%", after: "10%", change: "-8%" },
        { area: "Waist", before: "85cm", after: "75cm", change: "-10cm" },
        { area: "Muscle Mass", before: "45kg", after: "47kg", change: "+2kg" },
        { area: "Definition", before: "Low", after: "High", change: "+High" },
      ],
    }
    return baseDifferences[primaryGoal as keyof typeof baseDifferences] || baseDifferences.muscle
  }

  const differences = getGoalBasedDifferences()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Body Transformation Preview</CardTitle>
            <CardDescription className="text-purple-200">
              Compare your current model with projected results. Drag to rotate both models!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <ComparisonModel title="Current" position={[-2.5, 0, 0]} userData={userData} />
                <ComparisonModel title="After Plan" isAfter={true} position={[2.5, 0, 0]} userData={userData} />

                <OrbitControls enableZoom={true} enablePan={true} />
              </Canvas>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-400" />
                    Projected Changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {differences.map((diff, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-purple-200">{diff.area}</span>
                      <div className="text-right">
                        <div className="text-white text-sm">
                          {diff.before} → {diff.after}
                        </div>
                        <div
                          className={`text-xs ${diff.change.startsWith("+") ? "text-green-400" : diff.change.startsWith("-") ? "text-orange-400" : "text-blue-400"}`}
                        >
                          {diff.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Color Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-purple-200">Major Improvement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-purple-200">Moderate Improvement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-purple-200">Baseline</span>
                  </div>
                  <div className="text-purple-200 text-sm mt-4">
                    <span className="text-white font-semibold">Goal:</span>{" "}
                    {primaryGoal.replace("-", " ").toUpperCase()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-6">
              <p className="text-purple-200 text-sm">
                These projections are based on your selected goal:{" "}
                <span className="text-white font-semibold">{primaryGoal.replace("-", " ")}</span>. Green areas show
                major improvements, yellow shows moderate changes.
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
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
