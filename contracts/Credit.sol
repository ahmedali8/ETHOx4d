// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Credit {
    string public credit;

    event CreditEvent(address indexed sender, string credit);

    function setCredit(string calldata _credit) public {
        credit = _credit;
        emit CreditEvent(msg.sender, _credit);
    }

    function getCredit() public view returns (string memory) {
        return credit;
    }
}
