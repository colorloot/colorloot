import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import hre from "hardhat";
import { Contract } from "ethers";

const ContractPath = resolve(__dirname, "../contracts.json");

const ethers = hre.ethers;

interface ContractInfo {
  address: string;
  blockNumber?: Number;
  blockHash?: string;
}

interface ContractConfig {
  ColorLoot?: ContractInfo;
  MockLoot?: ContractInfo;
  MockAvatars?: ContractInfo;
}

interface NetworkAddressConfig {
  [propName: string]: ContractConfig;
}

export const network = process.env["HARDHAT_NETWORK"] || "";

const contracts = JSON.parse(
  readFileSync(ContractPath, "utf-8")
) as NetworkAddressConfig;

export function get(
  key: keyof ContractConfig,
  ignoreEmpty?: boolean
): ContractInfo {
  if (!contracts[network]) {
    contracts[network] = {};
  }
  const v = contracts[network][key] || {
    address: "",
    blockHash: "",
    blockNumber: 0,
  };
  if (!ignoreEmpty && v.address == "") {
    throw new Error(`${key} not found from ${network}`);
  }
  console.log(`get ${network}:${key}=${JSON.stringify(v)}`);
  return v;
}

export function set(key: keyof ContractConfig, value: ContractInfo): void {
  const old = get(key, true);
  contracts[network][key] = value;
  console.log(
    `set ${network}:${key} from ${JSON.stringify(old)} => ${JSON.stringify(
      value
    )}`
  );
  writeFileSync(ContractPath, JSON.stringify(contracts, null, 2), "utf-8");
  console.log("😀😀😀😀😀 Save contracts");
}

export async function getContract(
  key: keyof ContractConfig,
  abi?: string
): Promise<Contract> {
  abi = abi || key;
  const info = get(key);
  const Factory = await ethers.getContractAt(abi, info.address);
  return Factory.attach(info.address);
}

export async function deploy(
  name: keyof ContractConfig,
  ...parameters: any[]
): Promise<ContractInfo> {
  console.log(`🚙🚙🚙🚙🚙 Deploy ${name}...`);
  const Factory = await ethers.getContractFactory(name);
  const contract = await Factory.deploy(...parameters);
  const tx = contract.deployTransaction;
  await tx.wait();
  const hash = tx.hash;
  const block = await ethers.provider.getTransaction(hash);
  const info = {
    address: contract.address,
    blockHash: hash,
    blockNumber: block.blockNumber,
  };
  console.log(`✅✅✅✅✅ Deploy ${name} at ${JSON.stringify(info)}`);
  return info;
}

export async function verify(
  key: keyof ContractConfig,
  ...parameters: any[]
) {
  const info = get(key);
  console.log(`🚙🚙🚙🚙🚙 Verify & Publish source code of ${key} (${info.address}) to etherscan...`);
  await hre.run("verify:verify", {
    address: info.address,
    constructorArguments: parameters,
  })
}
