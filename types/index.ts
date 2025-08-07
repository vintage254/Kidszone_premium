// Type definitions for KidsZone Premium

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CartItem {
  [itemId: string]: {
    [size: string]: number;
  };
}

export interface AppContextType {
  products: Product[];
  currency: string;
  router: any;
  userData: User | false;
  isSeller: boolean;
  cartItems: CartItem;
  addToCart: (itemId: string, size?: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartCount: () => number;
  getCartAmount: () => number;
  fetchProductData: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

// Dummy data for development
export const productsDummyData: Product[] = [
  {
    _id: "1",
    name: "Kids Headphones",
    description: "High-quality headphones for kids",
    price: 120,
    offerPrice: 99.99,
    image: ["/start/p_img1.png"],
    category: "Electronics",
    subCategory: "Audio",
    sizes: ["One Size"],
    bestseller: true
  },
  {
    _id: "2", 
    name: "Educational Tablet",
    description: "Learning tablet for children",
    price: 149.99,
    image: ["/start/p_img2_1.png"],
    category: "Electronics",
    subCategory: "Tablets",
    sizes: ["7 inch", "10 inch"],
    bestseller: false
  }
];

export const userDummyData: User = {
  _id: "user1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: "123 Main St, City, Country"
};
