import { ethers } from "hardhat";
import { expect } from "chai";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "@ethersproject/bignumber";

chai.use(solidity);

describe("ColorLoot", async () => {
  before(async function() {
    this.signers = await ethers.getSigners();
    this.deployer = this.signers[0];
    this.user = this.signers[1];
    this.user2 = this.signers[2];
    this.user3 = this.signers[3];
    this.zeroAddress = "0x0000000000000000000000000000000000000000";

    this.ColorLoot = await ethers.getContractFactory("ColorLoot");
    this.deployMockAvatars = async function() {
      this.MockLoot = await ethers.getContractFactory("MockLoot");
      this.loot = await this.MockLoot.deploy();
      console.log("MockLoot deployed at", this.loot.address);

      this.MockAvatars = await ethers.getContractFactory("MockAvatars");
      this.avatars = await this.MockAvatars.deploy();
      console.log("MockAvatars deployed at", this.avatars.address);

      this.MockColorLoot = await ethers.getContractFactory("MockColorLoot");
      this.mockCloot = await this.MockColorLoot.deploy(this.user2.address);
      await this.mockCloot.setLoot(this.loot.address);
      await this.mockCloot.setAvatar(this.avatars.address);
    };

    this.assertItemRarity = function(rarity: any, occurrence: BigNumber, threshold: BigNumber, color: string, level: string) {
      expect(rarity.occurrence).to.equal(occurrence);
      expect(rarity.threshold).to.equal(threshold);
      expect(rarity.color).to.equal(color);
      expect(rarity.level).to.equal(level);
    }
  });

  beforeEach(async function() {
    this.cloot = await this.ColorLoot.deploy(this.user2.address);
    console.log("ColorLoot deployed at", this.cloot.address);
  });

  describe("Mint", function() {
    it("Should success for public mint", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await expect(this.mockCloot.connect(this.user).mint({
        value: ethers.utils.parseEther("0.05")
      })).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(1);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");
      const itemRarity = await this.mockCloot.getItemRarity(
        await this.mockCloot.getWeapon(1));
        this.assertItemRarity(itemRarity, 1, 1, "#ff44b7", "Mythic");
    });

    it("Should success for public mul mint", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await this.loot.mint(this.user2.address, 2);
      await this.loot.mint(this.user2.address, 3);
      await expect(this.mockCloot.connect(this.user).multiMint(3, {
        value: ethers.utils.parseEther("0.15")
      })).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(3);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      const itemNames = await this.mockCloot.itemNames(1);
      // check occurrences
      const hashName0 = ethers.utils.solidityKeccak256(["string"], [itemNames.weapon]);
      expect(await this.mockCloot.occurrences(hashName0)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.weapon)).to.equal(1);
      const hashName1 = ethers.utils.solidityKeccak256(["string"], [itemNames.chest]);
      expect(await this.mockCloot.occurrences(hashName1)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.chest)).to.equal(1);
      const hashName2 = ethers.utils.solidityKeccak256(["string"], [itemNames.head]);
      expect(await this.mockCloot.occurrences(hashName2)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.head)).to.equal(1);
      const hashName3 = ethers.utils.solidityKeccak256(["string"], [itemNames.waist]);
      expect(await this.mockCloot.occurrences(hashName3)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.waist)).to.equal(1);
      const hashName4 = ethers.utils.solidityKeccak256(["string"], [itemNames.foot]);
      expect(await this.mockCloot.occurrences(hashName4)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.foot)).to.equal(1);
      const hashName5 = ethers.utils.solidityKeccak256(["string"], [itemNames.hand]);
      expect(await this.mockCloot.occurrences(hashName5)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.hand)).to.equal(1);
      const hashName6 = ethers.utils.solidityKeccak256(["string"], [itemNames.neck]);
      expect(await this.mockCloot.occurrences(hashName6)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.neck)).to.equal(1);
      const hashName7 = ethers.utils.solidityKeccak256(["string"], [itemNames.ring]);
      expect(await this.mockCloot.occurrences(hashName7)).to.equal(1);
      expect(await this.mockCloot.getOccurrence(itemNames.ring)).to.equal(1);
    });

    it("Should fail if not pay", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await expect(this.mockCloot.connect(this.user).mint({
        value: ethers.utils.parseEther("0")
      })).to.be.revertedWith("Value below price");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail multi mint if not pay", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await expect(this.mockCloot.connect(this.user).multiMint(10, {
        value: ethers.utils.parseEther("0.4")
      })).to.be.revertedWith("Value below price");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if auto token id is not enabled", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 10);
      await expect(this.mockCloot.connect(this.user).mintWithTokenId(10, {
        value: ethers.utils.parseEther("0.05")
      })).to.be.revertedWith("Auto token id enabled");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should success for mint with token id", async function() {
      await this.deployMockAvatars();
      await this.mockCloot.setAutoTokenId(false);
      await this.loot.mint(this.user2.address, 10);
      await expect(this.mockCloot.connect(this.user).mintWithTokenId(10, {
        value: ethers.utils.parseEther("0.05")
      })).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(1);
      const rarities = await this.mockCloot.getItemRarities(10);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      await expect(this.mockCloot.connect(this.user).mintWithTokenId(10, {
        value: ethers.utils.parseEther("0.05")
      })).to.be.revertedWith("Token Id already minted");
    });
  });

  describe("Mint with loot", function() {
    it("Should fail if loot token not exist", async function() {
      await this.deployMockAvatars();
      await expect(this.mockCloot.connect(this.user).mintWithLoot(2)).to.be.revertedWith("ERC721: owner query for nonexistent token");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if multi mint with loots token not exist", async function() {
      await this.deployMockAvatars();
      await expect(this.mockCloot.connect(this.user).multiMintWithLoots([1,2,3])).to.be.revertedWith("ERC721: owner query for nonexistent token");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if not loot owner", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 2);
      await expect(this.mockCloot.connect(this.user).mintWithLoot(2)).to.be.revertedWith("Not the owner of this loot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if multi mint with not loot owner", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user.address, 1);
      await this.loot.mint(this.user2.address, 2);
      await expect(this.mockCloot.connect(this.user).multiMintWithLoots([1,2])).to.be.revertedWith("Not the owner of this loot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should success for mint with loot owner", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await this.loot.mint(this.user.address, 2);
      await expect(this.mockCloot.connect(this.user).mintWithLoot(2))
        .to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(1);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      await expect(this.mockCloot.connect(this.user).mintWithLoot(2))
        .to.be.revertedWith("This loot token has already been minted");
      
      expect(await this.mockCloot.mintedLootIds(2)).to.equal(true);
      expect(await this.mockCloot.mintedLootIds(1)).to.equal(false);
    });

    it("Should success for mul mint with loot owner", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user.address, 1);
      await this.loot.mint(this.user.address, 2);
      await this.loot.mint(this.user.address, 3);
      await expect(this.mockCloot.connect(this.user).multiMintWithLoots([1,2,3])).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(3);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      await expect(this.mockCloot.connect(this.user).mintWithLoot(2))
        .to.be.revertedWith("This loot token has already been minted");

      expect(await this.mockCloot.mintedLootIds(3)).to.equal(true);
      expect(await this.mockCloot.mintedLootIds(2)).to.equal(true);
      expect(await this.mockCloot.mintedLootIds(1)).to.equal(true);
    });
  });

  describe("Mint with avatar", function() {
    it("Should fail if avatar token not exist", async function() {
      await this.deployMockAvatars();
      await expect(this.mockCloot.connect(this.user).mintWithAvatar(2)).to.be.revertedWith("ERC721: owner query for nonexistent token");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if multi mint with avatars token not exist", async function() {
      await this.deployMockAvatars();
      await expect(this.mockCloot.connect(this.user).multiMintWithAvatars([1,2,3])).to.be.revertedWith("ERC721: owner query for nonexistent token");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if not avatar owner", async function() {
      await this.deployMockAvatars();
      await this.avatars.mint(this.user2.address, 2);
      await expect(this.mockCloot.connect(this.user).mintWithAvatar(2)).to.be.revertedWith("Not the owner of this avatar");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should fail if multi mint with not avatar owner", async function() {
      await this.deployMockAvatars();
      await this.avatars.mint(this.user.address, 1);
      await this.avatars.mint(this.user2.address, 2);
      await expect(this.mockCloot.connect(this.user).multiMintWithAvatars([1,2])).to.be.revertedWith("Not the owner of this avatar");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(0);
    });

    it("Should success for mint with avatar owner", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await this.avatars.mint(this.user2.address, 1);
      await this.avatars.mint(this.user.address, 2);
      await expect(this.mockCloot.connect(this.user).mintWithAvatar(2)).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(1);
      expect(await this.mockCloot.ownerOf(1)).to.equal(this.user.address);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      await expect(this.mockCloot.connect(this.user).mintWithAvatar(2))
        .to.be.revertedWith("This token has already been minted");

      expect(await this.mockCloot.mintedLootAvatarsIds(2)).to.equal(true);
      expect(await this.mockCloot.mintedLootAvatarsIds(1)).to.equal(false);
    });

    it("Should success for public mul mint", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      await this.loot.mint(this.user2.address, 2);
      await this.loot.mint(this.user2.address, 3);
      await this.avatars.mint(this.user.address, 3);
      await this.avatars.mint(this.user.address, 4);
      await this.avatars.mint(this.user.address, 5);
      await expect(this.mockCloot.connect(this.user).multiMintWithAvatars([3,4,5])).to.emit(this.mockCloot, "CreateColorLoot");
      expect(await this.mockCloot.balanceOf(this.user.address)).to.equal(3);
      expect(await this.mockCloot.ownerOf(1)).to.equal(this.user.address);
      expect(await this.mockCloot.ownerOf(2)).to.equal(this.user.address);
      expect(await this.mockCloot.ownerOf(3)).to.equal(this.user.address);
      const rarities = await this.mockCloot.getItemRarities(1);
      this.assertItemRarity(rarities.weapon, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.chest, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.head, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.waist, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.foot, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.hand, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.neck, 1, 1, "#ff44b7", "Mythic");
      this.assertItemRarity(rarities.ring, 1, 1, "#ff44b7", "Mythic");

      await expect(this.mockCloot.connect(this.user).mintWithAvatar(3))
        .to.be.revertedWith("This token has already been minted");
      
      expect(await this.mockCloot.mintedLootAvatarsIds(1)).to.equal(false);
      expect(await this.mockCloot.mintedLootAvatarsIds(2)).to.equal(false);
      expect(await this.mockCloot.mintedLootAvatarsIds(3)).to.equal(true);
      expect(await this.mockCloot.mintedLootAvatarsIds(4)).to.equal(true);
      expect(await this.mockCloot.mintedLootAvatarsIds(5)).to.equal(true);
    });
  });

  describe("Set rairity level", function() {
    it("Should success when update a level", async function() {
      const threshold0 = await this.cloot.thresholds(0);
      const color0 = await this.cloot.colors(0);
      const level0 = await this.cloot.levels(0);
      expect(threshold0).to.equal(8000);
      expect(color0).to.equal("#838383");
      expect(level0).to.equal("Common");

      await this.cloot.updateRarityLevel(0, 7000, "#838382", "Common1");
      const threshold1 = await this.cloot.thresholds(0);
      const color1 = await this.cloot.colors(0);
      const level1 = await this.cloot.levels(0);
      expect(threshold1).to.equal(7000);
      expect(color1).to.equal("#838382");
      expect(level1).to.equal("Common1");
    });

    it("Should success when reset rarity levels", async function() {
      await this.cloot.resetRarityLevels([6000, 50], ["#838382", "#838381"], ["Common1", "Mythic"]);
      const threshold1 = await this.cloot.thresholds(1);
      const color1 = await this.cloot.colors(1);
      const level1 = await this.cloot.levels(1);
      expect(threshold1).to.equal(50);
      expect(color1).to.equal("#838381");
      expect(level1).to.equal("Mythic");
      await expect(this.cloot.thresholds(2)).to.be.reverted;
    });
  });

  describe("Get item names", function() {
    it("Should success to get a loot names", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      const itemNames = await this.mockCloot.itemNames(1);
      expect(itemNames.weapon).to.equal('"Grim Shout" Grave Wand of Skill +1');
      expect(itemNames.chest).to.equal('Hard Leather Armor');
      expect(itemNames.head).to.equal('Divine Hood');
      expect(itemNames.waist).to.equal('Hard Leather Belt');
      expect(itemNames.foot).to.equal('"Death Root" Ornate Greaves of Skill');
      expect(itemNames.hand).to.equal('Studded Leather Gloves');
      expect(itemNames.neck).to.equal('Necklace of Enlightenment');
      expect(itemNames.ring).to.equal('Gold Ring');
    });

    it("Should success to get a item name", async function() {
      await this.deployMockAvatars();
      await this.loot.mint(this.user2.address, 1);
      const weapon = await this.mockCloot.itemName(1, 0);
      expect(weapon).to.equal('"Grim Shout" Grave Wand of Skill +1');
      const chest = await this.mockCloot.itemName(1, 1);
      expect(chest).to.equal('Hard Leather Armor');
      const head = await this.mockCloot.itemName(1, 2);
      expect(head).to.equal('Divine Hood');
      const waist = await this.mockCloot.itemName(1, 3);
      expect(waist).to.equal('Hard Leather Belt');
      const foot = await this.mockCloot.itemName(1, 4);
      expect(foot).to.equal('"Death Root" Ornate Greaves of Skill');
      const hand = await this.mockCloot.itemName(1, 5);
      expect(hand).to.equal('Studded Leather Gloves');
      const neck = await this.mockCloot.itemName(1, 6);
      expect(neck).to.equal('Necklace of Enlightenment');
      const ring = await this.mockCloot.itemName(1, 7);
      expect(ring).to.equal('Gold Ring');
    });
  });
});
