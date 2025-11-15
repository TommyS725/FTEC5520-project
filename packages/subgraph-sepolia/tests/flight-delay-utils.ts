import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FlightDataCreated,
  FlightDataUpdated,
  FlightDelayError,
  FlightDelayFulfilled,
  FlightDelayRequested,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent
} from "../generated/FlightDelay/FlightDelay"

export function createFlightDataCreatedEvent(
  flightIdHash: Bytes,
  flightNumber: string,
  flightDate: string
): FlightDataCreated {
  let flightDataCreatedEvent = changetype<FlightDataCreated>(newMockEvent())

  flightDataCreatedEvent.parameters = new Array()

  flightDataCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )
  flightDataCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "flightNumber",
      ethereum.Value.fromString(flightNumber)
    )
  )
  flightDataCreatedEvent.parameters.push(
    new ethereum.EventParam("flightDate", ethereum.Value.fromString(flightDate))
  )

  return flightDataCreatedEvent
}

export function createFlightDataUpdatedEvent(
  flightIdHash: Bytes,
  delayMinutes: BigInt,
  fetched: boolean
): FlightDataUpdated {
  let flightDataUpdatedEvent = changetype<FlightDataUpdated>(newMockEvent())

  flightDataUpdatedEvent.parameters = new Array()

  flightDataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )
  flightDataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "delayMinutes",
      ethereum.Value.fromUnsignedBigInt(delayMinutes)
    )
  )
  flightDataUpdatedEvent.parameters.push(
    new ethereum.EventParam("fetched", ethereum.Value.fromBoolean(fetched))
  )

  return flightDataUpdatedEvent
}

export function createFlightDelayErrorEvent(
  requestId: Bytes,
  flightIdHash: Bytes,
  errorMessage: string
): FlightDelayError {
  let flightDelayErrorEvent = changetype<FlightDelayError>(newMockEvent())

  flightDelayErrorEvent.parameters = new Array()

  flightDelayErrorEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  flightDelayErrorEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )
  flightDelayErrorEvent.parameters.push(
    new ethereum.EventParam(
      "errorMessage",
      ethereum.Value.fromString(errorMessage)
    )
  )

  return flightDelayErrorEvent
}

export function createFlightDelayFulfilledEvent(
  requestId: Bytes,
  flightIdHash: Bytes,
  delayMinutes: BigInt
): FlightDelayFulfilled {
  let flightDelayFulfilledEvent = changetype<FlightDelayFulfilled>(
    newMockEvent()
  )

  flightDelayFulfilledEvent.parameters = new Array()

  flightDelayFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  flightDelayFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )
  flightDelayFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "delayMinutes",
      ethereum.Value.fromUnsignedBigInt(delayMinutes)
    )
  )

  return flightDelayFulfilledEvent
}

export function createFlightDelayRequestedEvent(
  requestId: Bytes,
  caller: Address,
  requester: Address,
  flightIdHash: Bytes
): FlightDelayRequested {
  let flightDelayRequestedEvent = changetype<FlightDelayRequested>(
    newMockEvent()
  )

  flightDelayRequestedEvent.parameters = new Array()

  flightDelayRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  flightDelayRequestedEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  flightDelayRequestedEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  flightDelayRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "flightIdHash",
      ethereum.Value.fromFixedBytes(flightIdHash)
    )
  )

  return flightDelayRequestedEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent = changetype<OwnershipTransferRequested>(
    newMockEvent()
  )

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}
