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

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!cleanName || !cleanEmail || !cleanMobile || !password) {
      Alert.alert(
        "Missing Details",
        "Please fill in all the fields."
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

    if (!/^\d{10}$/.test(cleanMobile)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------
      // 1. Create user in Supabase Authentication
      // -----------------------------------------

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "Account could not be created. Please try again."
        );
      }

      // -----------------------------------------
      // 2. Store profile information
      // -----------------------------------------

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            full_name: cleanName,
            phone: cleanMobile,
            email: cleanEmail,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.log(
          "Profile creation error:",
          profileError
        );

        throw new Error(
          "Account was created, but your profile could not be saved. Please try again."
        );
      }

      // -----------------------------------------
      // 3. Success
      // -----------------------------------------

      Alert.alert(
        "Account Created",
        "Welcome to Deccan Super Foods!",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/home"),
          },
        ]
      );
    } catch (error: any) {
      console.log("Registration error:", error);

      Alert.alert(
        "Registration Failed",
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ======================================
            DECCAN SUPER FOODS STICKER
        ====================================== */}

        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Deccan_sticker.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ======================================
            HEADING
        ====================================== */}

        <Text style={styles.title}>
          Create Your Account
        </Text>

        <Text style={styles.tagline}>
          Join us for a healthier{"\n"}
          and tastier tomorrow
        </Text>

        {/* ======================================
            FULL NAME
        ====================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#8A8A8A"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* ======================================
            EMAIL
        ====================================== */}

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

        {/* ======================================
            MOBILE NUMBER
        ====================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Mobile Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            placeholderTextColor="#8A8A8A"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* ======================================
            PASSWORD
        ====================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#8A8A8A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* ======================================
            CREATE ACCOUNT BUTTON
        ====================================== */}

        <TouchableOpacity
          style={[
            styles.createButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* ======================================
            LOGIN LINK
        ====================================== */}

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            FOOTER
        ====================================== */}

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
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 40,
  },

  // ------------------------------------------
  // Logo
  // ------------------------------------------

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  logo: {
    width: 145,
    height: 105,
  },

  // ------------------------------------------
  // Heading
  // ------------------------------------------

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0B4F35",
    textAlign: "center",
    marginTop: 4,
  },

  tagline: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6D6A60",
    textAlign: "center",
    marginTop: 9,
    marginBottom: 30,
  },

  // ------------------------------------------
  // Inputs
  // ------------------------------------------

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

  // ------------------------------------------
  // Create Account Button
  // ------------------------------------------

  createButton: {
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

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // ------------------------------------------
  // Login
  // ------------------------------------------

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    fontSize: 14,
    color: "#6D6A60",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B4F35",
    marginLeft: 6,
  },

  // ------------------------------------------
  // Footer
  // ------------------------------------------

  bottomText: {
    textAlign: "center",
    color: "#C9A44C",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 28,
    letterSpacing: 0.5,
  },
});