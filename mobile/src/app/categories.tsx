import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { router } from "expo-router";

type Category = {
  id: number;
  name: string;
  image: any;
};

const categoryData: Category[] = [
  {
    id: 1,
    name: "Biscuits",
    image: require("../../assets/images/biscuits.png"),
  },
  {
    id: 2,
    name: "Breads",
    image: require("../../assets/images/bread.png"),
  },
  {
    id: 3,
    name: "Fresh Mints",
    image: require("../../assets/images/fresh_mints.png"),
  },
  {
    id: 4,
    name: "Cakes",
    image: require("../../assets/images/cakes.png"),
  },
  {
    id: 5,
    name: "Healthy Foods",
    image: require("../../assets/images/healthy_foods.png"),
  },
];

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();

  /*
    16:9 image ratio
    Card horizontal margin = 18 * 2
  */
  const imageWidth = width - 36;
  const imageHeight = imageWidth * (9 / 16);

  return (
    <View style={styles.container}>

      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>

        <Pressable
          style={styles.headerLeft}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerTitleContainer}>

          <Text style={styles.headerSmall}>
            DECCAN
          </Text>

          <Text style={styles.headerTitle}>
            Categories
          </Text>

        </View>

        <View style={styles.headerSpace} />

      </View>

      {/* =========================
          INTRO
      ========================= */}

      <View style={styles.intro}>

        <Text style={styles.introTitle}>
          Explore Our Foods
        </Text>

        <Text style={styles.introText}>
          Discover authentic flavours and wholesome
          foods from across South India.
        </Text>

      </View>

      {/* =========================
          CATEGORY LIST
      ========================= */}

      <FlatList
        data={categoryData}
        keyExtractor={(item) =>
          String(item.id)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}

        renderItem={({ item }) => (
          <Pressable
            style={styles.categoryCard}
            onPress={() => {
              // Category navigation can be added later
              // based on category id.
            }}
          >

            {/* =========================
                CATEGORY IMAGE
            ========================= */}

            <Image
              source={item.image}
              style={[
                styles.categoryImage,
                {
                  width: imageWidth,
                  height: imageHeight,
                },
              ]}
              resizeMode="cover"
            />

            {/* =========================
                CATEGORY NAME
            ========================= */}

            <View style={styles.cardBottom}>

              <Text
                style={styles.categoryName}
              >
                {item.name}
              </Text>

              <Text
                style={styles.exploreText}
              >
                Explore products →
              </Text>

            </View>

          </Pressable>
        )}
      />

    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F0DF",
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    height: 105,
    paddingHorizontal: 20,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
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

  /* =========================
     INTRO
  ========================= */

  intro: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 20,
  },

  introTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0B4F35",
  },

  introText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    marginTop: 7,
    maxWidth: 330,
  },

  /* =========================
     LIST
  ========================= */

  list: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  /* =========================
     CATEGORY CARD
  ========================= */

  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  /* =========================
     CATEGORY IMAGE
  ========================= */

  categoryImage: {
    backgroundColor: "#E8E0C9",
  },

  /* =========================
     CATEGORY NAME
  ========================= */

  cardBottom: {
    minHeight: 76,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
  },

  categoryName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0B4F35",
  },

  exploreText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C9A44C",
    marginTop: 4,
  },

});