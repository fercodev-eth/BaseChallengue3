// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract RewardContract {

    bool public rewardClaimed = false;
    constructor() payable{
        require(msg.value >0, "Must send tokens as rewards");
    }

    function claimReward() external{
        require(rewardClaimed == false, "Reward already claimed");

        uint256 rewardAmount = address(this).balance;
        payable(msg.sender).transfer(rewardAmount);
        rewardClaimed = true;
    }
}