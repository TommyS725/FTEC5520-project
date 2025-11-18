import {
	type Address,
	type BigInt,
	type Bytes,
	ethereum,
} from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import type {
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
	Withdrawal,
} from "../generated/FlightInsurance/FlightInsurance";

export function createApprovalEvent(
	owner: Address,
	approved: Address,
	tokenId: BigInt,
): Approval {
	const approvalEvent = changetype<Approval>(newMockEvent());

	approvalEvent.parameters = [];

	approvalEvent.parameters.push(
		new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
	);
	approvalEvent.parameters.push(
		new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved)),
	);
	approvalEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);

	return approvalEvent;
}

export function createApprovalForAllEvent(
	owner: Address,
	operator: Address,
	approved: boolean,
): ApprovalForAll {
	const approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent());

	approvalForAllEvent.parameters = [];

	approvalForAllEvent.parameters.push(
		new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
	);
	approvalForAllEvent.parameters.push(
		new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator)),
	);
	approvalForAllEvent.parameters.push(
		new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved)),
	);

	return approvalForAllEvent;
}

export function createFlightSettledEvent(flightIdHash: Bytes): FlightSettled {
	const flightSettledEvent = changetype<FlightSettled>(newMockEvent());

	flightSettledEvent.parameters = [];

	flightSettledEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);

	return flightSettledEvent;
}

export function createInsurancePurchasedEvent(
	tokenId: BigInt,
	policyId: BigInt,
	buyer: Address,
): InsurancePurchased {
	const insurancePurchasedEvent = changetype<InsurancePurchased>(
		newMockEvent(),
	);

	insurancePurchasedEvent.parameters = [];

	insurancePurchasedEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);
	insurancePurchasedEvent.parameters.push(
		new ethereum.EventParam(
			"policyId",
			ethereum.Value.fromUnsignedBigInt(policyId),
		),
	);
	insurancePurchasedEvent.parameters.push(
		new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer)),
	);

	return insurancePurchasedEvent;
}

export function createOwnershipTransferredEvent(
	previousOwner: Address,
	newOwner: Address,
): OwnershipTransferred {
	const ownershipTransferredEvent = changetype<OwnershipTransferred>(
		newMockEvent(),
	);

	ownershipTransferredEvent.parameters = [];

	ownershipTransferredEvent.parameters.push(
		new ethereum.EventParam(
			"previousOwner",
			ethereum.Value.fromAddress(previousOwner),
		),
	);
	ownershipTransferredEvent.parameters.push(
		new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)),
	);

	return ownershipTransferredEvent;
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
	open: boolean,
): PolicyCreated {
	const policyCreatedEvent = changetype<PolicyCreated>(newMockEvent());

	policyCreatedEvent.parameters = [];

	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"policyId",
			ethereum.Value.fromUnsignedBigInt(policyId),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightNumber",
			ethereum.Value.fromString(flightNumber),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"departureDate",
			ethereum.Value.fromString(departureDate),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"delayMinutesThreshold",
			ethereum.Value.fromUnsignedBigInt(delayMinutesThreshold),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"expirationTimestamp",
			ethereum.Value.fromUnsignedBigInt(expirationTimestamp),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"payoutAmount",
			ethereum.Value.fromUnsignedBigInt(payoutAmount),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"inventory",
			ethereum.Value.fromUnsignedBigInt(inventory),
		),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)),
	);
	policyCreatedEvent.parameters.push(
		new ethereum.EventParam("open", ethereum.Value.fromBoolean(open)),
	);

	return policyCreatedEvent;
}

export function createPolicyStatusChangedEvent(
	policyId: BigInt,
	open: boolean,
): PolicyStatusChanged {
	const policyStatusChangedEvent = changetype<PolicyStatusChanged>(
		newMockEvent(),
	);

	policyStatusChangedEvent.parameters = [];

	policyStatusChangedEvent.parameters.push(
		new ethereum.EventParam(
			"policyId",
			ethereum.Value.fromUnsignedBigInt(policyId),
		),
	);
	policyStatusChangedEvent.parameters.push(
		new ethereum.EventParam("open", ethereum.Value.fromBoolean(open)),
	);

	return policyStatusChangedEvent;
}

export function createTokenListedEvent(
	tokenId: BigInt,
	price: BigInt,
): TokenListed {
	const tokenListedEvent = changetype<TokenListed>(newMockEvent());

	tokenListedEvent.parameters = [];

	tokenListedEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);
	tokenListedEvent.parameters.push(
		new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)),
	);

	return tokenListedEvent;
}

export function createTokenProcessedEvent(
	tokenId: BigInt,
	payoutAmount: BigInt,
): TokenProcessed {
	const tokenProcessedEvent = changetype<TokenProcessed>(newMockEvent());

	tokenProcessedEvent.parameters = [];

	tokenProcessedEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);
	tokenProcessedEvent.parameters.push(
		new ethereum.EventParam(
			"payoutAmount",
			ethereum.Value.fromUnsignedBigInt(payoutAmount),
		),
	);

	return tokenProcessedEvent;
}

export function createTokenPurchasedEvent(
	tokenId: BigInt,
	buyer: Address,
	price: BigInt,
): TokenPurchased {
	const tokenPurchasedEvent = changetype<TokenPurchased>(newMockEvent());

	tokenPurchasedEvent.parameters = [];

	tokenPurchasedEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);
	tokenPurchasedEvent.parameters.push(
		new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer)),
	);
	tokenPurchasedEvent.parameters.push(
		new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)),
	);

	return tokenPurchasedEvent;
}

export function createTokenUnlistedEvent(tokenId: BigInt): TokenUnlisted {
	const tokenUnlistedEvent = changetype<TokenUnlisted>(newMockEvent());

	tokenUnlistedEvent.parameters = [];

	tokenUnlistedEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);

	return tokenUnlistedEvent;
}

export function createTransferEvent(
	from: Address,
	to: Address,
	tokenId: BigInt,
): Transfer {
	const transferEvent = changetype<Transfer>(newMockEvent());

	transferEvent.parameters = [];

	transferEvent.parameters.push(
		new ethereum.EventParam("from", ethereum.Value.fromAddress(from)),
	);
	transferEvent.parameters.push(
		new ethereum.EventParam("to", ethereum.Value.fromAddress(to)),
	);
	transferEvent.parameters.push(
		new ethereum.EventParam(
			"tokenId",
			ethereum.Value.fromUnsignedBigInt(tokenId),
		),
	);

	return transferEvent;
}

export function createWithdrawalEvent(
	owner: Address,
	amount: BigInt,
): Withdrawal {
	const withdrawalEvent = changetype<Withdrawal>(newMockEvent());

	withdrawalEvent.parameters = [];

	withdrawalEvent.parameters.push(
		new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner)),
	);
	withdrawalEvent.parameters.push(
		new ethereum.EventParam(
			"amount",
			ethereum.Value.fromUnsignedBigInt(amount),
		),
	);

	return withdrawalEvent;
}
