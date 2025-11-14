// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
struct Request {
    bytes32 flightIdHash;
    bool fulfilled;
}
struct FlightData {
    string flightNumber;
    string flightDate;
    uint256 delayMinutes;
    bool fetched;
}   

interface IFlightDelay {

    function requestFlightDelay(
        uint64 subscriptionId,
        address requester,
       bytes32 flightIdHash
    ) external  returns (bytes32);

    function getFlightData(bytes32 flightIdHash) external view returns (FlightData memory);
    function insertFlightData(string memory flightNumber, string memory flightDate) external;
}