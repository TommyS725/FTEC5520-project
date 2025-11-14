import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  FlightSettled as FlightSettledEvent,
  InsurancePurchased as InsurancePurchasedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PolicyCreated as PolicyCreatedEvent,
  PolicyStatusChanged as PolicyStatusChangedEvent,
  TokenListed as TokenListedEvent,
  TokenProcessed as TokenProcessedEvent,
  TokenPurchased as TokenPurchasedEvent,
  TokenUnlisted as TokenUnlistedEvent,
  Transfer as TransferEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/FlightInsurance/FlightInsurance"
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
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFlightSettled(event: FlightSettledEvent): void {
  let entity = new FlightSettled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.flightIdHash = event.params.flightIdHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInsurancePurchased(event: InsurancePurchasedEvent): void {
  let entity = new InsurancePurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.policyId = event.params.policyId
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePolicyCreated(event: PolicyCreatedEvent): void {
  let entity = new PolicyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyId = event.params.policyId
  entity.flightNumber = event.params.flightNumber
  entity.departureDate = event.params.departureDate
  entity.flightIdHash = event.params.flightIdHash
  entity.delayMinutesThreshold = event.params.delayMinutesThreshold
  entity.expirationTimestamp = event.params.expirationTimestamp
  entity.payoutAmount = event.params.payoutAmount
  entity.inventory = event.params.inventory
  entity.price = event.params.price
  entity.open = event.params.open

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePolicyStatusChanged(
  event: PolicyStatusChangedEvent
): void {
  let entity = new PolicyStatusChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.policyId = event.params.policyId
  entity.open = event.params.open

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenListed(event: TokenListedEvent): void {
  let entity = new TokenListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenProcessed(event: TokenProcessedEvent): void {
  let entity = new TokenProcessed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.payoutAmount = event.params.payoutAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenPurchased(event: TokenPurchasedEvent): void {
  let entity = new TokenPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.buyer = event.params.buyer
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenUnlisted(event: TokenUnlistedEvent): void {
  let entity = new TokenUnlisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
