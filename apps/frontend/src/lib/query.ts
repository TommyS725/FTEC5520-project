import { QueryClient } from "@tanstack/react-query";
import { readContractQueryKey } from "wagmi/query";
import { readRequiredReserveParam } from "./contracts";

export const queryClient = new QueryClient();

export const InsuranceTokenKeyFactory = {
  all: () => ["insuranceTokens"] as const,
  owned: (address: string) =>
    [...InsuranceTokenKeyFactory.all(), address] as const,
};

export const PolicyKeyFactory = {
  all: () => ["policies"] as const,
};

export const AdminKeyFactory = {
  insuranceContractBalance: () => ["insuranceContractBalance"] as const,
  requiredReserve: () => readContractQueryKey(readRequiredReserveParam),
};
