"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import type { UserData } from "@/app/page"
import { ArrowLeft, RotateCcw, X } from "lucide-react"
import type * as THREE from "three"

interface BodyModelPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

interface AnchorPoint {
  id: string
  position: [number, number, number]
  label: string
  scale: number
}

interface BodyProportions {
  height: number
  shoulderWidth: number
  chestWidth: number
  waistWidth: number
  hipWidth: number
  armLength: number
  legLength: number
  neckRadius: number
  headRadius: number
  armRadius: number
  forearmRadius: number
  thighRadius: number
  calfRadius: number
  torsoDepth: number
}

// Calculate body proportions based on reference image
function calculateBodyProportions(userData: UserData, customizations: AnchorPoint[]): BodyProportions {
  const height = (userData.height || 170) / 100
  const gender = userData.gender || "male"
  const bodyFat = userData.bodyComposition?.bodyFat || 15
  const muscleMass = userData.bodyComposition?.muscleMass || 45

  // Get customization scales
  const getScale = (id: string) => customizations.find((c) => c.id === id)?.scale || 1

  // Body composition factors
  const muscleFactor = Math.max(0.8, Math.min(1.4, muscleMass / 45))
  const fatFactor = Math.max(0.9, Math.min(1.3, bodyFat / 15))

  // Scale for visibility
  const scale = 4

  // Proportions matching the reference image
  const baseProps = {
    height: height * scale,
    headRadius: height * 0.08 * scale,
    neckRadius: height * 0.03 * scale,
    shoulderWidth: height * (gender === "female" ? 0.22 : 0.28) * scale,
    chestWidth: height * (gender === "female" ? 0.18 : 0.24) * scale,
    waistWidth: height * (gender === "female" ? 0.15 : 0.2) * scale,
    hipWidth: height * (gender === "female" ? 0.22 : 0.2) * scale,
    armLength: height * 0.35 * scale,
    legLength: height * 0.5 * scale,
    torsoDepth: height * (gender === "female" ? 0.12 : 0.15) * scale,
  }

  return {
    height: baseProps.height,
    headRadius: baseProps.headRadius,
    neckRadius: baseProps.neckRadius,
    shoulderWidth: baseProps.shoulderWidth * getScale("shoulders"),
    chestWidth: baseProps.chestWidth * getScale("chest") * muscleFactor,
    waistWidth: baseProps.waistWidth * getScale("waist") * fatFactor,
    hipWidth: baseProps.hipWidth,
    armLength: baseProps.armLength,
    legLength: baseProps.legLength,
    torsoDepth: baseProps.torsoDepth * muscleFactor,
    armRadius: height * 0.025 * scale * getScale("biceps") * muscleFactor,
    forearmRadius: height * 0.02 * scale * getScale("biceps") * muscleFactor,
    thighRadius: height * 0.032 * scale * getScale("thighs") * muscleFactor,
    calfRadius: height * 0.025 * scale * getScale("thighs") * muscleFactor,
    torsoDepth: baseProps.torsoDepth * muscleFactor,
  }
}

// Sketch-style material with wireframe effect
function SketchMaterial({ color = "#2a2a2a", opacity = 0.8 }) {
  return <meshBasicMaterial color={color} wireframe={true} transparent opacity={opacity} />
}

// Solid sketch material for filled areas
function SolidSketchMaterial({ color = "#f0f0f0", opacity = 0.9 }) {
  return <meshBasicMaterial color={color} transparent opacity={opacity} />
}

function SketchHumanModel({
  userData,
  anchorPoints,
  onAnchorClick,
  selectedAnchor,
}: {
  userData: UserData
  anchorPoints: AnchorPoint[]
  onAnchorClick: (id: string) => void
  selectedAnchor: string | null
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredAnchor, setHoveredAnchor] = useState<string | null>(null)

  const props = useMemo(() => calculateBodyProportions(userData, anchorPoints), [userData, anchorPoints])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05
    }
  })

  // Calculate anchor positions based on reference image
  const getAnchorPosition = (id: string): [number, number, number] => {
    switch (id) {
      case "shoulders":
        return [props.shoulderWidth * 0.45, props.height * 0.42, 0]
      case "left-shoulder":
        return [-props.shoulderWidth * 0.45, props.height * 0.42, 0]
      case "chest":
        return [0, props.height * 0.25, props.torsoDepth * 0.5]
      case "waist":
        return [0, props.height * 0.05, props.torsoDepth * 0.5]
      case "biceps":
        return [props.shoulderWidth * 0.7, props.height * 0.32, 0]
      case "left-biceps":
        return [-props.shoulderWidth * 0.7, props.height * 0.32, 0]
      case "thighs":
        return [props.hipWidth * 0.15, -props.height * 0.15, 0]
      case "left-thigh":
        return [-props.hipWidth * 0.15, -props.height * 0.15, 0]
      default:
        return [0, 0, 0]
    }
  }

  return (
    <group ref={groupRef}>
      {/* Head - Solid */}
      <mesh position={[0, props.height * 0.52, 0]}>
        <sphereGeometry args={[props.headRadius, 16, 16]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>

      {/* Head - Wireframe outline */}
      <mesh position={[0, props.height * 0.52, 0]}>
        <sphereGeometry args={[props.headRadius, 16, 16]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, props.height * 0.44, 0]}>
        <cylinderGeometry args={[props.neckRadius, props.neckRadius * 1.1, props.height * 0.08, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[0, props.height * 0.44, 0]}>
        <cylinderGeometry args={[props.neckRadius, props.neckRadius * 1.1, props.height * 0.08, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Torso - Solid */}
      <mesh position={[0, props.height * 0.15, 0]}>
        <boxGeometry args={[props.chestWidth, props.height * 0.45, props.torsoDepth]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>

      {/* Torso - Wireframe */}
      <mesh position={[0, props.height * 0.15, 0]}>
        <boxGeometry args={[props.chestWidth, props.height * 0.45, props.torsoDepth]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Arms - T-pose */}
      {/* Right Upper Arm */}
      <mesh position={[props.shoulderWidth * 0.5, props.height * 0.32, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[props.armRadius * 0.9, props.armRadius, props.armLength, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[props.shoulderWidth * 0.5, props.height * 0.32, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[props.armRadius * 0.9, props.armRadius, props.armLength, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Right Forearm */}
      <mesh
        position={[props.shoulderWidth * 0.5 + props.armLength, props.height * 0.32, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <cylinderGeometry args={[props.forearmRadius, props.armRadius * 0.9, props.armLength * 0.9, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh
        position={[props.shoulderWidth * 0.5 + props.armLength, props.height * 0.32, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <cylinderGeometry args={[props.forearmRadius, props.armRadius * 0.9, props.armLength * 0.9, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh position={[-props.shoulderWidth * 0.5, props.height * 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[props.armRadius * 0.9, props.armRadius, props.armLength, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[-props.shoulderWidth * 0.5, props.height * 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[props.armRadius * 0.9, props.armRadius, props.armLength, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Left Forearm */}
      <mesh
        position={[-props.shoulderWidth * 0.5 - props.armLength, props.height * 0.32, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[props.forearmRadius, props.armRadius * 0.9, props.armLength * 0.9, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh
        position={[-props.shoulderWidth * 0.5 - props.armLength, props.height * 0.32, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[props.forearmRadius, props.armRadius * 0.9, props.armLength * 0.9, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Legs */}
      {/* Right Thigh */}
      <mesh position={[props.hipWidth * 0.15, -props.height * 0.08, 0]}>
        <cylinderGeometry args={[props.thighRadius * 0.85, props.thighRadius, props.legLength * 0.55, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[props.hipWidth * 0.15, -props.height * 0.08, 0]}>
        <cylinderGeometry args={[props.thighRadius * 0.85, props.thighRadius, props.legLength * 0.55, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Right Calf */}
      <mesh position={[props.hipWidth * 0.15, -props.height * 0.08 - props.legLength * 0.55, 0]}>
        <cylinderGeometry args={[props.calfRadius, props.thighRadius * 0.85, props.legLength * 0.45, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[props.hipWidth * 0.15, -props.height * 0.08 - props.legLength * 0.55, 0]}>
        <cylinderGeometry args={[props.calfRadius, props.thighRadius * 0.85, props.legLength * 0.45, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Left Thigh */}
      <mesh position={[-props.hipWidth * 0.15, -props.height * 0.08, 0]}>
        <cylinderGeometry args={[props.thighRadius * 0.85, props.thighRadius, props.legLength * 0.55, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[-props.hipWidth * 0.15, -props.height * 0.08, 0]}>
        <cylinderGeometry args={[props.thighRadius * 0.85, props.thighRadius, props.legLength * 0.55, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Left Calf */}
      <mesh position={[-props.hipWidth * 0.15, -props.height * 0.08 - props.legLength * 0.55, 0]}>
        <cylinderGeometry args={[props.calfRadius, props.thighRadius * 0.85, props.legLength * 0.45, 12]} />
        <SolidSketchMaterial color="#e8e8e8" opacity={0.9} />
      </mesh>
      <mesh position={[-props.hipWidth * 0.15, -props.height * 0.08 - props.legLength * 0.55, 0]}>
        <cylinderGeometry args={[props.calfRadius, props.thighRadius * 0.85, props.legLength * 0.45, 12]} />
        <SketchMaterial color="#2a2a2a" opacity={1.0} />
      </mesh>

      {/* Anchor Points - positioned exactly like in reference image */}
      {anchorPoints.map((anchor) => {
        const position = getAnchorPosition(anchor.id)
        const isSelected = selectedAnchor === anchor.id
        const isHovered = hoveredAnchor === anchor.id

        return (
          <group key={anchor.id} position={position}>
            <mesh
              scale={isSelected ? 1.8 : isHovered ? 1.5 : 1.2}
              onPointerEnter={() => setHoveredAnchor(anchor.id)}
              onPointerLeave={() => setHoveredAnchor(null)}
              onClick={(e) => {
                e.stopPropagation()
                onAnchorClick(anchor.id)
              }}
            >
              <sphereGeometry args={[0.06]} />
              <meshBasicMaterial
                color={isSelected ? "#ff6b35" : isHovered ? "#4a90e2" : "#4a90e2"}
                transparent
                opacity={0.9}
              />
            </mesh>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.05}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.001}
              outlineColor="#ffffff"
            >
              {anchor.label}
            </Text>
            {isSelected && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.1, 16]} />
                <meshBasicMaterial color="#ff6b35" transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export function BodyModelPage({ userData, onNext, onBack, onUpdate }: BodyModelPageProps) {
  const [anchorPoints, setAnchorPoints] = useState<AnchorPoint[]>([
    { id: "shoulders", position: [0, 1.2, 0], label: "R Shoulder", scale: 1 },
    { id: "left-shoulder", position: [0, 1.2, 0], label: "L Shoulder", scale: 1 },
    { id: "chest", position: [0, 0.5, 0], label: "Chest", scale: 1 },
    { id: "waist", position: [0, -0.3, 0], label: "Waist", scale: 1 },
    { id: "biceps", position: [-1.2, 0.5, 0], label: "R Bicep", scale: 1 },
    { id: "left-biceps", position: [-1.2, 0.5, 0], label: "L Bicep", scale: 1 },
    { id: "thighs", position: [0, -2.4, 0], label: "R Thigh", scale: 1 },
    { id: "left-thigh", position: [0, -2.4, 0], label: "L Thigh", scale: 1 },
  ])

  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null)

  const handleAnchorClick = (id: string) => {
    setSelectedAnchor(selectedAnchor === id ? null : id)
  }

  const handleSliderChange = (value: number[]) => {
    if (selectedAnchor) {
      setAnchorPoints((prev) =>
        prev.map((anchor) => (anchor.id === selectedAnchor ? { ...anchor, scale: value[0] } : anchor)),
      )
    }
  }

  const resetModel = () => {
    setAnchorPoints((prev) => prev.map((anchor) => ({ ...anchor, scale: 1 })))
    setSelectedAnchor(null)
  }

  const handleSubmit = () => {
    onUpdate({ customizedModel: anchorPoints })
    onNext()
  }

  const selectedAnchorData = anchorPoints.find((anchor) => anchor.id === selectedAnchor)
  const bodyComposition = userData.bodyComposition

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-6xl">
        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Customize Your 3D Body Model</CardTitle>
            <CardDescription className="text-purple-200">
              Sketch-style {userData.gender === "female" ? "female" : "male"} body model with blue anchor points.
              <br />
              {userData.height}cm, {userData.weight}kg | Body Fat: {bodyComposition?.bodyFat || 15}% | Muscle:{" "}
              {bodyComposition?.muscleMass || 45}kg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Model - Increased height for more space */}
              <div className="lg:col-span-2">
                <div className="h-[500px] mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
                  <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[2, 2, 2]} intensity={0.5} />

                    <SketchHumanModel
                      userData={userData}
                      anchorPoints={anchorPoints}
                      onAnchorClick={handleAnchorClick}
                      selectedAnchor={selectedAnchor}
                    />
                    <OrbitControls
                      enableZoom={true}
                      enablePan={true}
                      enableRotate={true}
                      zoomSpeed={0.6}
                      panSpeed={0.8}
                      rotateSpeed={0.5}
                    />
                  </Canvas>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="space-y-4">
                {/* Body Composition Display */}
                <Card className="bg-slate-700/50 border-purple-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Body Composition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Body Fat:</span>
                      <span className="text-white">{bodyComposition?.bodyFat || 15}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Muscle Mass:</span>
                      <span className="text-white">{bodyComposition?.muscleMass || 45}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Style:</span>
                      <span className="text-white">Sketch Model</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Slider Control */}
                {selectedAnchor && selectedAnchorData && (
                  <Card className="bg-slate-700/50 border-purple-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{selectedAnchorData.label}</CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedAnchor(null)}
                          className="text-purple-200 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-purple-200 mb-2">
                          <span>Size</span>
                          <span>{(selectedAnchorData.scale * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                          value={[selectedAnchorData.scale]}
                          onValueChange={handleSliderChange}
                          min={0.6}
                          max={1.6}
                          step={0.02}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-purple-200 mt-1">
                          <span>60%</span>
                          <span>160%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Instructions */}
                <Card className="bg-slate-700/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-purple-200">
                    <p>• Click blue anchor points to select</p>
                    <p>• Use slider to adjust body proportions</p>
                    <p>• Drag to rotate the model</p>
                    <p>• Scroll to zoom in/out</p>
                    <p>• Right-click + drag to pan</p>
                  </CardContent>
                </Card>

                {/* Current Values */}
                <Card className="bg-slate-700/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Adjustments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {anchorPoints.map((anchor) => (
                      <div key={anchor.id} className="flex justify-between text-sm">
                        <span className="text-purple-200">{anchor.label}</span>
                        <span className={`font-mono ${anchor.scale !== 1 ? "text-orange-400" : "text-white"}`}>
                          {(anchor.scale * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-purple-200 text-sm mb-4">
                Full control 3D model - rotate, zoom, and pan to view from any angle. Click anchor points to customize.
              </p>
              <Button
                onClick={resetModel}
                variant="outline"
                className="border-purple-500/30 text-white hover:bg-purple-600/20 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Adjustments
              </Button>
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
