// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../ColorLoot.sol";

contract MockColorLoot is ColorLoot {

    uint _supply = 0;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    constructor(address dev)
        ColorLoot(dev)
    {}

    function setLoot(address lootAddress) public {
        lootContract = LootInterface(lootAddress);
    }

    function setAvatar(address avatarAddress) public {
        lootAvatarsContract = IERC721(avatarAddress);
    }

    function setTotalSupply(uint supply) public {
        _supply = supply;
    }

    function _totalSupply() internal view override returns (uint) {
        return _supply;
    }

    function _safeMint(address to, uint256 tokenId) internal override {
        setTokenOwner(tokenId, to);
        _balances[to] += 1;
        _supply += 1;
    }

    function mockMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function setTokenOwner(uint256 tokenId, address owner) public {
        _owners[tokenId] = owner;
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    function _exists(uint256 tokenId) internal view override returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }
}
