import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

/* =========================
   PRODUCT TYPE
========================= */

export type Product = {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  allergens: string;
  nutrition: string;
  storage: string;
  weight: string;
  price: number;
  image_url: string | null;
  stock: number;
  rating: number;
  category_id: number;
  state: string;
  is_healthy: boolean;
  created_at?: string;
};

/* =========================
   CART ITEM
========================= */

export type CartItem = Product & {
  quantity: number;
};

/* =========================
   CART CONTEXT TYPE
========================= */

type CartContextType = {
  cartItems: CartItem[];

  cartCount: number;

  addToCart: (product: Product) => void;

  removeFromCart: (productId: number) => void;

  increaseQuantity: (productId: number) => void;

  decreaseQuantity: (productId: number) => void;

  clearCart: () => void;
};

/* =========================
   CONTEXT
========================= */

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

/* =========================
   PROVIDER
========================= */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [cartLoaded, setCartLoaded] =
    useState(false);

  const [userId, setUserId] =
    useState<string | null>(null);

  /* =========================
     GET CURRENT USER
  ========================= */

  useEffect(() => {
    initializeCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newUserId = session?.user?.id ?? null;

        setUserId(newUserId);

        if (newUserId) {
          loadCart(newUserId);
        } else {
          setCartItems([]);
          setCartLoaded(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =========================
     INITIALIZE CART
  ========================= */

  async function initializeCart() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUserId =
        session?.user?.id ?? null;

      setUserId(currentUserId);

      if (currentUserId) {
        await loadCart(currentUserId);
      } else {
        setCartItems([]);
        setCartLoaded(true);
      }
    } catch (error) {
      console.error(
        "Cart initialization error:",
        error
      );

      setCartLoaded(true);
    }
  }

  /* =========================
     USER-SPECIFIC STORAGE KEY
  ========================= */

  function getCartStorageKey(
    currentUserId: string
  ) {
    return `deccan_cart_${currentUserId}`;
  }

  /* =========================
     LOAD USER CART
  ========================= */

  async function loadCart(
    currentUserId: string
  ) {
    try {
      setCartLoaded(false);

      const storageKey =
        getCartStorageKey(currentUserId);

      const savedCart =
        await AsyncStorage.getItem(storageKey);

      if (savedCart) {
        setCartItems(
          JSON.parse(savedCart)
        );
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }

  /* =========================
     SAVE USER CART
  ========================= */

  useEffect(() => {
    if (!cartLoaded || !userId) {
      return;
    }

    saveCart();
  }, [cartItems, cartLoaded, userId]);

  async function saveCart() {
    if (!userId) {
      return;
    }

    try {
      const storageKey =
        getCartStorageKey(userId);

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Cart saving error:",
        error
      );
    }
  }

  /* =========================
     ADD TO CART
  ========================= */

  function addToCart(
    product: Product
  ) {
    setCartItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.id === product.id
          );

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );
        }

        return [
          ...currentItems,
          {
            ...product,
            quantity: 1,
          },
        ];
      }
    );
  }

  /* =========================
     REMOVE
  ========================= */

  function removeFromCart(
    productId: number
  ) {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== productId
        )
    );
  }

  /* =========================
     INCREASE
  ========================= */

  function increaseQuantity(
    productId: number
  ) {
    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        )
    );
  }

  /* =========================
     DECREASE
  ========================= */

  function decreaseQuantity(
    productId: number
  ) {
    setCartItems(
      (currentItems) =>
        currentItems
          .map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity - 1,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  }

  /* =========================
     CLEAR CART
  ========================= */

  function clearCart() {
    setCartItems([]);
  }

  /* =========================
     CART COUNT
  ========================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  /* =========================
     PROVIDER
  ========================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   USE CART
========================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}