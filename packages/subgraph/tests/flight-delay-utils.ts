import {
	type Address,
	type BigInt,
	type Bytes,
	ethereum,
} from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import type {
	FlightDataCreated,
	FlightDataUpdated,
	FlightDelayError,
	FlightDelayFulfilled,
	FlightDelayRequested,
	OwnershipTransferRequested,
	OwnershipTransferred,
	RequestFulfilled,
	RequestSent,
} from "../generated/FlightDelay/FlightDelay";

export function createFlightDataCreatedEvent(
	flightIdHash: Bytes,
	flightNumber: string,
	flightDate: string,
): FlightDataCreated {
	const flightDataCreatedEvent = changetype<FlightDataCreated>(newMockEvent());

	flightDataCreatedEvent.parameters = [];

	flightDataCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);
	flightDataCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightNumber",
			ethereum.Value.fromString(flightNumber),
		),
	);
	flightDataCreatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightDate",
			ethereum.Value.fromString(flightDate),
		),
	);

	return flightDataCreatedEvent;
}

export function createFlightDataUpdatedEvent(
	flightIdHash: Bytes,
	delayMinutes: BigInt,
	fetched: boolean,
): FlightDataUpdated {
	const flightDataUpdatedEvent = changetype<FlightDataUpdated>(newMockEvent());

	flightDataUpdatedEvent.parameters = [];

	flightDataUpdatedEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);
	flightDataUpdatedEvent.parameters.push(
		new ethereum.EventParam(
			"delayMinutes",
			ethereum.Value.fromUnsignedBigInt(delayMinutes),
		),
	);
	flightDataUpdatedEvent.parameters.push(
		new ethereum.EventParam("fetched", ethereum.Value.fromBoolean(fetched)),
	);

	return flightDataUpdatedEvent;
}

export function createFlightDelayErrorEvent(
	requestId: Bytes,
	flightIdHash: Bytes,
	errorMessage: string,
): FlightDelayError {
	const flightDelayErrorEvent = changetype<FlightDelayError>(newMockEvent());

	flightDelayErrorEvent.parameters = [];

	flightDelayErrorEvent.parameters.push(
		new ethereum.EventParam(
			"requestId",
			ethereum.Value.fromFixedBytes(requestId),
		),
	);
	flightDelayErrorEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);
	flightDelayErrorEvent.parameters.push(
		new ethereum.EventParam(
			"errorMessage",
			ethereum.Value.fromString(errorMessage),
		),
	);

	return flightDelayErrorEvent;
}

export function createFlightDelayFulfilledEvent(
	requestId: Bytes,
	flightIdHash: Bytes,
	delayMinutes: BigInt,
): FlightDelayFulfilled {
	const flightDelayFulfilledEvent = changetype<FlightDelayFulfilled>(
		newMockEvent(),
	);

	flightDelayFulfilledEvent.parameters = [];

	flightDelayFulfilledEvent.parameters.push(
		new ethereum.EventParam(
			"requestId",
			ethereum.Value.fromFixedBytes(requestId),
		),
	);
	flightDelayFulfilledEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);
	flightDelayFulfilledEvent.parameters.push(
		new ethereum.EventParam(
			"delayMinutes",
			ethereum.Value.fromUnsignedBigInt(delayMinutes),
		),
	);

	return flightDelayFulfilledEvent;
}

export function createFlightDelayRequestedEvent(
	requestId: Bytes,
	caller: Address,
	requester: Address,
	flightIdHash: Bytes,
): FlightDelayRequested {
	const flightDelayRequestedEvent = changetype<FlightDelayRequested>(
		newMockEvent(),
	);

	flightDelayRequestedEvent.parameters = [];

	flightDelayRequestedEvent.parameters.push(
		new ethereum.EventParam(
			"requestId",
			ethereum.Value.fromFixedBytes(requestId),
		),
	);
	flightDelayRequestedEvent.parameters.push(
		new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller)),
	);
	flightDelayRequestedEvent.parameters.push(
		new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester)),
	);
	flightDelayRequestedEvent.parameters.push(
		new ethereum.EventParam(
			"flightIdHash",
			ethereum.Value.fromFixedBytes(flightIdHash),
		),
	);

	return flightDelayRequestedEvent;
}

export function createOwnershipTransferRequestedEvent(
	from: Address,
	to: Address,
): OwnershipTransferRequested {
	const ownershipTransferRequestedEvent =
		changetype<OwnershipTransferRequested>(newMockEvent());

	ownershipTransferRequestedEvent.parameters = [];

	ownershipTransferRequestedEvent.parameters.push(
		new ethereum.EventParam("from", ethereum.Value.fromAddress(from)),
	);
	ownershipTransferRequestedEvent.parameters.push(
		new ethereum.EventParam("to", ethereum.Value.fromAddress(to)),
	);

	return ownershipTransferRequestedEvent;
}

export function createOwnershipTransferredEvent(
	from: Address,
	to: Address,
): OwnershipTransferred {
	const ownershipTransferredEvent = changetype<OwnershipTransferred>(
		newMockEvent(),
	);

	ownershipTransferredEvent.parameters = [];

	ownershipTransferredEvent.parameters.push(
		new ethereum.EventParam("from", ethereum.Value.fromAddress(from)),
	);
	ownershipTransferredEvent.parameters.push(
		new ethereum.EventParam("to", ethereum.Value.fromAddress(to)),
	);

	return ownershipTransferredEvent;
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
	const requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent());

	requestFulfilledEvent.parameters = [];

	requestFulfilledEvent.parameters.push(
		new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id)),
	);

	return requestFulfilledEvent;
}

export function createRequestSentEvent(id: Bytes): RequestSent {
	const requestSentEvent = changetype<RequestSent>(newMockEvent());

	requestSentEvent.parameters = [];

	requestSentEvent.parameters.push(
		new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id)),
	);

	return requestSentEvent;
}
