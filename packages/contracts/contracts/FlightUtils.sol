// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

library  FlightUtils {
    // unique identifier for flight  -> flight number + departure date e.g. "AA123-20231015"
    function computeFlightId(string memory flightNumber, string memory departureDate) internal pure returns (bytes memory) {
        return abi.encodePacked(flightNumber, "-", departureDate);
    }

    function isDelayed(uint256 expectedArrival, uint256 actualArrival, uint256 delayThreshold) internal pure returns (bool) {
        if (actualArrival >= expectedArrival + delayThreshold) {
            return true;
        }
        return false;
    }
}