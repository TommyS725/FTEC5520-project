import type { InsuranceToken } from "./types";

export const isTokenDelayed = (token: InsuranceToken) =>
  !!token.policy.flight.delay &&
  BigInt(token.policy.flight.delay) >= BigInt(token.policy.delayThreshold);

export const tokenStatus = (token: InsuranceToken) => {
  const policy = token.policy;
  const flight = policy.flight;
  if (!token.processed) {
    if (flight.delay) {
      return isTokenDelayed(token) ? "Claimable" : "Not Claimable";
    }
    return flight.requestedAt
      ? "Pending Delay Info"
      : "Awaiting Delay Info Request";
  }
  return isTokenDelayed(token) ? "Paid Out" : "No Payout";
};
