import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert(
        "Missing Details",
        "Please enter your email and password."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        throw error;
      }

      router.replace("/home");
    } catch (error: any) {
      console.log("Login error:", error);

      Alert.alert(
        "Login Failed",
        error?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* DECCAN STICKER */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Deccan_sticker.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* HEADING */}
        <Text style={styles.title}>
          Welcome Back!
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue your journey with{"\n"}
          healthy & authentic foods
        </Text>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#8A8A8A"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#8A8A8A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          )}
        </TouchableOpacity>

        {/* REGISTER LINK */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM TAGLINE */}
        <Text style={styles.bottomText}>
          Fresh • Authentic • Delicious
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F0DF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  logo: {
    width: 145,
    height: 105,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0B4F35",
    textAlign: "center",
    marginTop: 4,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6D6A60",
    textAlign: "center",
    marginTop: 9,
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B4F35",
    marginBottom: 8,
  },

  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 17,
    fontSize: 15,
    color: "#222222",
    borderWidth: 1,
    borderColor: "#E3DCC9",
  },

  loginButton: {
    height: 56,
    backgroundColor: "#0B4F35",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,

    shadowColor: "#0B4F35",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  registerText: {
    fontSize: 14,
    color: "#6D6A60",
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B4F35",
    marginLeft: 6,
  },

  bottomText: {
    textAlign: "center",
    color: "#C9A44C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 28,
    letterSpacing: 0.5,
  },
});