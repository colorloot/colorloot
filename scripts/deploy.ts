// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { get, getContract, set, deploy, verify } from "./env";

const dev = "0xF518FFBDd4b8BFAf39811f08c63e9dFD3884771c";

async function deployColorLoot() {
  const cloot = await deploy("ColorLoot", dev);
  set("ColorLoot", cloot);
}

async function deployMockContracts() {
  const mockLoot = await deploy("MockLoot");
  set("MockLoot", mockLoot);
  const mockAvatars = await deploy("MockAvatars");
  set("MockAvatars", mockAvatars);
}

async function main(verify?: boolean) {
  await deployContracts();
  // await deployMockContracts();
}

async function deployContracts() {
  await deployColorLoot();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
