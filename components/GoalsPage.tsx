"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import type { UserData } from "../types/UserData"

interface GoalsPageProps {
  userData: UserData
  onNext: () => void
  onBack: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function GoalsPage({ userData, onNext, onBack, onUpdate }: GoalsPageProps) {
  const [selectedGoal, setSelectedGoal] = useState(userData.primaryGoal || "")

  const goals = [
    {
      id: "lose-weight",
      title: "Lose Weight",
      description: "Burn fat and achieve a leaner physique",
      icon: "trending-down",
      colors: ["#ef4444", "#fb923c"],
    },
    {
      id: "maintain",
      title: "Maintain Physique",
      description: "Keep your current body composition",
      icon: "remove",
      colors: ["#3b82f6", "#7c3aed"],
    },
    {
      id: "gain-weight",
      title: "Gain Weight",
      description: "Build muscle mass and increase strength",
      icon: "trending-up",
      colors: ["#10b981", "#059669"],
    },
  ]

  const handleSubmit = () => {
    if (selectedGoal) {
      onUpdate({ primaryGoal: selectedGoal as "lose-weight" | "maintain" | "gain-weight" })
      onNext()
    }
  }

  return (
    <LinearGradient colors={["#0f172a", "#581c87", "#0f172a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Ionicons name="target" size={48} color="#fb923c" />
              <Text style={styles.title}>What's your primary goal?</Text>
              <Text style={styles.subtitle}>Choose your main fitness objective to get started</Text>
            </View>

            <View style={styles.goalsList}>
              {goals.map((goal) => (
                <TouchableOpacity key={goal.id} style={styles.goalCard} onPress={() => setSelectedGoal(goal.id)}>
                  {selectedGoal === goal.id ? (
                    <LinearGradient colors={goal.colors} style={styles.goalCardGradient}>
                      <View style={styles.goalContent}>
                        <Ionicons name={goal.icon as any} size={32} color="white" />
                        <View style={styles.goalText}>
                          <Text style={styles.goalTitle}>{goal.title}</Text>
                          <Text style={styles.goalDescription}>{goal.description}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.goalCardDefault}>
                      <View style={styles.goalContent}>
                        <Ionicons name={goal.icon as any} size={32} color="white" />
                        <View style={styles.goalText}>
                          <Text style={styles.goalTitle}>{goal.title}</Text>
                          <Text style={styles.goalDescription}>{goal.description}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <View style={styles.backButtonContent}>
                  <Ionicons name="arrow-back" size={16} color="white" />
                  <Text style={styles.backButtonText}>Back</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.continueButton, !selectedGoal && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={!selectedGoal}
              >
                <LinearGradient colors={["#7c3aed", "#fb923c"]} style={styles.continueButtonGradient}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#c4b5fd",
    textAlign: "center",
    lineHeight: 20,
  },
  goalsList: {
    gap: 16,
    marginBottom: 24,
  },
  goalCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  goalCardGradient: {
    padding: 16,
  },
  goalCardDefault: {
    backgroundColor: "rgba(51, 65, 85, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
    padding: 16,
    borderRadius: 12,
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  goalDescription: {
    color: "#c4b5fd",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderRadius: 8,
    padding: 16,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "500",
  },
  continueButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
