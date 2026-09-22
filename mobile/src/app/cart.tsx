import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  useCart,
} from "../context/CartContext";

/* =========================
   LOCAL PRODUCT IMAGES
========================= */

const productImages: {
  [key: number]: any;
} = {
  /* BISCUITS */
  1: require("../../assets/images/Ragi_millet_biscuits.png"),
  2: require("../../assets/images/Butter_coconut_biscuits.png"),
  3: require("../../assets/images/Jaggery_oats_biscuits.png"),
  4: require("../../assets/images/Elaichi_milk_biscuits.png"),
  5: require("../../assets/images/Multigrain_health_biscuits.png"),

  /* BREADS */
  6: require("../../assets/images/Classic_milk_bread.png"),
  7: require("../../assets/images/Whole_wheat_bread.png"),
  8: require("../../assets/images/Multigrain_bread.png"),
  9: require("../../assets/images/Coconut_bun.png"),
  10: require("../../assets/images/Masala_bread.png"),

  /* FRESH MINTS */
  11: require("../../assets/images/Classic_mint_drops.png"),
  12: require("../../assets/images/Pudina_fresh_candy.png"),
  13: require("../../assets/images/Lemon_mint_candy.png"),
  14: require("../../assets/images/Ginger_mint_candy.png"),
  15: require("../../assets/images/Tulsi_mint_drops.png"),

  /* CAKES */
  16: require("../../assets/images/Classic_chocolate_cake.png"),
  17: require("../../assets/images/Vanilla_celebration_cake.png"),
  18: require("../../assets/images/Mango_cream_cake.png"),
  19: require("../../assets/images/Coconut_cake.png"),
  20: require("../../assets/images/Dry_fruit_cake.png"),

  /* HEALTHY FOODS */
  21: require("../../assets/images/Ragi_health_mix.png"),
  22: require("../../assets/images/Millet_breakfast_mix.png"),
  23: require("../../assets/images/Andhra_peanut_chutney_powder.png"),
  24: require("../../assets/images/Kerala_banana_chips.png"),
  25: require("../../assets/images/Telangana_jowar_mix.png"),
};

/* =========================
   CART SCREEN
========================= */

export default function CartScreen() {
  const {
    cartItems,
    cartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  /* =========================
     TOTAL PRICE
  ========================= */

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    );

  /* =========================
     EMPTY CART
  ========================= */

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>

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
            My Cart
          </Text>

          <View
            style={styles.headerSpace}
          />

        </View>

        <View
          style={styles.emptyContainer}
        >

          <Text
            style={styles.emptyIcon}
          >
            🛒
          </Text>

          <Text
            style={styles.emptyTitle}
          >
            Your cart is empty
          </Text>

          <Text
            style={styles.emptyText}
          >
            Add some delicious
            Deccan foods to your
            cart.
          </Text>

          <Pressable
            style={styles.shopButton}
            onPress={() =>
              router.push("/home")
            }
          >
            <Text
              style={styles.shopButtonText}
            >
              Start Shopping
            </Text>
          </Pressable>

        </View>

      </View>
    );
  }

  /* =========================
     CART ITEM
  ========================= */

  function renderCartItem({
    item,
  }: {
    item: any;
  }) {
    return (
      <View
        style={styles.cartItem}
      >

        {/* IMAGE */}

        <View
          style={styles.itemImageContainer}
        >

          {/* LOCAL IMAGE */}
          {productImages[item.id] ? (
            <Image
              source={
                productImages[item.id]
              }
              style={
                styles.itemImage
              }
              resizeMode="cover"
            />
          ) : item.image_url ? (
            /* FALLBACK TO URL */
            <Image
              source={{
                uri: item.image_url,
              }}
              style={
                styles.itemImage
              }
              resizeMode="cover"
            />
          ) : (
            /* PLACEHOLDER */
            <View
              style={
                styles.itemPlaceholder
              }
            >
              <Text
                style={
                  styles.itemPlaceholderText
                }
              >
                Deccan
              </Text>
            </View>
          )}

        </View>

        {/* INFO */}

        <View
          style={styles.itemInfo}
        >

          <Text
            style={styles.itemName}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text
            style={styles.itemWeight}
          >
            {item.weight}
          </Text>

          <Text
            style={styles.itemPrice}
          >
            ₹{item.price}
          </Text>

          {/* QUANTITY */}

          <View
            style={styles.quantityRow}
          >

            <Pressable
              style={
                styles.quantityButton
              }
              onPress={() =>
                decreaseQuantity(
                  item.id
                )
              }
            >
              <Text
                style={
                  styles.quantityButtonText
                }
              >
                −
              </Text>
            </Pressable>

            <Text
              style={styles.quantity}
            >
              {item.quantity}
            </Text>

            <Pressable
              style={
                styles.quantityButton
              }
              onPress={() =>
                increaseQuantity(
                  item.id
                )
              }
            >
              <Text
                style={
                  styles.quantityButtonText
                }
              >
                +
              </Text>
            </Pressable>

          </View>

        </View>

        {/* REMOVE */}

        <Pressable
          style={styles.removeButton}
          onPress={() =>
            removeFromCart(
              item.id
            )
          }
        >
          <Text
            style={styles.removeText}
          >
            ×
          </Text>
        </Pressable>

      </View>
    );
  }

  /* =========================
     MAIN CART
  ========================= */

  return (
    <View style={styles.container}>

      {/* HEADER */}

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

        <View
          style={styles.titleContainer}
        >

          <Text
            style={styles.headerTitle}
          >
            My Cart
          </Text>

          <Text
            style={styles.itemCountText}
          >
            {cartCount}{" "}
            {cartCount === 1
              ? "item"
              : "items"}
          </Text>

        </View>

        <View
          style={styles.headerSpace}
        />

      </View>

      {/* CART ITEMS */}

      <FlatList
        data={cartItems}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={
          renderCartItem
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContent
        }
      />

      {/* SUMMARY */}

      <View
        style={styles.bottomSummary}
      >

        <View
          style={styles.summaryRow}
        >

          <Text
            style={styles.summaryLabel}
          >
            Items
          </Text>

          <Text
            style={styles.summaryValue}
          >
            {cartCount}
          </Text>

        </View>

        <View
          style={styles.summaryRow}
        >

          <Text
            style={styles.totalLabel}
          >
            Total
          </Text>

          <Text
            style={styles.totalValue}
          >
            ₹
            {totalPrice.toFixed(0)}
          </Text>

        </View>

        <Pressable
          style={styles.checkoutButton}
          onPress={() =>
            router.push("/address")
          }
        >
          <Text
            style={styles.checkoutText}
          >
            Proceed to Checkout
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

    titleContainer: {
      alignItems: "center",
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0B4F35",
    },

    itemCountText: {
      fontSize: 12,
      color: "#888888",
      marginTop: 2,
    },

    headerSpace: {
      width: 42,
    },

    /* LIST */

    listContent: {
      paddingHorizontal: 18,
      paddingBottom: 240,
    },

    /* CART ITEM */

    cartItem: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 20,
      padding: 12,
      marginBottom: 12,
      flexDirection: "row",
      position: "relative",
    },

    itemImageContainer: {
      width: 95,
      height: 95,
      borderRadius: 15,
      overflow: "hidden",
      backgroundColor:
        "#E8E0C9",
    },

    itemImage: {
      width: "100%",
      height: "100%",
    },

    itemPlaceholder: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#E8E0C9",
    },

    itemPlaceholderText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#C9A44C",
    },

    /* INFO */

    itemInfo: {
      flex: 1,
      marginLeft: 13,
      paddingRight: 25,
    },

    itemName: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "800",
      color: "#0B4F35",
    },

    itemWeight: {
      fontSize: 12,
      color: "#888888",
      marginTop: 4,
    },

    itemPrice: {
      fontSize: 16,
      fontWeight: "800",
      color: "#0B4F35",
      marginTop: 5,
    },

    /* QUANTITY */

    quantityRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },

    quantityButton: {
      width: 27,
      height: 27,
      borderRadius: 9,
      backgroundColor:
        "#F7F0DF",
      justifyContent:
        "center",
      alignItems: "center",
    },

    quantityButtonText: {
      fontSize: 18,
      fontWeight: "800",
      color: "#0B4F35",
    },

    quantity: {
      width: 32,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "800",
      color: "#0B4F35",
    },

    /* REMOVE */

    removeButton: {
      position: "absolute",
      right: 10,
      top: 10,
      width: 26,
      height: 26,
      justifyContent:
        "center",
      alignItems: "center",
    },

    removeText: {
      fontSize: 23,
      color: "#999999",
      fontWeight: "400",
    },

    /* EMPTY */

    emptyContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      paddingHorizontal: 35,
    },

    emptyIcon: {
      fontSize: 55,
    },

    emptyTitle: {
      marginTop: 18,
      fontSize: 22,
      fontWeight: "800",
      color: "#0B4F35",
    },

    emptyText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      color: "#777777",
    },

    shopButton: {
      marginTop: 22,
      backgroundColor:
        "#0B4F35",
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 15,
    },

    shopButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

    /* SUMMARY */

    bottomSummary: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 24,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },

    summaryRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 7,
    },

    summaryLabel: {
      fontSize: 13,
      color: "#888888",
    },

    summaryValue: {
      fontSize: 13,
      fontWeight: "700",
      color: "#555555",
    },

    totalLabel: {
      fontSize: 17,
      fontWeight: "800",
      color: "#0B4F35",
    },

    totalValue: {
      fontSize: 21,
      fontWeight: "800",
      color: "#0B4F35",
    },

    checkoutButton: {
      marginTop: 12,
      backgroundColor:
        "#0B4F35",
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: "center",
    },

    checkoutText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

  });