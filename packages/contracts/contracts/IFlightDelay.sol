// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

struct FlightData {
    uint256 delayMinutes;
    bool exists;
}   

interface IFlightDelay {

    function requestFlightDelay(
        uint64 subscriptionId,
        address requester,
        string memory flightNumber,
        string memory flightDate
    ) external  returns (bytes32);

    function getFlightDelay(string memory flightNumber, string memory flightDate) external view returns (FlightData memory);
    function getFlightDelay(bytes32 flightIdHash) external view returns (FlightData memory);
}