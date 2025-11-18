// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { BigInt } from "@graphprotocol/graph-ts";
// biome-ignore lint/style/useImportType: <explanation>
import {
  FlightSettled,
  InsurancePurchased,
  PolicyCreated,
  PolicyStatusChanged,
  TokenListed,
  TokenProcessed,
  TokenPurchased,
  TokenUnlisted,
  Transfer,
} from "../generated/FlightInsurance/FlightInsurance";
import { Flight, InsuranceToken, Policy } from "../generated/schema";

export function handlePolicyCreated(event: PolicyCreated): void {
  const policy = new Policy(event.params.policyId.toString());
  policy.flight = event.params.flightIdHash.toHexString();
  policy.payout = event.params.payoutAmount.toString();
  policy.delayThreshold = event.params.delayMinutesThreshold.toString();
  policy.expiration = event.params.expirationTimestamp.toString();
  policy.open = event.params.open;
  policy.inventory = event.params.inventory.toString();
  policy.price = event.params.price.toString();
  policy.save();
}

export function handleInsurancePurchased(event: InsurancePurchased): void {
  const token = new InsuranceToken(event.params.tokenId.toString());
  token.owner = event.params.buyer.toHexString();
  token.policy = event.params.policyId.toString();
  token.processed = false;
  const policy = Policy.load(event.params.policyId.toString());
  if (policy) {
    policy.inventory = BigInt.fromString(policy.inventory)
      .minus(BigInt.fromI32(1))
      .toString();
    policy.save();
  }
  token.save();
}

export function handleFlightSettled(event: FlightSettled): void {
  const flight = Flight.load(event.params.flightIdHash.toHexString());
  if (flight) {
    flight.settled = true;
    flight.save();
  }
}

export function handlePolicyStatusChanged(event: PolicyStatusChanged): void {
  const policy = Policy.load(event.params.policyId.toString());
  if (policy) {
    policy.open = event.params.open;
    policy.save();
  }
}

export function handleTokenProcessed(event: TokenProcessed): void {
  const token = InsuranceToken.load(event.params.tokenId.toString());
  if (token) {
    token.processed = true;
    token.save();
  }
}

export function handleTokenListed(event: TokenListed): void {
  const token = InsuranceToken.load(event.params.tokenId.toString());
  if (token) {
    token.listedPrice = event.params.price.toString();
    token.save();
  }
}

export function handleTokenUnlisted(event: TokenUnlisted): void {
  const token = InsuranceToken.load(event.params.tokenId.toString());
  if (token) {
    token.listedPrice = null;
    token.save();
  }
}
export function handleTokenPurchased(event: TokenPurchased): void {
  const token = InsuranceToken.load(event.params.tokenId.toString());
  if (token) {
    token.owner = event.params.buyer.toHexString();
    token.listedPrice = null;
    token.save();
  }
}

export function handleTransfer(event: Transfer): void {
  const token = InsuranceToken.load(event.params.tokenId.toString());
  if (token) {
    token.owner = event.params.to.toHexString();
    token.save();
  }
}
