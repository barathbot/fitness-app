"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import type { UserData } from "../types/UserData"

interface DashboardPageProps {
  userData: UserData
  onStartWorkout: () => void
  onViewReports: () => void
  onOpenSettings: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function DashboardPage({
  userData,
  onStartWorkout,
  onViewReports,
  onOpenSettings,
  onUpdate,
}: DashboardPageProps) {
  const [selectedDay, setSelectedDay] = useState(0)

  // Use actual workout plan data from user's selections
  const getWorkoutPlan = () => {
    if (userData.workoutPlan) {
      return userData.workoutPlan
    }

    // Generate dynamic workout based on user's goals and plan
    const goal = userData.specificGoals?.[0] || "muscle"
    const planType = userData.workoutPlan?.id || "beginner-strength"

    const workoutPlans = {
      "beginner-strength": {
        name: "Beginner Strength",
        duration: "4 weeks",
        frequency: "3x/week",
        currentWeek: 1,
        totalWeeks: 4,
        weeklySchedule: [
          {
            day: "Monday",
            workoutName: "Upper Body Strength",
            exercises: ["Push-ups", "Shoulder Press", "Tricep Dips", "Plank"],
            duration: "45 min",
            difficulty: "Beginner",
            completed: false,
            isToday: new Date().getDay() === 1,
          },
          {
            day: "Tuesday",
            workoutName: "Rest Day",
            exercises: ["Light stretching", "Walking"],
            duration: "20 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 2,
          },
          {
            day: "Wednesday",
            workoutName: "Lower Body Power",
            exercises: ["Squats", "Lunges", "Calf Raises", "Glute Bridges"],
            duration: "40 min",
            difficulty: "Beginner",
            completed: false,
            isToday: new Date().getDay() === 3,
          },
          {
            day: "Thursday",
            workoutName: "Rest Day",
            exercises: ["Yoga", "Meditation"],
            duration: "30 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 4,
          },
          {
            day: "Friday",
            workoutName: "Full Body Circuit",
            exercises: ["Burpees", "Mountain Climbers", "Planks", "Jumping Jacks"],
            duration: "35 min",
            difficulty: "Intermediate",
            completed: false,
            isToday: new Date().getDay() === 5,
          },
          {
            day: "Saturday",
            workoutName: "Active Recovery",
            exercises: ["Light cardio", "Stretching"],
            duration: "25 min",
            difficulty: "Recovery",
            completed: false,
            isToday: new Date().getDay() === 6,
          },
          {
            day: "Sunday",
            workoutName: "Rest Day",
            exercises: ["Complete rest"],
            duration: "0 min",
            difficulty: "Rest",
            completed: false,
            isToday: new Date().getDay() === 0,
          },
        ],
      },
    }

    return workoutPlans[planType] || workoutPlans["beginner-strength"]
  }

  const workoutPlan = getWorkoutPlan()

  // Calculate progress - add safety checks
  const completedWorkouts = workoutPlan.weeklySchedule?.filter((day) => day.completed).length || 0
  const totalWorkouts = workoutPlan.weeklySchedule?.filter((day) => day.workoutName !== "Rest Day").length || 1
  const weekProgress = (completedWorkouts / totalWorkouts) * 100

  // Find today's workout with safety check
  const todayWorkout = workoutPlan.weeklySchedule?.find((day) => day.isToday) || null

  // Mock stats
  const stats = {
    totalWorkouts: userData.totalWorkoutsCompleted || 12,
    totalCalories: userData.totalCaloriesBurned || 2840,
    currentStreak: 3,
    weeklyGoal: 4,
    completedThisWeek: completedWorkouts,
  }

  const StatCard = ({ icon, value, label, color = "#a855f7" }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )

  return (
    <LinearGradient colors={["#0f172a", "#581c87", "#0f172a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeTitle}>Welcome back!</Text>
              <Text style={styles.welcomeSubtitle}>Ready for today's workout?</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={onViewReports}>
                <Ionicons name="bar-chart" size={16} color="#c4b5fd" />
                <Text style={styles.headerButtonText}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={onOpenSettings}>
                <Ionicons name="settings" size={16} color="#c4b5fd" />
                <Text style={styles.headerButtonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsGrid}>
            <StatCard icon="pulse" value={stats.totalWorkouts} label="Total Workouts" color="#a855f7" />
            <StatCard icon="flame" value={stats.totalCalories} label="Calories Burned" color="#fb923c" />
            <StatCard icon="trophy" value={stats.currentStreak} label="Day Streak" color="#fbbf24" />
            <StatCard
              icon="target"
              value={`${stats.completedThisWeek}/${stats.weeklyGoal}`}
              label="Weekly Goal"
              color="#10b981"
            />
          </View>

          {/* Today's Workout */}
          <View style={styles.todayWorkoutCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="calendar" size={20} color="white" />
                <Text style={styles.cardTitle}>Today's Workout</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>

            {todayWorkout ? (
              <View style={styles.workoutContent}>
                <View style={styles.workoutHeader}>
                  <View>
                    <Text style={styles.workoutName}>{todayWorkout.workoutName}</Text>
                    <View style={styles.workoutMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time" size={16} color="#c4b5fd" />
                        <Text style={styles.metaText}>{todayWorkout.duration}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="target" size={16} color="#c4b5fd" />
                        <Text style={styles.metaText}>{todayWorkout.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Today</Text>
                  </View>
                </View>

                <View style={styles.exercisesContainer}>
                  <Text style={styles.exercisesTitle}>Exercises</Text>
                  <View style={styles.exercisesList}>
                    {(todayWorkout.exercises || []).map((exercise, index) => (
                      <View key={index} style={styles.exerciseItem}>
                        <Ionicons name="barbell" size={12} color="#c4b5fd" />
                        <Text style={styles.exerciseText}>{exercise}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.startWorkoutButton} onPress={onStartWorkout}>
                  <LinearGradient colors={["#7c3aed", "#fb923c"]} style={styles.startWorkoutGradient}>
                    <Ionicons name="play" size={20} color="white" />
                    <Text style={styles.startWorkoutText}>Start Workout</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.restDayContent}>
                <Ionicons name="trophy" size={64} color="#fbbf24" />
                <Text style={styles.restDayTitle}>Rest Day!</Text>
                <Text style={styles.restDaySubtitle}>Take a well-deserved break today.</Text>
              </View>
            )}
          </View>

          {/* Weekly Schedule */}
          <View style={styles.weeklyScheduleCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Weekly Schedule</Text>
              <Text style={styles.cardSubtitle}>
                Week {workoutPlan.currentWeek} of {workoutPlan.totalWeeks}
              </Text>
            </View>

            <View style={styles.scheduleList}>
              {(workoutPlan.weeklySchedule || []).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.scheduleItem,
                    day.isToday && styles.scheduleItemToday,
                    day.completed && styles.scheduleItemCompleted,
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <View style={styles.scheduleItemContent}>
                    <View style={styles.scheduleItemLeft}>
                      <Text style={styles.scheduleDayText}>{day.day}</Text>
                      <View>
                        <Text style={styles.scheduleWorkoutName}>{day.workoutName}</Text>
                        <Text style={styles.scheduleDuration}>{day.duration}</Text>
                      </View>
                    </View>
                    <View style={styles.scheduleItemRight}>
                      {day.isToday && (
                        <View style={styles.todaySmallBadge}>
                          <Text style={styles.todaySmallBadgeText}>Today</Text>
                        </View>
                      )}
                      {day.completed && (
                        <View style={styles.completedIndicator}>
                          <View style={styles.completedDot} />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Current Plan */}
          <View style={styles.currentPlanCard}>
            <Text style={styles.cardTitle}>Current Plan</Text>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{workoutPlan.name}</Text>
              <Text style={styles.planDetails}>
                {workoutPlan.duration} • {workoutPlan.frequency}
              </Text>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Week Progress</Text>
                <Text style={styles.progressValue}>{Math.round(weekProgress)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${weekProgress}%` }]} />
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Plan Progress</Text>
                <Text style={styles.progressValue}>
                  {workoutPlan.currentWeek}/{workoutPlan.totalWeeks} weeks
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(workoutPlan.currentWeek / workoutPlan.totalWeeks) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: "#c4b5fd",
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderRadius: 8,
  },
  headerButtonText: {
    color: "#c4b5fd",
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  statLabel: {
    color: "#c4b5fd",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  todayWorkoutCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  cardSubtitle: {
    color: "#c4b5fd",
    marginBottom: 20,
  },
  workoutContent: {
    gap: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#c4b5fd",
    fontSize: 14,
  },
  todayBadge: {
    backgroundColor: "rgba(124, 58, 237, 1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  todayBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  exercisesContainer: {
    backgroundColor: "rgba(51, 65, 85, 0.3)",
    borderRadius: 12,
    padding: 16,
  },
  exercisesTitle: {
    color: "white",
    fontWeight: "600",
    marginBottom: 12,
  },
  exercisesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "48%",
  },
  exerciseText: {
    color: "#c4b5fd",
    fontSize: 14,
    flex: 1,
  },
  startWorkoutButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  startWorkoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  startWorkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  restDayContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  restDayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  restDaySubtitle: {
    color: "#c4b5fd",
    textAlign: "center",
  },
  weeklyScheduleCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  scheduleList: {
    gap: 12,
    marginTop: 16,
  },
  scheduleItem: {
    backgroundColor: "rgba(51, 65, 85, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    borderRadius: 12,
    padding: 12,
  },
  scheduleItemToday: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  scheduleItemCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  scheduleItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  scheduleDayText: {
    color: "#c4b5fd",
    fontSize: 14,
    fontWeight: "500",
    width: 64,
  },
  scheduleWorkoutName: {
    color: "white",
    fontWeight: "600",
    marginBottom: 2,
  },
  scheduleDuration: {
    color: "#c4b5fd",
    fontSize: 12,
  },
  scheduleItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  todaySmallBadge: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todaySmallBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  completedIndicator: {
    width: 24,
    height: 24,
    backgroundColor: "#10b981",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  completedDot: {
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
  },
  currentPlanCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    borderRadius: 12,
    margin: 16,
    padding: 20,
    marginBottom: 32,
  },
  planInfo: {
    marginTop: 16,
    marginBottom: 20,
  },
  planName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planDetails: {
    color: "#c4b5fd",
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#c4b5fd",
    fontSize: 14,
  },
  progressValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 4,
  },
})
