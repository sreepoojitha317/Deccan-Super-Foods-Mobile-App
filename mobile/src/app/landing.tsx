import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

export default function LandingScreen() {
  const { width, height } = useWindowDimensions();

  const imageScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(
    new Animated.Value(25)
  ).current;

  useEffect(() => {
    // Food image fade
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Very subtle food image zoom
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageScale, {
          toValue: 1.025,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Content animation
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 700,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 700,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goToRegister = () => {
    router.push("/register");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const isWideScreen = width >= 700;

  const imageHeight = isWideScreen
    ? Math.min(height * 0.42, 420)
    : Math.min(height * 0.34, 330);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            minHeight: height,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ================================================= */}
        {/* FOOD IMAGE */}
        {/* ================================================= */}

        <View
          style={[
            styles.imageContainer,
            {
              height: imageHeight,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity: imageOpacity,
                transform: [
                  {
                    scale: imageScale,
                  },
                ],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/Landing_page.png")}
              style={styles.foodImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Soft cream transition */}
          <View style={styles.imageFade} />
        </View>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [
                {
                  translateY: contentTranslate,
                },
              ],
            },
          ]}
        >
          {/* ================================================= */}
          {/* DECCAN STICKER */}
          {/* ================================================= */}

          <View style={styles.brandContainer}>
            <Image
              source={require("../../assets/images/Deccan_sticker.png")}
              style={styles.deccanSticker}
              resizeMode="contain"
            />
          </View>

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <Text style={styles.title}>
            Taste the Goodness{"\n"}
            of South India
          </Text>

          {/* ================================================= */}
          {/* SUBTITLE */}
          {/* ================================================= */}

          <Text style={styles.subtitle}>
            Fresh  •  Authentic  •  Delicious
          </Text>

          {/* ================================================= */}
          {/* START SHOPPING */}
          {/* ================================================= */}

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={goToRegister}
          >
            <Text style={styles.primaryButtonText}>
              Start Shopping
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

          {/* ================================================= */}
          {/* LOGIN */}
          {/* ================================================= */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.loginButton}
            onPress={goToLogin}
          >
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          </TouchableOpacity>

          {/* ================================================= */}
          {/* DECORATION */}
          {/* ================================================= */}

          <View style={styles.decoration}>
            <View style={styles.line} />

            <View style={styles.decorLeaf}>
              <View style={styles.decorLeafLeft} />
              <View style={styles.decorLeafRight} />
              <View style={styles.decorStem} />
            </View>

            <View style={styles.line} />
          </View>

          {/* ================================================= */}
          {/* TAGLINE */}
          {/* ================================================= */}

          <Text style={styles.tagline}>
            Authentic Foods. Everyday Goodness.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ===================================================== */
  /* MAIN */
  /* ===================================================== */

  safeArea: {
    flex: 1,
    backgroundColor: "#F7F0DF",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#F7F0DF",
  },

  scrollContent: {
    backgroundColor: "#F7F0DF",
    alignItems: "center",
  },

  /* ===================================================== */
  /* FOOD IMAGE */
  /* ===================================================== */

  imageContainer: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E9DFC8",
  },

  imageWrapper: {
    width: "100%",
    height: "100%",
  },

  foodImage: {
    width: "100%",
    height: "100%",
  },

  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 35,
    backgroundColor: "rgba(247,240,223,0.10)",
  },

  /* ===================================================== */
  /* CONTENT */
  /* ===================================================== */

  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 35,
  },

  /* ===================================================== */
  /* DECCAN STICKER */
  /* ===================================================== */

  brandContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  deccanSticker: {
    width: 190,
    height: 100,
  },

  /* ===================================================== */
  /* TITLE */
  /* ===================================================== */

  title: {
    color: "#0B4F35",
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
    maxWidth: 390,
  },

  /* ===================================================== */
  /* SUBTITLE */
  /* ===================================================== */

  subtitle: {
    color: "#46604F",
    fontSize: 13,
    letterSpacing: 0.7,
    marginTop: 11,
    marginBottom: 27,
    textAlign: "center",
  },

  /* ===================================================== */
  /* START SHOPPING */
  /* ===================================================== */

  primaryButton: {
    width: "100%",
    maxWidth: 390,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#0B4F35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#0B4F35",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.20,
    shadowRadius: 9,
    elevation: 5,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  arrow: {
    color: "#C9A44C",
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 10,
    marginTop: -2,
  },

  /* ===================================================== */
  /* LOGIN */
  /* ===================================================== */

  loginButton: {
    width: "100%",
    maxWidth: 390,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#0B4F35",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.30)",
  },

  loginButtonText: {
    color: "#0B4F35",
    fontSize: 15,
    fontWeight: "700",
  },

  /* ===================================================== */
  /* BOTTOM DECORATION */
  /* ===================================================== */

  decoration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
  },

  line: {
    width: 48,
    height: 1,
    backgroundColor: "#C9A44C",
    opacity: 0.70,
  },

  decorLeaf: {
    width: 35,
    height: 25,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  decorLeafLeft: {
    position: "absolute",
    width: 14,
    height: 8,
    backgroundColor: "#0B4F35",
    borderRadius: 10,
    left: 2,
    transform: [
      {
        rotate: "-25deg",
      },
    ],
  },

  decorLeafRight: {
    position: "absolute",
    width: 14,
    height: 8,
    backgroundColor: "#0B4F35",
    borderRadius: 10,
    right: 2,
    transform: [
      {
        rotate: "25deg",
      },
    ],
  },

  decorStem: {
    position: "absolute",
    width: 2,
    height: 14,
    backgroundColor: "#C9A44C",
  },

  /* ===================================================== */
  /* TAGLINE */
  /* ===================================================== */

  tagline: {
    color: "#6D756B",
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: 9,
    marginBottom: 4,
    textAlign: "center",
  },
});