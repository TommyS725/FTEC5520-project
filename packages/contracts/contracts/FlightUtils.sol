// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

library  FlightUtils {
    // unique identifier for flight  -> flight number + departure date e.g. "AA123-2023-10-15"
    function computeFlightId(string memory flightNumber, string memory flightDate) internal pure returns (bytes memory) {
        return abi.encodePacked(flightNumber, "-", flightDate);
    }
}