"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar">
      <div>
        <Link href="/" className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1 className="text-lg font-semibold">KidsZone Admin</h1>
        </Link>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;
            const Icon = link.icon;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "link",
                    isSelected && "bg-primary text-white shadow-sm",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      isSelected ? "text-white" : "text-gray-500",
                    )}
                  />
                  <p className={cn(isSelected ? "text-white" : "text-gray-700 dark:text-gray-300")}>
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        <Avatar>
          <AvatarFallback className="bg-secondary text-white">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{session?.user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
