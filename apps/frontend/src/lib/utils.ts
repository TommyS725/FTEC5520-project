import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function explorerLink(
  address: string,
  type: "address" | "transaction" = "address"
): string {
  const baseUrl = import.meta.env.VITE_EXPLORER_URL;
  if (type === "address") {
    return `${baseUrl}/address/${address}`;
  }
  return `${baseUrl}/tx/${address}`;
}
