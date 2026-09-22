import { useEffect, useState } from "react";

import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const [fullName, setFullName] =
    useState("User");

  const [email, setEmail] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

      setFullName(
        profile?.full_name ||
          user.email?.split("@")[0] ||
          "User"
      );

      setEmail(
        profile?.email ||
          user.email ||
          ""
      );
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);

              const { error } =
                await supabase.auth.signOut();

              if (error) {
                throw error;
              }

              // Session is removed here.
              // User must login again.
              router.replace("/login");
            } catch (error) {
              console.error(
                "Logout error:",
                error
              );

              Alert.alert(
                "Logout Failed",
                "Please try again."
              );

              setLoggingOut(false);
            }
          },
        },
      ]
    );
  }

  function getInitial() {
    return fullName
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  return (
    <View
      style={[
        styles.container,
        darkMode && styles.darkContainer,
      ]}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </Pressable>

        <View
          style={styles.headerTitleContainer}
        >
          <Text style={styles.headerSmall}>
            DECCAN
          </Text>

          <Text
            style={[
              styles.headerTitle,
              darkMode &&
                styles.darkText,
            ]}
          >
            Profile
          </Text>
        </View>

        <View style={styles.headerSpace} />

      </View>

      {/* PROFILE CARD */}

      <View
        style={[
          styles.profileCard,
          darkMode &&
            styles.darkCard,
        ]}
      >

        <View style={styles.bigProfileCircle}>
          <Text
            style={styles.bigProfileText}
          >
            {getInitial()}
          </Text>
        </View>

        <Text
          style={[
            styles.fullName,
            darkMode &&
              styles.darkText,
          ]}
        >
          {fullName}
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

      </View>

      {/* SETTINGS */}

      <Text
        style={[
          styles.sectionTitle,
          darkMode &&
            styles.darkText,
        ]}
      >
        Settings
      </Text>

      {/* THEME */}

      <View
        style={[
          styles.settingCard,
          darkMode &&
            styles.darkCard,
        ]}
      >

        <View>
          <Text
            style={[
              styles.settingTitle,
              darkMode &&
                styles.darkText,
            ]}
          >
            Dark Theme
          </Text>

          <Text style={styles.settingSubtitle}>
            Switch between light and dark theme
          </Text>
        </View>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{
            false: "#D8D2C1",
            true: "#C9A44C",
          }}
          thumbColor={
            darkMode
              ? "#FFFFFF"
              : "#0B4F35"
          }
        />

      </View>

      {/* ACCOUNT */}

      <Text
        style={[
          styles.sectionTitle,
          darkMode &&
            styles.darkText,
        ]}
      >
        Account
      </Text>

      <View
        style={[
          styles.settingCard,
          darkMode &&
            styles.darkCard,
        ]}
      >

        <View>
          <Text
            style={[
              styles.settingTitle,
              darkMode &&
                styles.darkText,
            ]}
          >
            Account Status
          </Text>

          <Text style={styles.settingSubtitle}>
            Your Deccan account is active
          </Text>
        </View>

        <Text style={styles.activeText}>
          Active
        </Text>

      </View>

      {/* LOGOUT */}

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={styles.logoutText}>
          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F0DF",
    paddingHorizontal: 20,
  },

  darkContainer: {
    backgroundColor: "#10251D",
  },

  /* HEADER */

  header: {
    height: 105,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  backArrow: {
    fontSize: 30,
    color: "#0B4F35",
    marginTop: -3,
  },

  headerTitleContainer: {
    alignItems: "center",
  },

  headerSmall: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#C9A44C",
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0B4F35",
    marginTop: 2,
  },

  headerSpace: {
    width: 42,
  },

  /* PROFILE */

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 25,
    alignItems: "center",
    marginTop: 12,
  },

  darkCard: {
    backgroundColor: "#19352A",
  },

  bigProfileCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0B4F35",
    justifyContent: "center",
    alignItems: "center",
  },

  bigProfileText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  fullName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B4F35",
    marginTop: 12,
  },

  email: {
    fontSize: 13,
    color: "#777777",
    marginTop: 5,
  },

  /* SECTION */

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B4F35",
    marginTop: 25,
    marginBottom: 10,
  },

  /* SETTINGS */

  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B4F35",
  },

  settingSubtitle: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
  },

  activeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B4F35",
  },

  darkText: {
    color: "#FFFFFF",
  },

  /* LOGOUT */

  logoutButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#9B2C2C",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

});