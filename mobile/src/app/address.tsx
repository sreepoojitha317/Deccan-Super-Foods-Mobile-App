import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

/* =====================================================
   LOCAL PRODUCT IMAGES
===================================================== */

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

/* =====================================================
   CHECKOUT / ADDRESS SCREEN
===================================================== */

export default function AddressScreen() {
  const {
    cartItems,
    cartCount,
    addToCart,
  } = useCart();

  /* =====================================================
     STATE
  ===================================================== */

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [relatedProducts, setRelatedProducts] =
    useState<any[]>([]);

  /* =====================================================
     LOAD RELATED PRODUCTS
  ===================================================== */

  useEffect(() => {
    loadRelatedProducts();
  }, []);

  async function loadRelatedProducts() {
    try {
      const products = await getProducts();

      /*
        Show products that are NOT already
        present in the cart.
      */

      const cartIds = cartItems.map(
        (item) => item.id
      );

      const availableProducts =
        products.filter(
          (product: any) =>
            !cartIds.includes(product.id)
        );

      /*
        Show maximum 6 products.
      */

      setRelatedProducts(
        availableProducts.slice(0, 6)
      );
    } catch (error) {
      console.error(
        "Related products error:",
        error
      );
    }
  }

  /* =====================================================
     PRICE CALCULATIONS
  ===================================================== */

  const itemTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.quantity,
    0
  );

  const deliveryFee = 0;

  const grandTotal =
    itemTotal + deliveryFee;

  /* =====================================================
     ADD RELATED PRODUCT
  ===================================================== */

  function handleAddRelatedProduct(
    product: any
  ) {
    addToCart(product);

    Alert.alert(
      "Added to Cart",
      `${product.name} has been added to your cart.`
    );
  }

  /* =====================================================
     CONFIRM ORDER
  ===================================================== */

  function handleConfirmOrder() {
    if (!address.trim()) {
      Alert.alert(
        "Address Required",
        "Please enter your delivery address."
      );
      return;
    }

    if (!city.trim()) {
      Alert.alert(
        "City Required",
        "Please enter your city."
      );
      return;
    }

    if (!pincode.trim()) {
      Alert.alert(
        "PIN Code Required",
        "Please enter your PIN code."
      );
      return;
    }

    Alert.alert(
      "Order Confirmed",
      `Your order of ₹${grandTotal.toFixed(
        0
      )} has been placed successfully.`,
      [
        {
          text: "Continue Shopping",
          onPress: () =>
            router.replace("/home"),
        },
      ]
    );
  }

  /* =====================================================
     RELATED PRODUCT CARD
  ===================================================== */

  function renderRelatedProduct({
    item,
  }: {
    item: any;
  }) {
    return (
      <View
        style={
          styles.relatedProductCard
        }
      >
        <View
          style={
            styles.relatedImageContainer
          }
        >
          {productImages[item.id] ? (
            <Image
              source={
                productImages[item.id]
              }
              style={
                styles.relatedProductImage
              }
              resizeMode="cover"
            />
          ) : item.image_url ? (
            <Image
              source={{
                uri: item.image_url,
              }}
              style={
                styles.relatedProductImage
              }
              resizeMode="cover"
            />
          ) : (
            <View
              style={
                styles.relatedPlaceholder
              }
            >
              <Text
                style={
                  styles.relatedPlaceholderText
                }
              >
                Deccan
              </Text>
            </View>
          )}
        </View>

        <Text
          style={styles.relatedProductName}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <Text
          style={styles.relatedProductWeight}
        >
          {item.weight}
        </Text>

        <View
          style={
            styles.relatedBottomRow
          }
        >
          <Text
            style={
              styles.relatedProductPrice
            }
          >
            ₹{item.price}
          </Text>

          <Pressable
            style={
              styles.relatedAddButton
            }
            onPress={() =>
              handleAddRelatedProduct(
                item
              )
            }
          >
            <Text
              style={
                styles.relatedAddText
              }
            >
              +
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* =====================================================
     MAIN SCREEN
  ===================================================== */

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
          style={styles.headerCenter}
        >
          <Text
            style={styles.headerTitle}
          >
            Checkout
          </Text>

          <Text
            style={styles.headerSubtitle}
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

      {/* CONTENT */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* =================================================
            YOU MIGHT ALSO LIKE
        ================================================= */}

        {relatedProducts.length >
          0 && (
          <View
            style={
              styles.sectionContainer
            }
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                You Might Also Like
              </Text>

              <Text
                style={
                  styles.sectionSubText
                }
              >
                Complete your order
              </Text>
            </View>

            <FlatList
              data={relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              keyExtractor={(item) =>
                String(item.id)
              }
              renderItem={
                renderRelatedProduct
              }
              contentContainerStyle={
                styles.relatedList
              }
            />
          </View>
        )}

        {/* =================================================
            DELIVERY ADDRESS
        ================================================= */}

        <View
          style={styles.card}
        >
          <View
            style={
              styles.cardTitleRow
            }
          >
            <View
              style={
                styles.iconCircle
              }
            >
              <Text
                style={
                  styles.iconText
                }
              >
                ⌖
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.cardTitle
                }
              >
                Delivery Address
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Where should we deliver?
              </Text>
            </View>
          </View>

          <Text
            style={styles.inputLabel}
          >
            Full Address
          </Text>

          <TextInput
            value={address}
            onChangeText={
              setAddress
            }
            placeholder="House no., Street, Area"
            placeholderTextColor="#A3A3A3"
            multiline
            numberOfLines={3}
            style={
              styles.addressInput
            }
          />

          <View
            style={
              styles.twoColumnRow
            }
          >
            <View
              style={
                styles.halfInputContainer
              }
            >
              <Text
                style={
                  styles.inputLabel
                }
              >
                City
              </Text>

              <TextInput
                value={city}
                onChangeText={
                  setCity
                }
                placeholder="City"
                placeholderTextColor="#A3A3A3"
                style={
                  styles.smallInput
                }
              />
            </View>

            <View
              style={
                styles.halfInputContainer
              }
            >
              <Text
                style={
                  styles.inputLabel
                }
              >
                PIN Code
              </Text>

              <TextInput
                value={pincode}
                onChangeText={
                  setPincode
                }
                placeholder="PIN Code"
                placeholderTextColor="#A3A3A3"
                keyboardType="number-pad"
                maxLength={6}
                style={
                  styles.smallInput
                }
              />
            </View>
          </View>
        </View>

        {/* =================================================
            DELIVERY
        ================================================= */}

        <View
          style={styles.deliveryCard}
        >
          <View
            style={
              styles.deliveryLeft
            }
          >
            <View
              style={
                styles.deliveryIconCircle
              }
            >
              <Text
                style={
                  styles.deliveryIcon
                }
              >
                🚚
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.deliveryTitle
                }
              >
                Standard Delivery
              </Text>

              <Text
                style={
                  styles.deliverySubtext
                }
              >
                Delivered to your address
              </Text>
            </View>
          </View>

          <View
            style={
              styles.freeDeliveryBadge
            }
          >
            <Text
              style={
                styles.freeDeliveryText
              }
            >
              FREE
            </Text>
          </View>
        </View>

        {/* =================================================
            BILL DETAILS
        ================================================= */}

        <View
          style={styles.card}
        >
          <Text
            style={styles.cardTitle}
          >
            Bill Details
          </Text>

          <View
            style={styles.billRow}
          >
            <Text
              style={styles.billLabel}
            >
              Item Total
            </Text>

            <Text
              style={styles.billValue}
            >
              ₹{itemTotal.toFixed(0)}
            </Text>
          </View>

          <View
            style={styles.billRow}
          >
            <Text
              style={styles.billLabel}
            >
              Delivery Fee
            </Text>

            <Text
              style={styles.freeText}
            >
              FREE
            </Text>
          </View>

          <View
            style={styles.billDivider}
          />

          <View
            style={styles.totalBillRow}
          >
            <Text
              style={
                styles.grandTotalLabel
              }
            >
              Grand Total
            </Text>

            <Text
              style={
                styles.grandTotalValue
              }
            >
              ₹{grandTotal.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* =================================================
            PAYMENT OPTIONS
        ================================================= */}

        <View
          style={styles.card}
        >
          <Text
            style={styles.cardTitle}
          >
            Select Payment Option
          </Text>

          {/* UPI */}

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === "UPI" &&
                styles.paymentOptionSelected,
            ]}
            onPress={() =>
              setPaymentMethod(
                "UPI"
              )
            }
          >
            <View
              style={
                styles.paymentLeft
              }
            >
              <View
                style={
                  styles.paymentIconBox
                }
              >
                <Text
                  style={
                    styles.paymentIcon
                  }
                >
                  UPI
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.paymentTitle
                  }
                >
                  UPI
                </Text>

                <Text
                  style={
                    styles.paymentSubtext
                  }
                >
                  Google Pay, PhonePe,
                  Paytm
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod ===
                  "UPI" &&
                  styles.radioSelected,
              ]}
            >
              {paymentMethod ===
                "UPI" && (
                <View
                  style={
                    styles.radioDot
                  }
                />
              )}
            </View>
          </Pressable>

          {/* CARD */}

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod ===
                "CARD" &&
                styles.paymentOptionSelected,
            ]}
            onPress={() =>
              setPaymentMethod(
                "CARD"
              )
            }
          >
            <View
              style={
                styles.paymentLeft
              }
            >
              <View
                style={
                  styles.paymentIconBox
                }
              >
                <Text
                  style={
                    styles.paymentIcon
                  }
                >
                  ▭
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.paymentTitle
                  }
                >
                  Credit / Debit Card
                </Text>

                <Text
                  style={
                    styles.paymentSubtext
                  }
                >
                  Visa, Mastercard,
                  RuPay
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod ===
                  "CARD" &&
                  styles.radioSelected,
              ]}
            >
              {paymentMethod ===
                "CARD" && (
                <View
                  style={
                    styles.radioDot
                  }
                />
              )}
            </View>
          </Pressable>

          {/* COD */}

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod ===
                "COD" &&
                styles.paymentOptionSelected,
            ]}
            onPress={() =>
              setPaymentMethod(
                "COD"
              )
            }
          >
            <View
              style={
                styles.paymentLeft
              }
            >
              <View
                style={
                  styles.paymentIconBox
                }
              >
                <Text
                  style={
                    styles.paymentIcon
                  }
                >
                  ₹
                </Text>
              </View>

              <View>
                <Text
                  style={
                    styles.paymentTitle
                  }
                >
                  Cash on Delivery
                </Text>

                <Text
                  style={
                    styles.paymentSubtext
                  }
                >
                  Pay when your order
                  arrives
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod ===
                  "COD" &&
                  styles.radioSelected,
              ]}
            >
              {paymentMethod ===
                "COD" && (
                <View
                  style={
                    styles.radioDot
                  }
                />
              )}
            </View>
          </Pressable>
        </View>

        {/* =================================================
            PAYMENT NOTE
        ================================================= */}

        <View
          style={
            styles.securePaymentBox
          }
        >
          <Text
            style={
              styles.secureIcon
            }
          >
            🔒
          </Text>

          <Text
            style={
              styles.secureText
            }
          >
            Your payment information is
            secure and protected.
          </Text>
        </View>

        {/* =================================================
            CONFIRM ORDER
        ================================================= */}

        <Pressable
          style={
            styles.confirmButton
          }
          onPress={
            handleConfirmOrder
          }
        >
          <View>
            <Text
              style={
                styles.confirmButtonText
              }
            >
              Confirm Order
            </Text>

            <Text
              style={
                styles.confirmButtonSubtext
              }
            >
              {paymentMethod ===
                "COD"
                ? "Cash on Delivery"
                : paymentMethod}
            </Text>
          </View>

          <Text
            style={
              styles.confirmAmount
            }
          >
            ₹{grandTotal.toFixed(0)}
          </Text>
        </Pressable>

        <Text
          style={
            styles.bottomNote
          }
        >
          By confirming, you agree to
          our order and delivery terms.
        </Text>
      </ScrollView>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F0DF",
    },

    /* HEADER */

    header: {
      height: 105,
      paddingHorizontal: 20,
      paddingTop: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#F7F0DF",
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

    headerCenter: {
      alignItems: "center",
    },

    headerTitle: {
      fontSize: 21,
      fontWeight: "800",
      color: "#0B4F35",
    },

    headerSubtitle: {
      fontSize: 12,
      color: "#888888",
      marginTop: 2,
    },

    headerSpace: {
      width: 42,
    },

    /* CONTENT */

    scrollContent: {
      paddingHorizontal: 18,
      paddingBottom: 40,
    },

    /* SECTION */

    sectionContainer: {
      marginBottom: 18,
    },

    sectionHeader: {
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: "#0B4F35",
    },

    sectionSubText: {
      fontSize: 12,
      color: "#888888",
      marginTop: 3,
    },

    relatedList: {
      paddingRight: 10,
    },

    /* RELATED PRODUCTS */

    relatedProductCard: {
      width: 145,
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 10,
      marginRight: 11,
    },

    relatedImageContainer: {
      width: "100%",
      height: 105,
      borderRadius: 13,
      overflow: "hidden",
      backgroundColor: "#EFE8D5",
    },

    relatedProductImage: {
      width: "100%",
      height: "100%",
    },

    relatedPlaceholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    relatedPlaceholderText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#C9A44C",
    },

    relatedProductName: {
      fontSize: 13,
      fontWeight: "800",
      color: "#0B4F35",
      lineHeight: 17,
      marginTop: 8,
      minHeight: 34,
    },

    relatedProductWeight: {
      fontSize: 10,
      color: "#888888",
      marginTop: 3,
    },

    relatedBottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },

    relatedProductPrice: {
      fontSize: 14,
      fontWeight: "800",
      color: "#0B4F35",
    },

    relatedAddButton: {
      width: 30,
      height: 30,
      borderRadius: 10,
      backgroundColor: "#0B4F35",
      justifyContent: "center",
      alignItems: "center",
    },

    relatedAddText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "700",
      marginTop: -2,
    },

    /* COMMON CARD */

    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 17,
      marginBottom: 15,
    },

    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 17,
    },

    iconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#E8F1E8",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 11,
    },

    iconText: {
      fontSize: 22,
      color: "#0B4F35",
    },

    cardTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: "#0B4F35",
    },

    cardSubtitle: {
      fontSize: 11,
      color: "#999999",
      marginTop: 2,
    },

    /* ADDRESS */

    inputLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: "#555555",
      marginBottom: 7,
    },

    addressInput: {
      minHeight: 80,
      borderWidth: 1,
      borderColor: "#E2DDCE",
      borderRadius: 13,
      paddingHorizontal: 13,
      paddingVertical: 11,
      fontSize: 13,
      color: "#333333",
      backgroundColor: "#FCFBF7",
      textAlignVertical: "top",
      marginBottom: 13,
    },

    twoColumnRow: {
      flexDirection: "row",
      gap: 10,
    },

    halfInputContainer: {
      flex: 1,
    },

    smallInput: {
      height: 48,
      borderWidth: 1,
      borderColor: "#E2DDCE",
      borderRadius: 13,
      paddingHorizontal: 13,
      fontSize: 13,
      color: "#333333",
      backgroundColor: "#FCFBF7",
    },

    /* DELIVERY */

    deliveryCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 15,
      marginBottom: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    deliveryLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    deliveryIconCircle: {
      width: 43,
      height: 43,
      borderRadius: 21.5,
      backgroundColor: "#E8F1E8",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 11,
    },

    deliveryIcon: {
      fontSize: 20,
    },

    deliveryTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#0B4F35",
    },

    deliverySubtext: {
      fontSize: 11,
      color: "#888888",
      marginTop: 3,
    },

    freeDeliveryBadge: {
      backgroundColor: "#E7F3E9",
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 9,
    },

    freeDeliveryText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#0B4F35",
    },

    /* BILL */

    billRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 13,
    },

    billLabel: {
      fontSize: 13,
      color: "#777777",
    },

    billValue: {
      fontSize: 13,
      fontWeight: "700",
      color: "#444444",
    },

    freeText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#0B4F35",
    },

    billDivider: {
      height: 1,
      backgroundColor: "#ECE8DC",
      marginVertical: 15,
    },

    totalBillRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    grandTotalLabel: {
      fontSize: 17,
      fontWeight: "800",
      color: "#0B4F35",
    },

    grandTotalValue: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0B4F35",
    },

    /* PAYMENT */

    paymentOption: {
      borderWidth: 1,
      borderColor: "#E6E1D5",
      borderRadius: 15,
      padding: 12,
      marginTop: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    paymentOptionSelected: {
      borderColor: "#0B4F35",
      backgroundColor: "#F3F8F3",
    },

    paymentLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    paymentIconBox: {
      width: 42,
      height: 42,
      borderRadius: 11,
      backgroundColor: "#F7F0DF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 11,
    },

    paymentIcon: {
      fontSize: 12,
      fontWeight: "900",
      color: "#0B4F35",
    },

    paymentTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: "#333333",
    },

    paymentSubtext: {
      fontSize: 10,
      color: "#888888",
      marginTop: 3,
    },

    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: "#C5C5C5",
      justifyContent: "center",
      alignItems: "center",
    },

    radioSelected: {
      borderColor: "#0B4F35",
    },

    radioDot: {
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: "#0B4F35",
    },

    /* SECURITY */

    securePaymentBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EEF5EE",
      borderRadius: 14,
      paddingHorizontal: 13,
      paddingVertical: 12,
      marginBottom: 15,
    },

    secureIcon: {
      fontSize: 16,
      marginRight: 8,
    },

    secureText: {
      flex: 1,
      fontSize: 11,
      color: "#55705D",
      lineHeight: 16,
    },

    /* CONFIRM */

    confirmButton: {
      backgroundColor: "#0B4F35",
      borderRadius: 17,
      paddingHorizontal: 18,
      paddingVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    confirmButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },

    confirmButtonSubtext: {
      color: "#CFE2D5",
      fontSize: 10,
      marginTop: 3,
    },

    confirmAmount: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
    },

    bottomNote: {
      textAlign: "center",
      fontSize: 10,
      color: "#999999",
      marginTop: 12,
      marginBottom: 10,
      lineHeight: 15,
    },
  });