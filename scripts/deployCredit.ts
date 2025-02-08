import "@nomicfoundation/hardhat-verify";
import { artifacts, ethers, run } from "hardhat";
import { CreditContract } from "../typechain-types";

const Credit: CreditContract = artifacts.require("Credit");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CreditFactory = await ethers.getContractFactory("Credit");
  const credit = await CreditFactory.deploy();
  await credit.waitForDeployment();
  // const credit = await Credit.new();
  console.log("credit deployed to:", credit.address);
  try {
    const result = await run("verify:verify", {
      address: credit.address,
    });

    console.log(result);
  } catch (e: any) {
    console.log(e.message);
  }
  console.log("Deployed contract at:", credit.address);
}
main().then(() => process.exit(0));
