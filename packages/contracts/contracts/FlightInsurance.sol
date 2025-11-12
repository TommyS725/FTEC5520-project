// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IFlightArrival.sol";
import "./FlightUtils.sol";
import "./ERC721Listing.sol";


struct InsurancePolicy {
    uint256 policyId;
    bytes32 flightIdHash;
    uint256 expectedArrival;
    uint256 delayThreshold; // in seconds
    uint256 expirationTimestamp;// timestamp when the policy expires, not available for purchase after this time
    uint256 payoutAmount;
    uint32 inventory;
    uint256 price;
    bool open; // is the policy open for purchase
}

contract FlightInsurance  is ERC721Listing, Ownable {
    uint256 public policyCounter;
    uint256 public tokenCounter;
    uint256 public requiredReserve; // total required reserve for all sold and active policies
    uint64 public  subscriptionId; //for chainlink functions
    IFlightArrival public immutable flightArrivalContract;
    mapping(uint256 policyId => InsurancePolicy) public policies;
    mapping(uint256 tokenId => uint256 policyId) public tokenToPolicy;
    mapping(bytes32 flightIdHash => uint256[]) public flightIdToTokenIds; //for settlement tracking
    mapping(bytes32 flightIdHash => bool) settledFlights; // to prevent double settlement
    mapping(uint256 tokenId => bool) public tokenProcessed; // to prevent double payout/release
    mapping(address relayer => bool) public relayers;

    //errors 
    error InsufficientContractBalance();
    error PayoutTooLow();
    error PolicyExpired();
    error InvalidPolicyState(bool expectedState);
    error InsufficientInventory();
    error ArrivalTimeNotAvailable(uint256 tokenId);
    error FlightNotDelayed(uint256 tokenId);
    error TokenAlreadyProcessed(uint256 tokenId);
    error FlightAlreadySettled(bytes32 flightIdHash);
    error NotOwnerOrRelayer(address caller);
    error NoInsuranceForFlight(bytes32 flightIdHash);
    error InvalidFlightTokenRequest(uint256 tokenId, bytes32 flightIdHash);

    //events
    event PolicyCreated(uint256 indexed policyId, string flightNumber, string departureDate, 
    uint256 expectedArrival, uint256 delayThreshold, uint256 expirationTimestamp, 
    uint256 payoutAmount, uint32 inventory, uint256 price, bool open);
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


    constructor(address _flightArrivalContract, uint64 _subscriptionId ) ERC721Listing("FlightInsurance", "FLI")  Ownable(msg.sender) {
        tokenCounter = 0;
        policyCounter = 0;
        requiredReserve = 0;
        flightArrivalContract = IFlightArrival(_flightArrivalContract);
        subscriptionId = _subscriptionId;
    }

    receive() external payable {}

    function _processToken(uint256 tokenId, bool isDelayed) internal {
        if (tokenProcessed[tokenId]) {
            revert TokenAlreadyProcessed(tokenId);
        }
        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];
        if (isDelayed) {
            // Payout
            require(address(this).balance >= policy.payoutAmount, InsufficientContractBalance());
            payable(ownerOf(tokenId)).transfer(policy.payoutAmount);
        }
        //release reserve
        requiredReserve -= policy.payoutAmount;
        tokenProcessed[tokenId] = true;

        emit TokenProcessed(tokenId, isDelayed ? policy.payoutAmount : 0);
    }

    function _requestFlightArrivalTimestamp(bytes memory flightId) internal returns (bytes32) {
        bytes32 idHash = keccak256(flightId);
        //no need to check settled, as settled -> flight data already available, which is checked in FlightArrival
        require(flightIdToTokenIds[idHash].length > 0, NoInsuranceForFlight(idHash));
        //event is emitted in FlightArrival contract
        return flightArrivalContract.requestArrivalTimestamp(
            subscriptionId,
            msg.sender,
            flightId
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
        return flightIdToTokenIds[flightIdHash];
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
        uint256 expectedArrival,
        uint256 delayThreshold,
        uint256 expirationTimestamp,
        uint256 payoutAmount,
        uint32 inventory,
        uint256 price,
        bool open
    ) external payable onlyOwner returns (uint256) {
        require(payoutAmount > price, PayoutTooLow());
        policyCounter++;
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        bytes32 flightIdHash = keccak256(flightId);
        policies[policyCounter] = InsurancePolicy({
            policyId: policyCounter,
            flightIdHash: flightIdHash,
            expectedArrival: expectedArrival,
            delayThreshold: delayThreshold,
            expirationTimestamp: expirationTimestamp,
            payoutAmount: payoutAmount,
            inventory: inventory,
            price: price,
            open:  open
        });
        emit PolicyCreated(policyCounter, flightNumber, departureDate, expectedArrival,
        delayThreshold, expirationTimestamp, payoutAmount, inventory, price, open);
        return policyCounter;
    }

    function activatePolicy(uint256 policyId) external onlyOwner payable {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.open, InvalidPolicyState(true));
        require(block.timestamp < policy.expirationTimestamp, PolicyExpired());
        require(policy.inventory > 0, InsufficientInventory());
        policy.open = true;
        emit PolicyStatusChanged(policyId, true);
    }

    function deactivatePolicy(uint256 policyId) external onlyOwner {
        InsurancePolicy storage policy = policies[policyId];
        require(!policy.open, InvalidPolicyState(false));
        policy.open = false;
        emit PolicyStatusChanged(policyId, false);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance - amount >= requiredReserve, InsufficientContractBalance());
        payable(owner()).transfer(amount);
        emit Withdrawal(owner(), amount);
    }
    
    function requestFlightDataByFlight(string memory flightNumber, string memory departureDate) external onlyOwnerOrRelayer returns (bytes32) {
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        return _requestFlightArrivalTimestamp(flightId);
    }

    function settleFlight(bytes32 flightIdHash) external onlyOwnerOrRelayer  {
        require(!settledFlights[flightIdHash], FlightAlreadySettled(flightIdHash));
        uint256[] storage tokenIds = flightIdToTokenIds[flightIdHash];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            if( tokenProcessed[tokenId]) {
                continue; //skip already processed tokens
            }
            uint256 policyId = tokenToPolicy[tokenId];
            InsurancePolicy storage policy = policies[policyId];

            uint256 arrivalTimestamp = flightArrivalContract.getArrivalTimestamp(flightIdHash);
            if (arrivalTimestamp == 0) {
                revert ArrivalTimeNotAvailable(tokenId);
            }

            bool isDelayed = FlightUtils.isDelayed(policy.expectedArrival, arrivalTimestamp, policy.delayThreshold);
            _processToken(tokenId, isDelayed);
        }
        settledFlights[flightIdHash] = true;
        emit FlightSettled(flightIdHash);
    }


    function purchaseInsurance(uint256 policyId) external payable {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.open, InvalidPolicyState(true));
        require(block.timestamp < policy.expirationTimestamp, PolicyExpired());
        require(policy.inventory > 0, InsufficientInventory());
        require(msg.value == policy.price, InvalidPaymentAmount(msg.value, policy.price));
        require(!settledFlights[policy.flightIdHash], FlightAlreadySettled(policy.flightIdHash));
        require(address(this).balance >= requiredReserve + policy.payoutAmount, InsufficientContractBalance());

        // Mint NFT to buyer
        tokenCounter++;
        _mint(msg.sender, tokenCounter);
        tokenToPolicy[tokenCounter] = policyId;
        flightIdToTokenIds[policy.flightIdHash].push(tokenCounter);

        // Decrease inventory
        policy.inventory--;

        // Update required reserve
        requiredReserve  += policy.payoutAmount;
        emit InsurancePurchased(tokenCounter, policyId, msg.sender);
    }

    function claimPayout(uint256 tokenId) external  onlyTokenOwner(tokenId) {

        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];

        uint256 arrivalTimestamp = flightArrivalContract.getArrivalTimestamp(policy.flightIdHash);
        if (arrivalTimestamp == 0) {
            revert ArrivalTimeNotAvailable(tokenId);
        }

        if (!FlightUtils.isDelayed(policy.expectedArrival, arrivalTimestamp, policy.delayThreshold)) {
            revert FlightNotDelayed(tokenId);
        }
        _processToken(tokenId, true);
    }

    function tokenOwnerRequestFlightData(uint256 tokenId, string memory flightNumber, string memory departureDate) onlyTokenOwner(tokenId) external returns (bytes32) {
        uint256 policyId = tokenToPolicy[tokenId];
        InsurancePolicy storage policy = policies[policyId];
        bytes memory flightId = FlightUtils.computeFlightId(flightNumber, departureDate);
        bytes32 flightIdHash = keccak256(flightId);
        if (policy.flightIdHash != flightIdHash) {
            revert InvalidFlightTokenRequest(tokenId, flightIdHash);
        }
        return _requestFlightArrivalTimestamp(flightId);
    }
    


}