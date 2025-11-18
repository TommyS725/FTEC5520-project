import type { OwnedInsuranceTokensQuery, PolicyQuery } from "@/graphql/graphql";

export type InsuranceToken =
  OwnedInsuranceTokensQuery["insuranceTokens"][number];
export type Policy = PolicyQuery["policies"][number];

export type DialogState = "filter" | "new-policy" | "fuel" | "withdraw" | null;
