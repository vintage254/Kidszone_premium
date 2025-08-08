// Type definitions for KidsZone Premium

// User interface from database schema
export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  refNo: string;
  status?: string;
  role?: "ADMIN" | "USER" | "SELLER";
  lastActivityDate?: Date;
  createdAt?: Date;
}

// App Context Type
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
}

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



export interface CartItem {
  [itemId: string]: {
    [size: string]: number;
  };
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


