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
  clearCart: () => void;
  fetchProductData: () => Promise<void>;
}

// Product interface matching real database schema
export interface Product {
  id: string;           // Real DB uses 'id' not '_id'
  title: string;        // Real DB uses 'title' not 'name'
  description: string;
  price: string;        // Real DB stores price as string
  category: string;
  image1: string | null; // Real DB has individual image fields
  image2: string | null;
  image3: string | null;
  image4: string | null;
  isFeatured: boolean;
  isBanner: boolean;
  createdAt: Date | null;
}

// Legacy product interface for backwards compatibility
export interface LegacyProduct {
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



// Helper function to get product images as array
export const getProductImages = (product: Product): string[] => {
  return [product.image1, product.image2, product.image3, product.image4]
    .filter(Boolean) as string[];
};

// Helper function to get product price as number
export const getProductPrice = (product: Product): number => {
  return parseFloat(product.price) || 0;
};

// Dummy data for development (legacy format for backwards compatibility)
export const productsDummyData: LegacyProduct[] = [
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


