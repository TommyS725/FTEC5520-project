import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
	afterAll,
	assert,
	beforeAll,
	clearStore,
	describe,
	test,
} from "matchstick-as/assembly/index";
import { FlightDataCreated } from "../generated/FlightDelay/FlightDelay";
import { ExampleEntity } from "../generated/schema";
import { handleFlightDataCreated } from "../src/flight-delay";
import { createFlightDataCreatedEvent } from "./flight-delay-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
	beforeAll(() => {
		const flightIdHash = Bytes.fromI32(1234567890);
		const flightNumber = "Example string value";
		const flightDate = "Example string value";
		const newFlightDataCreatedEvent = createFlightDataCreatedEvent(
			flightIdHash,
			flightNumber,
			flightDate,
		);
		handleFlightDataCreated(newFlightDataCreatedEvent);
	});

	afterAll(() => {
		clearStore();
	});

	// For more test scenarios, see:
	// https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

	test("ExampleEntity created and stored", () => {
		assert.entityCount("ExampleEntity", 1);

		// 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
		assert.fieldEquals(
			"ExampleEntity",
			"0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
			"flightIdHash",
			"1234567890",
		);
		assert.fieldEquals(
			"ExampleEntity",
			"0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
			"flightNumber",
			"Example string value",
		);
		assert.fieldEquals(
			"ExampleEntity",
			"0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
			"flightDate",
			"Example string value",
		);

		// More assert options:
		// https://thegraph.com/docs/en/developer/matchstick/#asserts
	});
});
