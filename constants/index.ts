

import {
  Home,
  Users,
  Briefcase,
  FileText,
  UserCheck,
} from "lucide-react";

export const adminSideBarLinks = [
  {
    icon: Home,
    route: "/admin",
    text: "Home",
  },
  {
    icon: Users,
    route: "/admin/users",
    text: "All Users",
  },
  {
    icon: Briefcase,
    route: "/admin/jobs",
    text: "All Jobs",
  },
  {
    icon: FileText,
    route: "/admin/applications",
    text: "Job Applications",
  },
  {
    icon: UserCheck,
    route: "/admin/account-requests",
    text: "Account Requests",
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


