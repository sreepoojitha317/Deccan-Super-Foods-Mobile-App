import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { getProducts } from "@/services/api";
import { supabase } from "@/lib/supabase";
import { useCart, Product } from "../context/CartContext";

const categories = [
  "All",
  "Biscuits",
  "Breads",
  "Fresh Mints",
  "Cakes",
  "Healthy Foods",
];

type UserProfile = {
  full_name: string;
  email: string;
};

/* =========================
   PRODUCT LOCAL IMAGES
========================= */

const productImages: Record<number, any> = {
  1: require("../../assets/images/Ragi_millet_biscuits.png"),
  2: require("../../assets/images/Butter_coconut_biscuits.png"),
  3: require("../../assets/images/Jaggery_oats_biscuits.png"),
  4: require("../../assets/images/Elaichi_milk_biscuits.png"),
  5: require("../../assets/images/Multigrain_health_biscuits.png"),

  6: require("../../assets/images/Classic_milk_bread.png"),
  7: require("../../assets/images/Whole_wheat_bread.png"),
  8: require("../../assets/images/Multigrain_bread.png"),
  9: require("../../assets/images/Coconut_bun.png"),
  10: require("../../assets/images/Masala_bread.png"),

  11: require("../../assets/images/Classic_mint_drops.png"),
  12: require("../../assets/images/Pudina_fresh_candy.png"),
  13: require("../../assets/images/Lemon_mint_candy.png"),
  14: require("../../assets/images/Ginger_mint_candy.png"),
  15: require("../../assets/images/Tulsi_mint_drops.png"),

  16: require("../../assets/images/Classic_chocolate_cake.png"),
  17: require("../../assets/images/Vanilla_celebration_cake.png"),
  18: require("../../assets/images/Mango_cream_cake.png"),
  19: require("../../assets/images/Coconut_cake.png"),
  20: require("../../assets/images/Dry_fruit_cake.png"),

  21: require("../../assets/images/Ragi_health_mix.png"),
  22: require("../../assets/images/Millet_breakfast_mix.png"),
  23: require("../../assets/images/Andhra_peanut_chutney_powder.png"),
  24: require("../../assets/images/Kerala_banana_chips.png"),
  25: require("../../assets/images/Telangana_jowar_mix.png"),
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [userLoading, setUserLoading] =
    useState(true);

  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    loadProducts();
    loadUserProfile();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();

      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfile() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

      if (profileError) {
        console.error(
          "Profile loading error:",
          profileError
        );

        const fallbackName =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User";

        setUserProfile({
          full_name: fallbackName,
          email: user.email || "",
        });

        return;
      }

      setUserProfile({
        full_name:
          profile?.full_name ||
          user.email?.split("@")[0] ||
          "User",

        email:
          profile?.email ||
          user.email ||
          "",
      });
    } catch (err) {
      console.error("User profile error:", err);
    } finally {
      setUserLoading(false);
    }
  }

  function getFirstName() {
    if (!userProfile?.full_name) {
      return "User";
    }

    return userProfile.full_name
      .trim()
      .split(" ")[0];
  }

  function getUserInitial() {
    const firstName = getFirstName();

    return firstName.charAt(0).toUpperCase();
  }

  function handleSearch(text: string) {
    setSearch(text);

    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(text.toLowerCase());

      if (selectedCategory === "All") {
        return matchesSearch;
      }

      const categoryMap: Record<string, number> = {
        Biscuits: 1,
        Breads: 2,
        "Fresh Mints": 3,
        Cakes: 4,
        "Healthy Foods": 5,
      };

      return (
        product.category_id ===
          categoryMap[selectedCategory] &&
        matchesSearch
      );
    });

    setFilteredProducts(result);
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);

    const categoryMap: Record<string, number> = {
      Biscuits: 1,
      Breads: 2,
      "Fresh Mints": 3,
      Cakes: 4,
      "Healthy Foods": 5,
    };

    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (category === "All") {
        return matchesSearch;
      }

      return (
        product.category_id === categoryMap[category] &&
        matchesSearch
      );
    });

    setFilteredProducts(result);
  }

  function handleAddToCart(product: Product) {
    addToCart(product);
  }

  if (loading || userLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#0B4F35"
        />

        <Text style={styles.message}>
          Loading fresh foods...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) =>
          String(item.id)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* HEADER */}

            <View style={styles.header}>
              <View>
                <Text style={styles.smallText}>
                  {getFirstName().toUpperCase()}
                </Text>

                <Text style={styles.welcomeText}>
                  Welcome to
                </Text>

                <Text style={styles.logoText}>
                  Deccan Super Foods
                </Text>
              </View>

              <View style={styles.headerActions}>

                {/* CART BUTTON */}

                <Pressable
                  style={styles.cartButton}
                  onPress={() =>
                    router.push("/cart")
                  }
                >
                  <Text style={styles.cartIcon}>
                    🛒
                  </Text>

                  {cartCount > 0 && (
                    <View
                      style={styles.cartBadge}
                    >
                      <Text
                        style={
                          styles.cartBadgeText
                        }
                      >
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* PROFILE */}

                <Pressable
                  style={styles.profileCircle}
                  onPress={() =>
                    router.push("/profile")
                  }
                >
                  <Text
                    style={styles.profileText}
                  >
                    {getUserInitial()}
                  </Text>
                </Pressable>

              </View>
            </View>

            {/* HOME IMAGE */}

            <View
              style={styles.homeImageContainer}
            >
              <Image
                source={require("../../assets/images/Deccan_home.png")}
                style={styles.homeImage}
                resizeMode="contain"
              />
            </View>

            {/* SEARCH */}

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>
                ⌕
              </Text>

              <TextInput
                value={search}
                onChangeText={handleSearch}
                placeholder="Search for your favourite food..."
                placeholderTextColor="#8B8B8B"
                style={styles.searchInput}
              />
            </View>

            {/* CATEGORIES HEADER */}

            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                Categories
              </Text>

              <Pressable
                onPress={() =>
                  router.push("/categories")
                }
                hitSlop={10}
              >
                <Text style={styles.viewAll}>
                  View all
                </Text>
              </Pressable>
            </View>

            {/* CATEGORY CHIPS */}

            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.categoryList
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    handleCategorySelect(item)
                  }
                  style={[
                    styles.categoryButton,
                    selectedCategory === item &&
                      styles.categoryButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />

            {/* POPULAR PICKS */}

            <View
              style={styles.sectionHeader}
            >
              <View>
                <Text
                  style={styles.sectionTitle}
                >
                  Popular Picks
                </Text>

                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Fresh flavours, made with care
                </Text>
              </View>

              <Text
                style={styles.productCount}
              >
                {filteredProducts.length} items
              </Text>
            </View>
          </>
        }

        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(
                `/product/${item.id}`
              )
            }
          >

            {/* PRODUCT IMAGE */}

            <Image
              source={
                productImages[item.id]
              }
              style={styles.productImage}
              resizeMode="cover"
            />

            <View style={styles.productInfo}>

              <Text
                style={styles.productName}
                numberOfLines={2}
              >
                {item.name}
              </Text>

              <Text style={styles.weight}>
                {item.weight}
              </Text>

              <View
                style={styles.bottomRow}
              >
                <Text style={styles.price}>
                  ₹{item.price}
                </Text>

                {/* ADD TO CART */}

                <Pressable
                  style={styles.addButton}
                  onPress={() =>
                    handleAddToCart(item)
                  }
                >
                  <Text
                    style={
                      styles.addButtonText
                    }
                  >
                    +
                  </Text>
                </Pressable>
              </View>

            </View>

          </Pressable>
        )}

        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F0DF",
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F0DF",
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    color: "#0B4F35",
  },

  error: {
    fontSize: 16,
    color: "#B3261E",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  smallText: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#C9A44C",
    fontWeight: "800",
  },

  welcomeText: {
    marginTop: 5,
    fontSize: 13,
    color: "#777777",
    fontWeight: "600",
  },

  logoText: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: "800",
    color: "#0B4F35",
  },

  /* CART */

  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: "relative",
  },

  cartIcon: {
    fontSize: 21,
  },

  cartBadge: {
    position: "absolute",
    right: -2,
    top: -4,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#C9A44C",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  /* PROFILE */

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0B4F35",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  profileText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 17,
  },

  /* HOME IMAGE */

  homeImageContainer: {
    width: "100%",
    aspectRatio: 1994 / 789,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#F7F0DF",
  },

  homeImage: {
    width: "100%",
    height: "100%",
  },

  /* SEARCH */

  searchBox: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 26,
  },

  searchIcon: {
    fontSize: 24,
    color: "#0B4F35",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B4F35",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#777777",
    marginTop: 3,
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C9A44C",
  },

  /* CATEGORIES */

  categoryList: {
    paddingBottom: 26,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },

  categoryButtonActive: {
    backgroundColor: "#0B4F35",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555555",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  productCount: {
    fontSize: 12,
    color: "#777777",
  },

  /* PRODUCT GRID */

  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: 145,
    backgroundColor: "#EDE8D9",
  },

  imagePlaceholder: {
    width: "100%",
    height: 145,
    backgroundColor: "#E8E0C9",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B4F35",
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B4F35",
    minHeight: 38,
  },

  weight: {
    fontSize: 11,
    color: "#888888",
    marginTop: 3,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B4F35",
  },

  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C9A44C",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    fontSize: 22,
    lineHeight: 25,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});