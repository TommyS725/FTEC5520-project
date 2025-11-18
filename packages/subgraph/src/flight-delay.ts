// biome-ignore lint/style/useImportType: <explanation>
import {
  FlightDataCreated as FlightDataCreatedEvent,
  FlightDataUpdated as FlightDataUpdatedEvent,
  FlightDelayError as FlightDelayErrorEvent,
  FlightDelayFulfilled as FlightDelayFulfilledEvent,
  FlightDelayRequested as FlightDelayRequestedEvent,
} from "../generated/FlightDelay/FlightDelay";
import { Flight } from "../generated/schema";

export function handleFlightDataCreated(event: FlightDataCreatedEvent): void {
  const flight = new Flight(event.params.flightIdHash.toHexString());
  flight.flightNumber = event.params.flightNumber;
  flight.flightDate = event.params.flightDate;
  flight.settled = false;
  flight.save();
}

export function handleFlightDataUpdated(event: FlightDataUpdatedEvent): void {
  const flight = Flight.load(event.params.flightIdHash.toHexString());
  if (flight) {
    flight.delay = event.params.fetched
      ? event.params.delayMinutes.toString()
      : null;
    flight.save();
  }
}

export function handleFlightDelayRequested(
  event: FlightDelayRequestedEvent
): void {
  const flight = Flight.load(event.params.flightIdHash.toHexString());
  if (flight) {
    flight.requestedAt = event.block.timestamp.toString();
    flight.save();
  }
}

export function handleFlightDelayFulfilled(
  event: FlightDelayFulfilledEvent
): void {
  const flight = Flight.load(event.params.flightIdHash.toHexString());
  if (flight) {
    flight.delay = event.params.delayMinutes.toString();
    flight.save();
  }
}

export function handleFlightDelayError(event: FlightDelayErrorEvent): void {
  const flight = Flight.load(event.params.flightIdHash.toHexString());
  if (flight) {
    flight.requestedAt = null;
    flight.save();
  }
}
