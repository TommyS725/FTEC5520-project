// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import  "./FlightUtils.sol";
import "./IFlightDelay.sol";
// unique identifier for flight arrivals -> flight number + departure date e.g. "AA123-20231015"

struct Request {
    address requester;
    bytes32 flightIdHash;
    bool fulfilled;
}



contract FlightDelay is FunctionsClient, ConfirmedOwner, IFlightDelay {
    using FunctionsRequest for FunctionsRequest.Request;

    mapping(address caller => bool allowed) callers;
    mapping(bytes32 requestId => Request) requests; 
    mapping(bytes32 flightIdHash =>  FlightData) flightDelays;
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
    error NotAuthorizedCaller();
    error InvalidRequestId();
    error RequestNotFulfilled();
    error RequestAlreadyPending();
    error FlightDataAlreadyAvailable();

    //events
    event RequestSent(bytes32 indexed requestId, address indexed requester, address indexed caller ,bytes flightId);
    event RequestFulfilled(bytes32 indexed requestId, address indexed requester, bytes32 indexed flightIdHash, uint256 delay);
    event RequestFailed(bytes32 indexed requestId, address indexed requester, bytes32 indexed flightIdHash, string errorMessage);


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

    function getFlightDelay(bytes32 flightIdHash) external view returns (FlightData memory) {
        return flightDelays[flightIdHash];
    }
    function getFlightDelay(string memory flightNumber, string memory flightDate) external view returns (FlightData memory) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, flightDate);
        bytes32 flightIdHash = keccak256(flightId);
        return flightDelays[flightIdHash];
    }

    function getRequestStatus(bytes32 requestId) external view returns (Request memory) {
    return requests[requestId];
}

    function _requestData(
        uint64 subscriptionId,
        address requester,
        string memory flightNumber,
        string memory flightDate 
    ) internal returns (bytes32) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, flightDate);
        bytes32 flightIdHash = keccak256(flightId);
        require(!flightDelays[flightIdHash].exists, FlightDataAlreadyAvailable());
        uint256 pendingTimestamp = pendingRequests[flightIdHash];
        require(pendingTimestamp == 0 || block.timestamp >= pendingTimestamp + WAITING_PERIOD, RequestAlreadyPending());

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
        string[] memory args = new string[](2);
        args[0] = flightNumber;
        args[1] = flightDate;
        req.setArgs(args); // Set the flightId as an argument to the JS code
        // Send the request and store the request ID
        bytes32 requestId  = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donID);
        requests[requestId] = Request({
            requester: requester,
            flightIdHash: keccak256(flightId),
            fulfilled: false
        });
        pendingRequests[flightIdHash] = block.timestamp;
        emit RequestSent(requestId, requester, msg.sender, flightId);
        return requestId;
    }

     function requestFlightDelay(
        uint64 subscriptionId,
        address requester,
        string memory flightNumber,
        string memory flightDate
    ) external onlyCallerOrOwner returns (bytes32) {
        bytes32 requestId = _requestData(subscriptionId, requester, flightNumber, flightDate);
        return requestId;
    }

   
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        Request storage req = requests[requestId];
        require(req.requester != address(0), InvalidRequestId());
        require(!req.fulfilled, RequestNotFulfilled());
        req.fulfilled = true;
        address requester = req.requester;
        bytes32 flightIdHash = req.flightIdHash;
        if(err.length > 0) {
            string memory errorMessage = string(err);
            emit RequestFailed(requestId, requester, flightIdHash, errorMessage);
        } else {
            uint256 delay = abi.decode(response, (uint256));
            flightDelays[flightIdHash] = FlightData({
                delayMinutes: delay,
                exists: true
            });
            emit RequestFulfilled(requestId, requester, flightIdHash, delay);
        }
    }
}