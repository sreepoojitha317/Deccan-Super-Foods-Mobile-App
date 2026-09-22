import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { getProducts } from "@/services/api";

import {
  useCart,
  Product,
} from "../../context/CartContext";

/* =========================
   CATEGORY NAMES
========================= */

const categoryNames: {
  [key: number]: string;
} = {
  1: "Biscuits",
  2: "Breads",
  3: "Fresh Mints",
  4: "Cakes",
  5: "Healthy Foods",
};

/* =========================
   PRODUCT LOCAL IMAGES
========================= */

const productImages: Record<number, any> = {
  1: require("../../../assets/images/Ragi_millet_biscuits.png"),
  2: require("../../../assets/images/Butter_coconut_biscuits.png"),
  3: require("../../../assets/images/Jaggery_oats_biscuits.png"),
  4: require("../../../assets/images/Elaichi_milk_biscuits.png"),
  5: require("../../../assets/images/Multigrain_health_biscuits.png"),

  6: require("../../../assets/images/Classic_milk_bread.png"),
  7: require("../../../assets/images/Whole_wheat_bread.png"),
  8: require("../../../assets/images/Multigrain_bread.png"),
  9: require("../../../assets/images/Coconut_bun.png"),
  10: require("../../../assets/images/Masala_bread.png"),

  11: require("../../../assets/images/Classic_mint_drops.png"),
  12: require("../../../assets/images/Pudina_fresh_candy.png"),
  13: require("../../../assets/images/Lemon_mint_candy.png"),
  14: require("../../../assets/images/Ginger_mint_candy.png"),
  15: require("../../../assets/images/Tulsi_mint_drops.png"),

  16: require("../../../assets/images/Classic_chocolate_cake.png"),
  17: require("../../../assets/images/Vanilla_celebration_cake.png"),
  18: require("../../../assets/images/Mango_cream_cake.png"),
  19: require("../../../assets/images/Coconut_cake.png"),
  20: require("../../../assets/images/Dry_fruit_cake.png"),

  21: require("../../../assets/images/Ragi_health_mix.png"),
  22: require("../../../assets/images/Millet_breakfast_mix.png"),
  23: require("../../../assets/images/Andhra_peanut_chutney_powder.png"),
  24: require("../../../assets/images/Kerala_banana_chips.png"),
  25: require("../../../assets/images/Telangana_jowar_mix.png"),
};

/* =========================
   PRODUCT DETAILS
========================= */

export default function ProductDetailsScreen() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [added, setAdded] =
    useState(false);

  const { addToCart } = useCart();

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      const products =
        await getProducts();

      const selectedProduct =
        products.find(
          (item: Product) =>
            item.id === Number(id)
        );

      setProduct(
        selectedProduct || null
      );
    } catch (error) {
      console.error(
        "Product loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     ADD TO CART
  ========================= */

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addToCart(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 3000);
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#0B4F35"
        />

        <Text
          style={styles.loadingText}
        >
          Loading product...
        </Text>
      </View>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!product) {
    return (
      <View style={styles.center}>
        <Text
          style={styles.notFound}
        >
          Product not found
        </Text>

        <Pressable
          style={
            styles.backHomeButton
          }
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.backHomeText
            }
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <View style={styles.container}>

      {/* =========================
          ADD TO CART POPUP
      ========================= */}

      {added && (
        <View
          style={styles.cartPopup}
        >
          <View
            style={styles.popupContent}
          >

            <View
              style={
                styles.successCircle
              }
            >
              <Text
                style={
                  styles.successIcon
                }
              >
                ✓
              </Text>
            </View>

            <View
              style={
                styles.popupTextContainer
              }
            >
              <Text
                style={styles.popupTitle}
              >
                Added to Cart
              </Text>

              <Text
                style={
                  styles.popupProduct
                }
                numberOfLines={1}
              >
                {product.name}
              </Text>
            </View>

            <Pressable
              style={
                styles.viewCartButton
              }
              onPress={() =>
                router.push("/cart")
              }
            >
              <Text
                style={
                  styles.viewCartText
                }
              >
                View Cart
              </Text>
            </Pressable>

          </View>
        </View>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.backArrow}
          >
            ‹
          </Text>
        </Pressable>

        <Text
          style={styles.headerTitle}
        >
          Product Details
        </Text>

        <View
          style={styles.headerSpace}
        />

      </View>

      {/* =========================
          CONTENT
      ========================= */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* =========================
            PRODUCT IMAGE
        ========================= */}

        <View
          style={
            styles.productImageContainer
          }
        >
          <Image
            source={
              productImages[
                product.id
              ]
            }
            style={
              styles.productImage
            }
            resizeMode="cover"
          />
        </View>

        {/* =========================
            BASIC INFO
        ========================= */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.productName}
          >
            {product.name}
          </Text>

          <View
            style={styles.metaRow}
          >

            <Text
              style={styles.weight}
            >
              {product.weight}
            </Text>

            <Text
              style={styles.rating}
            >
              ★ {product.rating}
            </Text>

            <Text
              style={styles.state}
            >
              {product.state}
            </Text>

          </View>

          <Text
            style={styles.price}
          >
            ₹{product.price}
          </Text>

          {/* HEALTHY BADGE */}

          {product.is_healthy && (
            <View
              style={
                styles.healthyBadge
              }
            >
              <Text
                style={
                  styles.healthyText
                }
              >
                ✓ Healthy Choice
              </Text>
            </View>
          )}

        </View>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            About this product
          </Text>

          <Text
            style={styles.description}
          >
            {product.description ||
              "No description available."}
          </Text>

        </View>

        {/* =========================
            INGREDIENTS
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Ingredients
          </Text>

          <Text
            style={styles.detailText}
          >
            {product.ingredients ||
              "Ingredients information not available."}
          </Text>

        </View>

        {/* =========================
            ALLERGENS
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Allergens
          </Text>

          <View
            style={styles.allergenBox}
          >

            <Text
              style={
                styles.allergenText
              }
            >
              {product.allergens ||
                "No allergen information available."}
            </Text>

          </View>

        </View>

        {/* =========================
            NUTRITION
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Nutrition Information
          </Text>

          <Text
            style={styles.detailText}
          >
            {product.nutrition ||
              "Nutrition information not available."}
          </Text>

        </View>

        {/* =========================
            STORAGE
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Storage Instructions
          </Text>

          <Text
            style={styles.detailText}
          >
            {product.storage ||
              "Storage information not available."}
          </Text>

        </View>

        {/* =========================
            PRODUCT INFORMATION
        ========================= */}

        <View
          style={styles.detailCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Product Information
          </Text>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Category
            </Text>

            <Text
              style={styles.infoValue}
            >
              {categoryNames[
                product.category_id
              ] ||
                "Food"}
            </Text>
          </View>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Weight
            </Text>

            <Text
              style={styles.infoValue}
            >
              {product.weight}
            </Text>
          </View>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Origin
            </Text>

            <Text
              style={styles.infoValue}
            >
              {product.state}
            </Text>
          </View>

          <View
            style={styles.infoRow}
          >
            <Text
              style={styles.infoLabel}
            >
              Availability
            </Text>

            <Text
              style={styles.infoValue}
            >
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </Text>
          </View>

        </View>

        <View
          style={{ height: 120 }}
        />

      </ScrollView>

      {/* =========================
          BOTTOM CART BAR
      ========================= */}

      <View
        style={styles.bottomBar}
      >

        <View>

          <Text
            style={styles.bottomLabel}
          >
            Price
          </Text>

          <Text
            style={styles.bottomPrice}
          >
            ₹{product.price}
          </Text>

        </View>

        <Pressable
          style={[
            styles.addToCartButton,
            product.stock <= 0 &&
              styles.disabledButton,
          ]}
          disabled={
            product.stock <= 0
          }
          onPress={
            handleAddToCart
          }
        >

          <Text
            style={
              styles.addToCartText
            }
          >
            {product.stock <= 0
              ? "Out of Stock"
              : added
              ? "✓ Added to Cart"
              : "Add to Cart"}
          </Text>

        </Pressable>

      </View>

    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#F7F0DF",
    },

    center: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#F7F0DF",
    },

    loadingText: {
      marginTop: 12,
      color: "#0B4F35",
      fontSize: 14,
    },

    notFound: {
      fontSize: 18,
      fontWeight: "700",
      color: "#0B4F35",
    },

    backHomeButton: {
      marginTop: 20,
      backgroundColor:
        "#0B4F35",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 14,
    },

    backHomeText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    /* CART POPUP */

    cartPopup: {
      position: "absolute",
      top: 50,
      left: 15,
      right: 15,
      zIndex: 100,
      elevation: 10,
    },

    popupContent: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 13,
      flexDirection: "row",
      alignItems: "center",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,

      elevation: 10,
    },

    successCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "#E6F2E8",
      justifyContent: "center",
      alignItems: "center",
    },

    successIcon: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0B4F35",
    },

    popupTextContainer: {
      flex: 1,
      marginLeft: 10,
      marginRight: 8,
    },

    popupTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#0B4F35",
    },

    popupProduct: {
      fontSize: 11,
      color: "#777777",
      marginTop: 2,
    },

    viewCartButton: {
      backgroundColor: "#0B4F35",
      paddingHorizontal: 13,
      paddingVertical: 9,
      borderRadius: 11,
    },

    viewCartText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "800",
    },

    /* HEADER */

    header: {
      height: 105,
      paddingHorizontal: 20,
      paddingTop: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        "#FFFFFF",
      justifyContent:
        "center",
      alignItems: "center",
    },

    backArrow: {
      fontSize: 30,
      color: "#0B4F35",
      marginTop: -3,
    },

    headerTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: "#0B4F35",
    },

    headerSpace: {
      width: 42,
    },

    /* CONTENT */

    scrollContent: {
      paddingHorizontal: 18,
    },

    productImageContainer: {
      width: "100%",
      height: 290,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor:
        "#E8E0C9",
    },

    productImage: {
      width: "100%",
      height: "100%",
    },

    /* BASIC INFO */

    infoCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 22,
      padding: 20,
      marginTop: 18,
    },

    productName: {
      fontSize: 25,
      lineHeight: 31,
      fontWeight: "800",
      color: "#0B4F35",
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 10,
    },

    weight: {
      fontSize: 13,
      color: "#777777",
    },

    rating: {
      marginLeft: 14,
      fontSize: 13,
      fontWeight: "700",
      color: "#C9A44C",
    },

    state: {
      marginLeft: 14,
      fontSize: 13,
      fontWeight: "600",
      color: "#0B4F35",
    },

    price: {
      fontSize: 27,
      fontWeight: "800",
      color: "#0B4F35",
      marginTop: 13,
    },

    healthyBadge: {
      alignSelf: "flex-start",
      backgroundColor: "#E6F2E8",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 7,
      marginTop: 12,
    },

    healthyText: {
      color: "#0B4F35",
      fontSize: 12,
      fontWeight: "700",
    },

    /* DETAIL CARDS */

    detailCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 20,
      padding: 20,
      marginTop: 14,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: "#0B4F35",
      marginBottom: 9,
    },

    description: {
      fontSize: 14,
      lineHeight: 23,
      color: "#666666",
    },

    detailText: {
      fontSize: 14,
      lineHeight: 23,
      color: "#555555",
    },

    /* ALLERGEN */

    allergenBox: {
      backgroundColor:
        "#FFF7E6",
      borderRadius: 12,
      padding: 13,
      borderWidth: 1,
      borderColor:
        "#E8D5A5",
    },

    allergenText: {
      fontSize: 14,
      lineHeight: 21,
      color: "#6A5522",
      fontWeight: "600",
    },

    /* PRODUCT INFORMATION */

    infoRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor:
        "#EEEEEE",
    },

    infoLabel: {
      fontSize: 13,
      color: "#888888",
    },

    infoValue: {
      fontSize: 13,
      fontWeight: "700",
      color: "#0B4F35",
      maxWidth: "55%",
      textAlign: "right",
    },

    /* BOTTOM BAR */

    bottomBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 20,
      paddingTop: 13,
      paddingBottom: 22,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },

    bottomLabel: {
      fontSize: 11,
      color: "#888888",
    },

    bottomPrice: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0B4F35",
      marginTop: 2,
    },

    addToCartButton: {
      backgroundColor:
        "#0B4F35",
      paddingHorizontal: 25,
      paddingVertical: 15,
      borderRadius: 16,
    },

    disabledButton: {
      backgroundColor:
        "#AAAAAA",
    },

    addToCartText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

  });