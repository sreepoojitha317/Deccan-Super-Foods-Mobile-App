import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function SplashScreen() {
  const { width, height } = useWindowDimensions();

  // =====================================================
  // IMAGE ANIMATION
  // =====================================================

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.01)).current;

  // =====================================================
  // LOADING DOTS
  // =====================================================

  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // ---------------------------------------------------
    // IMAGE FADE IN
    // ---------------------------------------------------

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // ---------------------------------------------------
    // DOT ANIMATION
    // ---------------------------------------------------

    const createDotAnimation = (
      dot: Animated.Value,
      delay: number
    ) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),

          Animated.timing(dot, {
            toValue: 0.4,
            duration: 300,
            useNativeDriver: true,
          }),

          Animated.delay(250),
        ])
      ).start();
    };

    createDotAnimation(dot1, 0);
    createDotAnimation(dot2, 150);
    createDotAnimation(dot3, 300);

    // ---------------------------------------------------
    // GO TO LANDING AFTER 3.5 SECONDS
    // ---------------------------------------------------

    const timer = setTimeout(() => {
      router.replace("/landing");
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
      ]}
    >
      {/* =================================================
          STATUS BAR
      ================================================= */}

      <StatusBar
        hidden={true}
      />

      {/* =================================================
          SPLASH IMAGE
          DIRECT FULL SCREEN IMAGE
      ================================================= */}

      <Animated.View
        style={[
          styles.imageLayer,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/deccan-splash.png")}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* =================================================
          LOADING
      ================================================= */}

      <View
        style={[
          styles.loadingContainer,
          {
            bottom: Math.max(28, height * 0.035),
          },
        ]}
      >
        <View style={styles.dotsContainer}>

          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot1,
                transform: [{ scale: dot1 }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot2,
                transform: [{ scale: dot2 }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot3,
                transform: [{ scale: dot3 }],
              },
            ]}
          />

        </View>

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    </View>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ---------------------------------------------------
  // FULL SCREEN
  // ---------------------------------------------------

  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",

    // Fallback only.
    // The PNG covers the complete screen.
    backgroundColor: "#0B4F35",
  },


  // ---------------------------------------------------
  // IMAGE LAYER
  // ---------------------------------------------------

  imageLayer: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    width: "100%",
    height: "100%",

    overflow: "hidden",
  },

  splashImage: {
    position: "absolute",

    top: 0,
    left: 0,

    width: "100%",
    height: "100%",
  },


  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  loadingContainer: {
    position: "absolute",

    left: 0,
    right: 0,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 10,
  },

  dotsContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginBottom: 8,
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#C9A44C",

    // Small shadow so dots remain visible
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 2,
  },

  loadingText: {
    color: "#FFFFFF",

    fontSize: 12,

    letterSpacing: 1.3,

    fontWeight: "500",

    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },
});