'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { AppContextType, Product, User, CartItem, productsDummyData } from '../types';

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
  const { user, isLoaded } = useUser();
  const [cartItems, setCartItems] = useState<CartItem>({});

  const userData = useMemo(() => {
    if (isLoaded && user) {
      return {
        id: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        image: user.imageUrl,
        role: user.publicMetadata?.role as 'ADMIN' | 'USER' | 'SELLER' | undefined,
      } as User;
    }
    return false;
  }, [user, isLoaded]);

  const isSeller = useMemo(() => {
    return userData && (userData.role === 'ADMIN' || userData.role === 'SELLER');
  }, [userData]);

  const fetchProductData = async () => {
    setProducts(productsDummyData);
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
    fetchProductData();
  }, []);

  // Clear cart when user signs out
  useEffect(() => {
    if (isLoaded && !user) {
      setCartItems({});
    }
  }, [isLoaded, user]);

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
  };

  // Debug log to see what we're providing
  console.log('AppContext providing - userData:', userData);
  console.log('AppContext providing - isSeller:', isSeller);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};