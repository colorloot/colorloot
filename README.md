# Color Loot (a.k.a cloot)

Color Loot provides rarity data on chain to Loot.

Contracts can access Loot rarity of Loot on chain now.

Color Loot does not create another Loot, it is an extension to Loot.

[Etherscan](https://etherscan.io/address/0xab7f42a1a64f0f54d5428ab5e1243785bce3fcb3)
[OpenSea](https://opensea.io/collection/colorloot)

## Why is Color Loot useful?

The Loot community is working hard to create exciting features to Loot, one of the important tools
is Loot Rarity.

There are many awesome projects provide off-chain tools for Loot Rarity, i.e. chrome plugin, svg enhancement, JS SDK, users and developers can
use them to check how rarity a Loot is and show different colors in SVG for each rarity, i.e. Common, Uncommon, Rare, Epic, Legendary, Mythic.

However, all the tools are off-chain, contracts cannot access Loot rarity on chain, the rarity data of Loot is really useful, i.e. games building upon Loot want to get the power of Loot items which depend on the rarity of each item, yield farming contracts want to calculate the power of a Loot token, and so on.

What Color Loot provides is the On-Chain rarity data to Loot, contracts can access Loot Rarity from Color Loot contract with the same token id to Loot.

For each Loot token, we create corresponding Color Loot token to it. When the total supply of Color Loot is equal to Loot (currently 7,779), Color Loot will return the exact rarity of Loot. Rarity data will change when new Color Loot minted. The total supply of Color Loot is equal to OG Loot, which is 8,000.

## How to mint Color Loot

* Max Supply: 8000
* Max Mint Num: 20
* Mint Price: free for OG Loot and LootAvatars holders, public mint price is 0.05Ξ.

For OG Loot, please use `mintWithLoot` or `multiMintWithLoots` on etherscan, input your Loot id(s).

For LootAvatars, please use `mintWithAvatar` or `multiMintWithAvatars` on etherscan, input your LootAvatars id(s).

For public mint, please use `mint` or `multiMint` on etherscan, input the price, each token with price 0.05Ξ.

## Developr Guide

Access Loot rarity data from Color Loot:

### Get item name of Loot

Color Loot implements the same interfaces of Loot, contracts can access get each itam name from Color Loot in the same way as Loot:

```
function getWeapon(uint256 tokenId) public view returns (string memory);
function getChest(uint256 tokenId) public view returns (string memory);
function getHead(uint256 tokenId) public view returns (string memory);
function getWaist(uint256 tokenId) public view returns (string memory);
function getFoot(uint256 tokenId) public view returns (string memory);
function getHand(uint256 tokenId) public view returns (string memory);
function getNeck(uint256 tokenId) public view returns (string memory);
function getRing(uint256 tokenId) public view returns (string memory);
```

Color Loot also provides method to get all item names in one call:
```
function itemNames(uint256 tokenId) public view returns (ItemNames memory);
```
```
struct ItemNames {
    string weapon;
    string chest;
    string head;
    string waist;
    string foot;
    string hand;
    string neck;
    string ring;
}
```

### Get rarity data

Please be aware that the rarity data will change until the total supply of Color Loot is equal to Loot.

#### Get item rarity

Contracts can get rariry by item name, for example, if you want to access weapon rarity of Loot tokenId 1, use following code:

```
ItemRarity rarity = colorLootContract.getItemRarity(colorLootContract.getWeapon(1));
```

`ItemRarity` is defined as following:
```
struct ItemRarity {
    uint256 occurrence; // occurrence of the item name
    uint256 threshold; // threshold of occurrences in current level
    string color; // predefined color, i.e. #ff44b7
    string level; // Common, Uncommon, Rare, Epic, Legendary, Mythic
}
```

#### Get item rarities

Color Loot also provides method to get all items rarity of loot in one call:

```
ItemRarities rarities = colorLootContract.getItemRarities(1);
```

where `ItemRarities` is defined as following:
```
struct ItemRarities {
    ItemRarity weapon;
    ItemRarity chest;
    ItemRarity head;
    ItemRarity waist;
    ItemRarity foot;
    ItemRarity hand;
    ItemRarity neck;
    ItemRarity ring;
}
```

#### Get occurrence of a item

Get the occurrence of a item name, for example, if you want to get the occurrnce of a weapon name:

```
uint256 occurrence = colorLootContract.getOccurrence(colorLootContract.getWeapon(1));
```

the occurrence value counts the num of the item in the total supply, you can calculate the rarity percentage by `occurrence.div(colorLootContract.totalSupply())`.
