// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { get, getContract, set, deploy, verify } from "./env";

const dev = "0xF518FFBDd4b8BFAf39811f08c63e9dFD3884771c";

async function run() {
  await verifyContracts();
  // await unpause();
  // await purchase();
  // await check();
  // await mintMockTokens();
}

async function unpause() {
  const cloot = await getContract("ColorLoot");
  await cloot.setAutoTokenId(false);
}

async function verifyColorLoot() {
  await verify("ColorLoot", dev);
}

async function mintMockTokens() {
  for (var i = 9; i < 100; i++) {
    console.log("mint loot:", i);
    const mockLoot = await getContract("MockLoot");
    await mockLoot.claim(i);
  }
}

async function main(verify?: boolean) {
  await run();
}

async function verifyContracts() {
  await verifyColorLoot();
}

async function testChainLink() {
  const cloot = await getContract("ColorLoot");
}

async function purchase() {
  const cloot = await getContract("ColorLoot");
  await cloot.multiMint(20, {
    value: ethers.utils.parseEther("1"),
    // nonce: 83,
    // gasPrice: 12
  });
}

async function check() {
  const cloot = await getContract("ColorLoot");
  // for (var i = 0; i < 12; i++) {
  //   console.log(await cloot.tokenURI(i));
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
