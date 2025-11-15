import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { FlightDataCreated } from "../generated/schema"
import { FlightDataCreated as FlightDataCreatedEvent } from "../generated/FlightDelay/FlightDelay"
import { handleFlightDataCreated } from "../src/flight-delay"
import { createFlightDataCreatedEvent } from "./flight-delay-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let flightIdHash = Bytes.fromI32(1234567890)
    let flightNumber = "Example string value"
    let flightDate = "Example string value"
    let newFlightDataCreatedEvent = createFlightDataCreatedEvent(
      flightIdHash,
      flightNumber,
      flightDate
    )
    handleFlightDataCreated(newFlightDataCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FlightDataCreated created and stored", () => {
    assert.entityCount("FlightDataCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FlightDataCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "flightIdHash",
      "1234567890"
    )
    assert.fieldEquals(
      "FlightDataCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "flightNumber",
      "Example string value"
    )
    assert.fieldEquals(
      "FlightDataCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "flightDate",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
