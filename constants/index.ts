

import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  MessageSquareText,
} from "lucide-react";

export const adminSideBarLinks = [
  {
    icon: Home,
    route: "/admin",
    text: "Dashboard",
  },
  {
    icon: Package,
    route: "/admin/products",
    text: "Products",
  },
  {
    icon: ShoppingCart,
    route: "/admin/orders",
    text: "Orders",
  },
  {
    icon: MessageSquareText,
    route: "/admin/chatbox",
    text: "Chatbox",
  },
  {
    icon: Users,
    route: "/admin/customers",
    text: "Customers",
  },
  {
    icon: BarChart3,
    route: "/admin/analytics",
    text: "Analytics",
  },
  {
    icon: Settings,
    route: "/admin/settings",
    text: "Settings",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
};


