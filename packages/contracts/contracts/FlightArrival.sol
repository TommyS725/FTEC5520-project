// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import  "./FlightUtils.sol";
import "./IFlightArrival.sol";
// unique identifier for flight arrivals -> flight number + departure date e.g. "AA123-20231015"

struct Request {
    address requester;
    bytes32 flightIdHash;
}


contract FlightArrival is FunctionsClient, ConfirmedOwner, IFlightArrival {
    using FunctionsRequest for FunctionsRequest.Request;

    mapping(address caller => bool allowed) callers;
    mapping(bytes32 requestId => Request) requests; 
    mapping(bytes32 flightIdHash => uint256 arrivalTimestamp) flightArrivals;
    mapping(bytes32 flightIdHash => uint256 pendingRequestTimestamp) pendingRequests;

    //set by constructor, hardcoded depends on network
    address immutable router;
    bytes32 immutable donID;

    //todo: js code to handle request
    string source ="";

    uint32 gasLimit = 300_000;
    uint256 constant WAITING_PERIOD = 15 minutes;

    //errors
    error NotAuthorizedCaller();
    error InvalidRequestId();
    error RequestAlreadyPending();
    error FlightDataAlreadyAvailable();

    //events
    event RequestSent(bytes32 indexed requestId, address indexed requester, bytes flightId);
    event RequestFulfilled(bytes32 indexed requestId, address indexed requester, bytes32 indexed flightIdHash, uint256 arrivalTimestamp);
    event RequestFailed(bytes32 indexed requestId, address indexed requester, bytes32 indexed flightIdHash, string errorMessage);


    // modifiers
    modifier onlyCaller() {
        require(callers[msg.sender], NotAuthorizedCaller());
        _;
    }

    constructor(address _router, bytes32 _donID) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        router = _router;
        donID = _donID;
    }

    function setCaller(address caller, bool allowed) external onlyOwner {
        callers[caller] = allowed;
    }

    function getArrivalTimestamp(bytes32 flightIdHash) external view returns (uint256) {
        return flightArrivals[flightIdHash];
    }
    function getArrivalTimestamp(string memory flightNumber, string memory departureDate) external view returns (uint256) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        return flightArrivals[keccak256(flightId)];
    }

    function _requestData(
        uint64 subscriptionId,
        address requester,
        bytes memory flightId
    ) internal returns (bytes32) {
        bytes32 flightIdHash = keccak256(flightId);
        require(flightArrivals[flightIdHash] == 0, FlightDataAlreadyAvailable());
        uint256 pendingTimestamp = pendingRequests[flightIdHash];
        require(pendingTimestamp == 0 || block.timestamp >= pendingTimestamp + WAITING_PERIOD, RequestAlreadyPending());

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        string[] memory args = new string[](1);
        args[0] = string(flightId);
        req.setArgs(args); // Set the flightId as an argument to the JS code
        // Send the request and store the request ID
        bytes32 requestId  = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        requests[requestId] = Request({
            requester: requester,
            flightIdHash: keccak256(flightId)
        });
        pendingRequests[flightIdHash] = block.timestamp;
        emit RequestSent(requestId, requester, flightId);
        return requestId;
    }

    function requestArrivalTimestamp(
        uint64 subscriptionId,
        address requester,
        string memory flightNumber,
        string memory departureDate
    ) external onlyCaller returns (bytes32) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        bytes32 requestId = _requestData(subscriptionId, requester, flightId);
        return requestId;
    }

    function requestArrivalTimestamp(
        uint64 subscriptionId,
        address requester,
        bytes memory flightId
    ) external onlyCaller returns (bytes32) {
        bytes32 requestId = _requestData(subscriptionId, requester, flightId);
        return requestId;
    }

   
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if(requests[requestId].requester == address(0)) {
            revert InvalidRequestId();
        }
        address requester = requests[requestId].requester;
        bytes32 flightIdHash = requests[requestId].flightIdHash;
        delete requests[requestId];
        if(err.length > 0) {
            string memory errorMessage = string(err);
            emit RequestFailed(requestId, requester, flightIdHash, errorMessage);
        } else {
            uint256 arrivalTimestamp = abi.decode(response, (uint256));
            flightArrivals[flightIdHash] = arrivalTimestamp;
            delete pendingRequests[flightIdHash];
            emit RequestFulfilled(requestId, requester, flightIdHash, arrivalTimestamp);
        }
    }
}