'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppContextType, Product, User, CartItem, productsDummyData, userDummyData } from '../types';

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || '$';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<User | false>(false);
  const [isSeller, setIsSeller] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem>({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
  };

  const addToCart = (itemId: string, size: string = 'default') => {
    setCartItems((prev) => {
      const item = prev[itemId] || {};
      const newQuantity = (item[size] || 0) + 1;
      return {
        ...prev,
        [itemId]: { ...item, [size]: newQuantity },
      };
    });
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    setCartItems((prev) => {
      const item = { ...prev[itemId] };
      if (quantity > 0) {
        item[size] = quantity;
        return { ...prev, [itemId]: item };
      } else {
        delete item[size];
        if (Object.keys(item).length === 0) {
          const newCart = { ...prev };
          delete newCart[itemId];
          return newCart;
        }
        return { ...prev, [itemId]: item };
      }
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    async function loadData() {
      await fetchProductData();
      await fetchUserData();
    }
    loadData();
  }, []);

  const contextValue: AppContextType = {
    products,
    currency,
    router,
    userData,
    isSeller,
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    fetchProductData,
    fetchUserData,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};