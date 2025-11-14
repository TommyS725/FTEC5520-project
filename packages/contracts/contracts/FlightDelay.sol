// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import  "./FlightUtils.sol";
import "./IFlightDelay.sol";
// unique identifier for flight arrivals -> flight number + departure date e.g. "AA123-20231015"




contract FlightDelay is FunctionsClient, ConfirmedOwner, IFlightDelay {
    using FunctionsRequest for FunctionsRequest.Request;

    mapping(address caller => bool allowed) callers;
    mapping(bytes32 requestId => Request) requests; 
    mapping(bytes32 flightIdHash =>  FlightData) flightData;
    mapping(bytes32 flightIdHash => uint256 pendingRequestTimestamp) pendingRequests;

    //set by constructor, hardcoded depends on network
    address immutable router;
    bytes32 immutable donID;

   string public source = "if (!args[0] || !args[1]) {"
    "  throw new Error('Missing required parameters: flight number and date');"
    "}"
    ""
    "const flightNumber = args[0].toString().trim();"
    "const flightDate = args[1].toString().trim();"
    ""
    "if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(flightDate)) {"
    "  throw new Error('Date must be in YYYY-MM-DD format');"
    "}"
    ""
    "try {"
    "  const apiResponse = await Functions.makeHttpRequest({"
    "    url: `https://mock-flight-data-provider-26873425964.asia-east1.run.app/flight/${flightNumber}/${flightDate}`,"
    "  });"
    ""
    "  if (apiResponse.error) {"
    "    throw new Error(`API request failed: ${apiResponse.error}`);"
    "  }"
    ""
    "  if (apiResponse.status !== 200) {"
    "    throw new Error(`API returned status ${apiResponse.status}`);"
    "  }"
    ""
    "  const { data } = apiResponse;"
    "  if (!data) {"
    "    throw new Error('Invalid API response - data missing');"
    "  }"
    "  "
    "  const delay = parseInt(data.delay ?? 0);"
    "  if (isNaN(delay)) {"
    "    throw new Error('Delay value is not a valid number');"
    "  }"
    ""
    "  if (delay < 0) {"
    "    throw new Error('Negative Delay: ' + delay);"
    "  }"
    ""
    "  return Functions.encodeUint256(delay);"
    ""
    "} catch (error) {"
    "  throw new Error(`Failed to fetch flight delay: ${error.message}`);"
    "}";

    uint32 gasLimit = 300_000;
    uint256 constant WAITING_PERIOD = 15 minutes;

    //errors
    error MissingFlightData();
    error NotAuthorizedCaller();
    error InvalidRequestId();
    error RequestNotFulfilled();
    error RequestAlreadyPending();
    error FlightDataAlreadyFetched();
    error FlightDataAlreadyExists();

    //events
    event FlightDataCreated(bytes32 indexed flightIdHash, string flightNumber, string flightDate);
    event FlightDataUpdated(bytes32 indexed flightIdHash, uint256 delayMinutes, bool fetched);
    event FlightDelayRequested(bytes32 indexed requestId,address caller ,address indexed requester, bytes32 indexed flightIdHash);
    event FlightDelayFulfilled(bytes32 indexed requestId, bytes32 indexed flightIdHash, uint256 delayMinutes);
    event FlightDelayError(bytes32 indexed requestId, bytes32 indexed flightIdHash, string errorMessage);
    


    // modifiers
    modifier onlyCallerOrOwner() {
        require(callers[msg.sender] || msg.sender == owner(), NotAuthorizedCaller());
        _;
    }

    constructor(address _router, bytes32 _donID) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        router = _router;
        donID = _donID;
    }

    function setCaller(address caller, bool allowed) external onlyOwner {
        callers[caller] = allowed;
    }

    function setSource(string memory jsSource) external onlyOwner {
        source = jsSource;
    }

    function setGasLimit(uint32 _gasLimit) external onlyOwner {
        gasLimit = _gasLimit;
    }


    //force set flight data (for testing or manual overrides)
    function setFlightData(string memory flightNumber, string memory flightDate, uint256 delayMinutes, bool fetched ) external onlyOwner {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, flightDate);
        bytes32 flightIdHash = keccak256(flightId);
        flightData[flightIdHash] = FlightData({
            flightNumber: flightNumber,
            flightDate: flightDate,
            fetched: fetched,
            delayMinutes: fetched? delayMinutes : 0
        });
        emit FlightDataUpdated(flightIdHash, delayMinutes, fetched);
    }

    function insertFlightData(string memory flightNumber, string memory flightDate) external onlyCallerOrOwner {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, flightDate);
        bytes32 flightIdHash = keccak256(flightId);
        if (bytes(flightData[flightIdHash].flightNumber).length != 0) {
            revert FlightDataAlreadyExists();
        }
        flightData[flightIdHash] = FlightData({
            flightNumber: flightNumber,
            flightDate: flightDate,
            delayMinutes: 0,
            fetched: false
        });
        emit FlightDataCreated(flightIdHash, flightNumber, flightDate);
    }

    function getFlightData(bytes32 flightIdHash) external view returns (FlightData memory) {
        return flightData[flightIdHash];
    }

    function getRequestStatus(bytes32 requestId) external view returns (Request memory) {
        return requests[requestId];
    }

    function getFlightIdHash(string memory flightNumber, string memory flightDate) external pure returns (bytes32) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, flightDate);
        return keccak256(flightId);
    }

    function _requestData(
        uint64 subscriptionId,
        address requester,
        bytes32 flightIdHash
    ) internal returns (bytes32) {
        FlightData memory fd = flightData[flightIdHash];
        require(bytes(fd.flightNumber).length > 0 && bytes(fd.flightDate).length > 0, MissingFlightData());
        require(!fd.fetched, FlightDataAlreadyFetched());
        uint256 pendingTimestamp = pendingRequests[flightIdHash];
        require(pendingTimestamp == 0 || block.timestamp >= pendingTimestamp + WAITING_PERIOD, RequestAlreadyPending());

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        string[] memory args = new string[](2);
        args[0] = fd.flightNumber;
        args[1] = fd.flightDate;
        req.setArgs(args); // Set the flightId as an argument to the JS code
        // Send the request and store the request ID
        bytes32 requestId  = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        emit FlightDelayRequested(requestId, msg.sender,requester, flightIdHash);
        requests[requestId] = Request({
            flightIdHash: flightIdHash,
            fulfilled: false
        });
        pendingRequests[flightIdHash] = block.timestamp;
        return requestId;
    }

     function requestFlightDelay(
        uint64 subscriptionId,
        address requester,
        bytes32 flightIdHash
    ) external onlyCallerOrOwner returns (bytes32) {
        bytes32 requestId = _requestData(subscriptionId, requester, flightIdHash);
        return requestId;
    }

   
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        Request storage req = requests[requestId];
        FlightData storage fd = flightData[req.flightIdHash];
        require(!req.fulfilled, RequestNotFulfilled());
        req.fulfilled = true;
        bytes32 flightIdHash = req.flightIdHash;
        if(err.length > 0) {
            string memory errorMessage = string(err);
            emit FlightDelayError(requestId, flightIdHash, errorMessage);
        } else {
            uint256 delay = abi.decode(response, (uint256));
            fd.delayMinutes = delay;
            fd.fetched = true;
            emit FlightDelayFulfilled(requestId, flightIdHash, delay);
        }
    }
}