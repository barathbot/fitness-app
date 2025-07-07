export interface UserData {
  // Personal Info
  height?: number
  weight?: number
  gender?: "male" | "female" | "other"

  // Goals
  primaryGoal?: "lose-weight" | "maintain" | "gain-weight"
  specificGoals?: string[]

  // Body Composition
  bodyComposition?: {
    bodyFat?: number
    muscleMass?: number
    visceralFat?: number
    bmr?: number
  }

  // Workout Plan
  workoutPlan?: {
    id?: string
    name?: string
    duration?: string
    frequency?: string
    currentWeek?: number
    totalWeeks?: number
    weeklySchedule?: Array<{
      day: string
      workoutName: string
      exercises: string[]
      duration: string
      difficulty: string
      completed: boolean
      isToday?: boolean
    }>
    selectedAt?: string
  }

  // Current Exercise
  currentExercise?: {
    id: string
    name: string
    sets: number
    reps: string
    duration: string
    restTime: string
    difficulty: string
    targetMuscles: string[]
    calories: number
    description: string
    benefits: string
  }

  // Progress Tracking
  totalWorkoutsCompleted?: number
  totalCaloriesBurned?: number
  lastWorkoutDate?: string
  workoutReports?: Array<{
    id: string
    date: string
    workoutName: string
    duration: string
    caloriesBurned: number
    exercisesCompleted: number
    totalExercises: number
    completionRate: number
    type: string
  }>

  // Daily Progress
  dailyProgress?: {
    date: string
    completedExercises: number
    totalExercises: number
    estimatedCalories: string
    duration: string
  }

  // Customization
  customizedModel?: Array<{
    id: string
    position: [number, number, number]
    label: string
    scale: number
  }>

  // App Settings
  appSettings?: {
    notifications?: boolean
    workoutReminders?: boolean
    progressUpdates?: boolean
    restTimerSound?: boolean
    autoNextExercise?: boolean
    defaultRestTime?: number[]
    workoutIntensity?: number[]
    hapticFeedback?: boolean
    autoSync?: boolean
    weightUnit?: string
    distanceUnit?: string
  }
}
