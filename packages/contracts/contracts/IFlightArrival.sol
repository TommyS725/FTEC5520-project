// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IFlightArrival {

    function requestArrivalTimestamp(
        uint64 subscriptionId,
        address requester,
        string memory flightNumber,
        string memory departureDate
    ) external  returns (bytes32);

    function requestArrivalTimestamp(
        uint64 subscriptionId,
        address requester,
        bytes memory flightId
    ) external  returns (bytes32);

    function getArrivalTimestamp(string memory flightNumber, string memory departureDate) external view returns (uint256);
    function getArrivalTimestamp(bytes32 flightIdHash) external view returns (uint256);
}