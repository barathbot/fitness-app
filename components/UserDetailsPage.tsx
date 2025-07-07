"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import type { UserData } from "../types/UserData"

interface UserDetailsPageProps {
  userData: UserData
  onNext: () => void
  onUpdate: (data: Partial<UserData>) => void
}

export function UserDetailsPage({ userData, onNext, onUpdate }: UserDetailsPageProps) {
  const [height, setHeight] = useState(userData.height?.toString() || "")
  const [weight, setWeight] = useState(userData.weight?.toString() || "")
  const [gender, setGender] = useState(userData.gender || "")

  const handleSubmit = () => {
    onUpdate({
      height: Number.parseFloat(height),
      weight: Number.parseFloat(weight),
      gender: gender as "male" | "female" | "other",
    })
    onNext()
  }

  return (
    <LinearGradient colors={["#0f172a", "#581c87", "#0f172a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Ionicons name="person" size={48} color="#fb923c" />
              <Text style={styles.title}>Tell us about yourself</Text>
              <Text style={styles.subtitle}>We need some basic information to personalize your experience</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Ionicons name="resize" size={16} color="#a855f7" />
                  <Text style={styles.label}>Height (cm)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="170"
                  placeholderTextColor="#a855f7"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Ionicons name="barbell" size={16} color="#a855f7" />
                  <Text style={styles.label}>Weight (kg)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  placeholderTextColor="#a855f7"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={setGender}
                    style={styles.picker}
                    dropdownIconColor="white"
                  >
                    <Picker.Item label="Select your gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <LinearGradient colors={["#7c3aed", "#fb923c"]} style={styles.submitButtonGradient}>
                  <Text style={styles.submitButtonText}>Continue</Text>
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
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "white",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderRadius: 8,
  },
  picker: {
    color: "white",
    height: 50,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
