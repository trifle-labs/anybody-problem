pragma solidity ^0.8.0;

import { GovernorCountingSimple } from "./Contest.sol";

contract BuyVotes {
  uint256 public proposalId;
  address public jokerace;
  uint256 public withdrawn;
  address payable public deployer;
  address payable public rewardsAddress;
  uint256 rewardPercentage = 60;
  mapping(address => bool) public hasCollected;
  constructor(uint256 proposalId_, address jokerace_, address payable rewardsAddress_) {
    proposalId = proposalId_; // 94833500000338802010811938967752446324129796376595350905780228910037192404146
    jokerace = jokerace_; // 0x3334824856863e28a5968042341a88901a3cd430
    rewardsAddress = rewardsAddress_; // 0x567e0f790bc9e6c37c53c91cee8a0e9ff43b8ff4
    deployer = payable(msg.sender);
  }
  receive() external payable {}

  function howMuchPayout(address voter) public view returns (uint256) {
    uint256 balance = rewardsAddress.balance * rewardPercentage / 100;
    return calculatePayout(voter, balance);
  }

  function calculatePayout(address voter, uint256 balance) internal view returns (uint256) {
    require(!hasCollected[voter], "Already collected");
    GovernorCountingSimple jr = GovernorCountingSimple(jokerace);
    (uint256 totalTotalVotes, ) = jr.proposalVotes(proposalId);
    (uint256 totalVoterVotes, uint256 totalVoterNoVotes) =  jr.proposalAddressVotes(proposalId, voter);
    require(totalVoterNoVotes == 0, "No 'No' votes allowed");
    require(totalVoterVotes > 0, "No votes at all");
    uint256 totalBalance = balance - withdrawn;
    uint256 payout = (totalBalance * totalVoterVotes) / totalTotalVotes;
    return payout;
  }

  function payOut(address voter) public {
    uint256 balance = address(this).balance;
    uint256 payout = calculatePayout(voter, balance);
    withdrawn += payout;
    hasCollected[voter] = true;
    (bool sent, bytes memory data) = voter.call{value: payout}('');
    require(sent, "Failed to send Ether");
  }
  function recoverEth() public {
    require(msg.sender == deployer, "Only deployer");
    (bool sent, bytes memory data) = deployer.call{value: address(this).balance}('');
    require(sent, "Failed to send Ether");
  }
  function updateDeployer(address payable deployer_) public {
    require(msg.sender == deployer, "Only deployer");
    deployer = deployer_;
  }
}
