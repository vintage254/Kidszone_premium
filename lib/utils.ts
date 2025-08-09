import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/**
 * Generate a unique reference number for new users
 */
export function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomPart = Math.random().toString(36).substring(2, 8); // Random 6-char string
  return `REF-${timestamp}-${randomPart}`.toUpperCase();
}
