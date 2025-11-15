import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  FlightSettled,
  InsurancePurchased,
  OwnershipTransferred,
  PolicyCreated,
  PolicyStatusChanged,
  TokenListed,
  TokenProcessed,
  TokenPurchased,
  TokenUnlisted,
  Transfer,
  Withdrawal
} from "../generated/FlightInsurance/FlightInsurance"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createFlightSettledEvent(flightIdHash: Bytes): FlightSettled {
  let flightSettledEvent = changetype<FlightSettled>(newMockEvent())

  flightSettledEvent.parameters = new Array()

  flightSettledEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )

  return flightSettledEvent
}

export function createInsurancePurchasedEvent(
  tokenId: BigInt,
  policyId: BigInt,
  buyer: Address
): InsurancePurchased {
  let insurancePurchasedEvent = changetype<InsurancePurchased>(newMockEvent())

  insurancePurchasedEvent.parameters = new Array()

  insurancePurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  insurancePurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "policyId",
      ethereum.Value.fromUnsignedBigInt(policyId)
    )
  )
  insurancePurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return insurancePurchasedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPolicyCreatedEvent(
  policyId: BigInt,
  flightNumber: string,
  departureDate: string,
  flightIdHash: Bytes,
  delayMinutesThreshold: BigInt,
  expirationTimestamp: BigInt,
  payoutAmount: BigInt,
  inventory: BigInt,
  price: BigInt,
  open: boolean
): PolicyCreated {
  let policyCreatedEvent = changetype<PolicyCreated>(newMockEvent())

  policyCreatedEvent.parameters = new Array()

  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "policyId",
      ethereum.Value.fromUnsignedBigInt(policyId)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "flightNumber",
      ethereum.Value.fromString(flightNumber)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "departureDate",
      ethereum.Value.fromString(departureDate)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "delayMinutesThreshold",
      ethereum.Value.fromUnsignedBigInt(delayMinutesThreshold)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTimestamp",
      ethereum.Value.fromUnsignedBigInt(expirationTimestamp)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "payoutAmount",
      ethereum.Value.fromUnsignedBigInt(payoutAmount)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "inventory",
      ethereum.Value.fromUnsignedBigInt(inventory)
    )
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  policyCreatedEvent.parameters.push(
    new ethereum.EventParam("open", ethereum.Value.fromBoolean(open))
  )

  return policyCreatedEvent
}

export function createPolicyStatusChangedEvent(
  policyId: BigInt,
  open: boolean
): PolicyStatusChanged {
  let policyStatusChangedEvent = changetype<PolicyStatusChanged>(newMockEvent())

  policyStatusChangedEvent.parameters = new Array()

  policyStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "policyId",
      ethereum.Value.fromUnsignedBigInt(policyId)
    )
  )
  policyStatusChangedEvent.parameters.push(
    new ethereum.EventParam("open", ethereum.Value.fromBoolean(open))
  )

  return policyStatusChangedEvent
}

export function createTokenListedEvent(
  tokenId: BigInt,
  price: BigInt
): TokenListed {
  let tokenListedEvent = changetype<TokenListed>(newMockEvent())

  tokenListedEvent.parameters = new Array()

  tokenListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return tokenListedEvent
}

export function createTokenProcessedEvent(
  tokenId: BigInt,
  payoutAmount: BigInt
): TokenProcessed {
  let tokenProcessedEvent = changetype<TokenProcessed>(newMockEvent())

  tokenProcessedEvent.parameters = new Array()

  tokenProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "payoutAmount",
      ethereum.Value.fromUnsignedBigInt(payoutAmount)
    )
  )

  return tokenProcessedEvent
}

export function createTokenPurchasedEvent(
  tokenId: BigInt,
  buyer: Address,
  price: BigInt
): TokenPurchased {
  let tokenPurchasedEvent = changetype<TokenPurchased>(newMockEvent())

  tokenPurchasedEvent.parameters = new Array()

  tokenPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenPurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  tokenPurchasedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return tokenPurchasedEvent
}

export function createTokenUnlistedEvent(tokenId: BigInt): TokenUnlisted {
  let tokenUnlistedEvent = changetype<TokenUnlisted>(newMockEvent())

  tokenUnlistedEvent.parameters = new Array()

  tokenUnlistedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenUnlistedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWithdrawalEvent(
  owner: Address,
  amount: BigInt
): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalEvent
}
