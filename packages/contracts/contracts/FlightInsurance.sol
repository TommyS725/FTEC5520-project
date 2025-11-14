// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IFlightDelay.sol";
import "./FlightUtils.sol";
import "./ERC721Listing.sol";


struct InsurancePolicy {
    uint256 policyId;
    bytes32 flightIdHash;
    uint256 delayMinutesThreshold;
    uint256 expirationTimestamp;// timestamp when the policy expires, not available for purchase after this time
    uint256 payoutAmount;
    uint32 inventory;
    uint256 price;
    bool open; // is the policy open for purchase
}

struct FlightState {
    bool settled; // whether the flight has been settled
    uint256[] tokenIds; // list of tokenIds associated with this flight
}

contract FlightInsurance  is ERC721Listing, Ownable {
    uint256 public policyCounter;
    uint256 public tokenCounter;
    uint256 public requiredReserve; // total required reserve for all sold and active policies
    uint64 public  subscriptionId; //for chainlink functions
    IFlightDelay public immutable flightDelayContract;
    mapping(uint256 policyId => InsurancePolicy) public policies;
    mapping(uint256 tokenId => uint256 policyId) public tokenToPolicy;
    mapping(bytes32 flightIdHash => FlightState) public flightStates; 
    mapping(uint256 tokenId => bool) public tokenProcessed; // to prevent double payout/release
    mapping(address relayer => bool) public relayers; //relayers to settle flights

    //errors 
    error InsufficientContractBalance();
    error PayoutTooLow();
    error PolicyExpired();
    error InvalidPolicyState(bool expectedState);
    error InsufficientInventory();
    error FlightDataNotFetched(bytes32 flightIdHash);
    error FlightNotDelayed(uint256 tokenId);
    error TokenAlreadyProcessed(uint256 tokenId);
    error FlightAlreadySettled(bytes32 flightIdHash);
    error NotOwnerOrRelayer(address caller);
    error NoInsuranceForFlight(bytes32 flightIdHash);
    error InvalidFlightTokenRequest(uint256 tokenId, bytes32 flightIdHash);

    //events
    event PolicyCreated(
        uint256 indexed policyId,
        string flightNumber,
        string departureDate,
        bytes32 flightIdHash,
        uint256  delayMinutesThreshold,
        uint256 expirationTimestamp,
        uint256 payoutAmount,
        uint32 inventory,
        uint256 price,
        bool open
    );
    event PolicyStatusChanged(uint256 indexed policyId, bool open);
    event InsurancePurchased(uint256 indexed tokenId, uint256 indexed policyId, address indexed buyer);
    event TokenProcessed(uint256 indexed tokenId, uint256 payoutAmount);
    event FlightSettled(bytes32 indexed flightIdHash);
    event Withdrawal(address indexed owner, uint256 amount);

    modifier onlyOwnerOrRelayer() {
        if (msg.sender != owner() && !relayers[msg.sender]) {
            revert NotOwnerOrRelayer(msg.sender);
        }
        _;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
            revert ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId));
        }
        _;
    }


    constructor(address _flightDelayContract, uint64 _subscriptionId ) ERC721Listing("FlightInsurance", "FLI")  Ownable(msg.sender) {
        tokenCounter = 0;
        policyCounter = 0;
        requiredReserve = 0;
        flightDelayContract = IFlightDelay(_flightDelayContract);
        subscriptionId = _subscriptionId;
    }

    receive() external payable {}

    function _processToken(uint256 tokenId, bool isDelayed) internal {
        if (tokenProcessed[tokenId]) {
            revert TokenAlreadyProcessed(tokenId);
        }
        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];
        address tokenOwner = ownerOf(tokenId);
        uint256 payout = policy.payoutAmount;
        // CHECKS
        if (isDelayed) {
            require(address(this).balance >= payout, InsufficientContractBalance());
        }
        
        // EFFECTS
        requiredReserve -= payout;
        tokenProcessed[tokenId] = true;
        
        // INTERACTIONS
        if (isDelayed) {
            payable(tokenOwner).transfer(payout);
        }

        emit TokenProcessed(tokenId, isDelayed ? payout : 0);
    }

    function _requestFlightDelay(bytes32 flightIdHash) internal returns (bytes32) {
        //no need to check settled, as settled -> flight data already available, which is checked in FlightArrival
        require(flightStates[flightIdHash].tokenIds.length > 0, NoInsuranceForFlight(flightIdHash));
        //event is emitted in FlightArrival contract
        return flightDelayContract.requestFlightDelay(
            subscriptionId,
            msg.sender, 
            flightIdHash
        );

    }
    //getters
    function getPolicy(uint256 policyId) external view returns (InsurancePolicy memory) {
        return policies[policyId];
    }

    function getTokenPolicy(uint256 tokenId) external view returns (InsurancePolicy memory) {
        uint256 policyId = tokenToPolicy[tokenId];
        return policies[policyId];
    }

    function getFlightTokens(bytes32 flightIdHash) external view returns (uint256[] memory) {
        return flightStates[flightIdHash].tokenIds;
    }



    function setRelayer(address relayer, bool allowed) external onlyOwner {
        relayers[relayer] = allowed;
    }

    function setSubscriptionId(uint64 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }

    function createPolicy(
        string memory flightNumber,
        string memory departureDate,
        uint256 delayThreshold,
        uint256 expirationTimestamp,
        uint256 payoutAmount,
        uint32 inventory,
        uint256 price,
        bool open
    ) external onlyOwner returns (uint256) {
        require(payoutAmount > price, PayoutTooLow());
        policyCounter++;
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        bytes32 flightIdHash = keccak256(flightId);
        policies[policyCounter] = InsurancePolicy({
            policyId: policyCounter,
            flightIdHash: flightIdHash,
            delayMinutesThreshold: delayThreshold,
            expirationTimestamp: expirationTimestamp,
            payoutAmount: payoutAmount,
            inventory: inventory,
            price: price,
            open: open
        });
        FlightData memory fd = flightDelayContract.getFlightData(flightIdHash);
        bool dataExist = bytes(fd.flightNumber).length != 0 && bytes(fd.flightDate).length != 0;
        if(!dataExist) {
            //insert flight data if not exists
            flightDelayContract.insertFlightData(flightNumber, departureDate);
        }
        emit PolicyCreated(
            policyCounter,
            flightNumber,
            departureDate,
            flightIdHash,
            delayThreshold,
            expirationTimestamp,
            payoutAmount,
            inventory,
            price,
            open
        );
        return policyCounter;
    }

    function activatePolicy(uint256 policyId) external onlyOwner payable {
        InsurancePolicy storage policy = policies[policyId];
        require(!policy.open, InvalidPolicyState(false));
        require(block.timestamp < policy.expirationTimestamp, PolicyExpired());
        require(policy.inventory > 0, InsufficientInventory());
        policy.open = true;
        emit PolicyStatusChanged(policyId, true);
    }

    function deactivatePolicy(uint256 policyId) external onlyOwner {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.open, InvalidPolicyState(true));
        policy.open = false;
        emit PolicyStatusChanged(policyId, false);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= requiredReserve + amount, InsufficientContractBalance());
        payable(owner()).transfer(amount);
        emit Withdrawal(owner(), amount);
    }
    
    function requestFlightDataByFlight(string memory flightNumber, string memory departureDate) external onlyOwnerOrRelayer returns (bytes32) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        bytes32 flightIdHash = keccak256(flightId);
        return _requestFlightDelay(flightIdHash);
    }

    function settleFlight(bytes32 flightIdHash) external onlyOwnerOrRelayer  {
        FlightState storage flightState = flightStates[flightIdHash];
        uint256[] memory tokenIds = flightState.tokenIds;
        if( flightState.settled) {
            revert FlightAlreadySettled(flightIdHash);
        }
        if(tokenIds.length == 0) {
            revert NoInsuranceForFlight(flightIdHash);
        }
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if( tokenProcessed[tokenId]) {
                continue; //skip already processed tokens
            }
            uint256 policyId = tokenToPolicy[tokenId];
            InsurancePolicy storage policy = policies[policyId];
            FlightData memory flightData = flightDelayContract.getFlightData(policy.flightIdHash);
            if (!flightData.fetched) {
                revert FlightDataNotFetched(flightIdHash);
            }
            _processToken(tokenId, flightData.delayMinutes >= policy.delayMinutesThreshold);
        }
        flightState.settled = true;
        emit FlightSettled(flightIdHash);
    }


    function purchaseInsurance(uint256 policyId) external payable {
        InsurancePolicy storage policy = policies[policyId];
        FlightState storage flightState = flightStates[policy.flightIdHash];

         // CHECKS
        require(policy.open, InvalidPolicyState(true));
        require(block.timestamp < policy.expirationTimestamp, PolicyExpired());
        require(policy.inventory > 0, InsufficientInventory());
        require(msg.value == policy.price, InvalidPaymentAmount(msg.value, policy.price));
        require(address(this).balance >= requiredReserve + policy.payoutAmount, InsufficientContractBalance());
        require(!flightState.settled, FlightAlreadySettled(policy.flightIdHash));

        // Mint NFT to buyer
        tokenCounter++;
        _mint(msg.sender, tokenCounter);
        tokenToPolicy[tokenCounter] = policyId;
        flightState.tokenIds.push(tokenCounter);

        // Decrease inventory
        policy.inventory--;

        // Update required reserve
        requiredReserve  += policy.payoutAmount;
        emit InsurancePurchased(tokenCounter, policyId, msg.sender);
    }

    function claimPayout(uint256 tokenId) external  onlyTokenOwner(tokenId) {

        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];

        FlightData memory flightData = flightDelayContract.getFlightData(policy.flightIdHash);
        if (!flightData.fetched) {
            revert FlightDataNotFetched(policy.flightIdHash);
        }

        if (flightData.delayMinutes < policy.delayMinutesThreshold) {
            revert FlightNotDelayed(tokenId);
        }
        _processToken(tokenId, true);
    }

    function tokenOwnerRequestFlightData(uint256 tokenId) onlyTokenOwner(tokenId) external returns (bytes32) {
        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];
        return _requestFlightDelay(policy.flightIdHash);
    }
    


}