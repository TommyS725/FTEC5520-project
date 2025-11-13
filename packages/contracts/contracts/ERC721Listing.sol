// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Listing is ERC721 {

    mapping(uint256 => uint256) public tokenPrices; // tokenId => price in wei

    error TokenNotForSale(uint256 tokenId);
    error InvalidPaymentAmount(uint256 sent, uint256 required);
    error InvalidPrice(uint256 price);

    event TokenListed(uint256 indexed tokenId, uint256 price);
    event TokenUnlisted(uint256 indexed tokenId);
    event TokenPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function tokenListedPrice(uint256 tokenId) external view returns (uint256) {
        return tokenPrices[tokenId];
    }

    function listToken(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId)));
        require(price > 0, InvalidPrice(price));
        tokenPrices[tokenId] = price;
        emit TokenListed(tokenId, price);
    }

    function unlistToken(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId)));
        delete tokenPrices[tokenId];
        emit TokenUnlisted(tokenId);
    }

    function purchaseToken(uint256 tokenId) external payable {
        uint256 price = tokenPrices[tokenId];
        require(price > 0, TokenNotForSale(tokenId));
        require(msg.value == price, InvalidPaymentAmount(msg.value, price));

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(price);
        delete tokenPrices[tokenId];
        emit TokenPurchased(tokenId, msg.sender, price);
    }


}