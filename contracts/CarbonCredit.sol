// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";

// Dummy import to get artifacts for IFDCHub
import {IFdcHub} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol";
import {IFdcRequestFeeConfigurations} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcRequestFeeConfigurations.sol";

import {IJsonApiVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IJsonApiVerification.sol";
import {IJsonApi} from "@flarenetwork/flare-periphery-contracts/coston2/IJsonApi.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CarbonCredit is ERC1155 {
    struct Credit {
        string name;
        uint256 quality;
    }

    struct DataTransportObject {
        string name;
        uint256 height;
        uint256 mass;
    }

    uint256 public currentCreditId = 1;
    mapping(uint256 => Credit) public credits;
    uint256[] public creditIds;

    constructor() ERC1155("dummy uri") {}

    function isJsonApiProofValid(
        IJsonApi.Proof calldata _proof
    ) public view returns (bool) {
        // Inline the check for now until we have an official contract deployed
        return
            ContractRegistry.auxiliaryGetIJsonApiVerification().verifyJsonApi(
                _proof
            );
    }

    function addCredit(IJsonApi.Proof calldata data, uint256 value) public {
        require(isJsonApiProofValid(data), "Invalid proof");

        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );

        require(credits[currentCreditId].quality == 0, "Credit already exists");

        Credit memory credit = Credit({
            name: dto.name,
            quality: (dto.mass / dto.height) * 100
        });

        credits[currentCreditId] = credit;
        creditIds.push(currentCreditId);

        _mint(msg.sender, currentCreditId, value, "");

        currentCreditId++;
    }

    function getAllCredits()
        public
        view
        returns (Credit[] memory)
    {
        Credit[] memory result = new Credit[](
            creditIds.length
        );
        for (uint256 i = 0; i < creditIds.length; i++) {
            result[i] = credits[creditIds[i]];
        }
        return result;
    }

    function getFdcHub() external view returns (IFdcHub) {
        return ContractRegistry.getFdcHub();
    }

    function getFdcRequestFeeConfigurations()
        external
        view
        returns (IFdcRequestFeeConfigurations)
    {
        return ContractRegistry.getFdcRequestFeeConfigurations();
    }
}
