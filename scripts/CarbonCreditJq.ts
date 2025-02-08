import { artifacts, ethers, run } from "hardhat";
import { CarbonCreditInstance } from "../typechain-types";

const CarbonCredit = artifacts.require("CarbonCredit");
const FDCHub = artifacts.require(
  "@flarenetwork/flare-periphery-contracts/coston/IFdcHub.sol:IFdcHub"
);

// Simple hex encoding
function toHex(data) {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result += data.charCodeAt(i).toString(16);
  }
  return result.padEnd(64, "0");
}

const {
  JQ_VERIFIER_URL_TESTNET,
  JQ_API_KEY,
  VERIFIER_URL_TESTNET,
  VERIFIER_PUBLIC_API_KEY_TESTNET,
  DA_LAYER_URL_COSTON2,
} = process.env;

const TX_ID =
  "0x465fef418efc6af7993de440f506ffc4bf565a185f6eba4bd41999f27e4f9acb";

const CARBON_CREDIT_ADDRESS = "0x8Ee9F7dF514c4EB564834b946d0A8a4D457953b8"; // coston2

async function deployMainList() {
  const credit: CarbonCreditInstance = await CarbonCredit.new();

  console.log("Credit contract deployed at:", credit.address);
  // verify
  const result = await run("verify:verify", {
    address: credit.address,
  });
  console.log(result);
}

// deployMainList().then((data) => {
//   process.exit(0);
// });

async function prepareRequest() {
  const attestationType = "0x" + toHex("IJsonApi");
  const sourceType = "0x" + toHex("WEB2");
  const requestData = {
    attestationType: attestationType,
    sourceId: sourceType,
    requestBody: {
      url: "https://swapi.dev/api/people/3/",
      postprocessJq: `{
        name: .name,
        height: .height,
        mass: .mass
      }`,
      abi_signature: `
        {\"components\": [
            {\"internalType\": \"string\",\"name\": \"name\",\"type\": \"string\"},
            {\"internalType\": \"uint256\",\"name\": \"height\",\"type\": \"uint256\"},
            {\"internalType\": \"uint256\",\"name\": \"mass\",\"type\": \"uint256\"}
        ],
      \"name\": \"task\",\"type\": \"tuple\"}`,
    },
  };

  const response = await fetch(
    `${JQ_VERIFIER_URL_TESTNET}JsonApi/prepareRequest`,
    {
      method: "POST",
      headers: {
        "X-API-KEY": JQ_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );
  const data = await response.json();
  console.log("Prepared request:", data);
  return data;
}

// prepareRequest().then((data) => {
//   console.log("Prepared request:", data);
//   process.exit(0);
// });

const firstVotingRoundStartTs = 1658429955;
const votingEpochDurationSeconds = 90;

async function submitRequest() {
  const requestData = await prepareRequest();

  const creditContract: CarbonCreditInstance = await CarbonCredit.at(
    CARBON_CREDIT_ADDRESS
  );

  const fdcHUB = await FDCHub.at(await creditContract.getFdcHub());

  // Call to the FDC Hub protocol to provide attestation.
  const tx = await fdcHUB.requestAttestation(requestData.abiEncodedRequest, {
    value: ethers.parseEther("1").toString(),
  });
  console.log("Submitted request:", tx.tx);

  // Get block number of the block containing contract call
  const blockNumber = tx.blockNumber;
  const block = await ethers.provider.getBlock(blockNumber);

  // Calculate roundId
  const roundId = Math.floor(
    (block!.timestamp - firstVotingRoundStartTs) / votingEpochDurationSeconds
  );
  console.log(
    `Check round progress at: https://coston-systems-explorer.flare.rocks/voting-epoch/${roundId}?tab=fdc`
  );
  return roundId;
}

// submitRequest().then((data) => {
//   console.log("Submitted request:", data);
//   process.exit(0);
// });

const TARGET_ROUND_ID = 895595; // 0

async function getProof(roundId: number) {
  const request = await prepareRequest();
  const proofAndData = await fetch(
    `${DA_LAYER_URL_COSTON2}fdc/get-proof-round-id-bytes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        votingRoundId: roundId,
        requestBytes: request.abiEncodedRequest,
      }),
    }
  );

  return await proofAndData.json();
}

// getProof(TARGET_ROUND_ID)
//   .then((data) => {
//     console.log("Proof and data:");
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((e) => {
//     console.error(e);
//   });

async function submitProof() {
  const dataAndProof = await getProof(TARGET_ROUND_ID);
  console.log(dataAndProof);
  const creditContract: CarbonCreditInstance = await CarbonCredit.at(
    CARBON_CREDIT_ADDRESS
  );

  const tx = await creditContract.addCredit(
    {
      merkleProof: dataAndProof.proof,
      data: dataAndProof.response,
    },
    5
  );
  console.log(tx.tx);
  console.log(await creditContract.getAllCredits());
}

submitProof()
  .then((data) => {
    console.log("Submitted proof");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
  });
