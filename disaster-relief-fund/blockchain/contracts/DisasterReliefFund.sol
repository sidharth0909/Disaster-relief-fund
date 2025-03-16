// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract DisasterReliefFund {
    address public admin;
    struct Campaign {
        string name;
        string location;
        uint256 amountRaised;
        uint256 goal;
        bool isActive;
        address payable creator;
    }

    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;

    event FundCreated(uint256 campaignId, string name, string location, uint256 goal);
    event Donated(uint256 campaignId, address donor, uint256 amount);
    event FundsWithdrawn(uint256 campaignId, address admin, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createCampaign(string memory _name, string memory _location, uint256 _goal) public onlyAdmin {
        campaigns.push(Campaign(_name, _location, 0, _goal, true, payable(msg.sender)));
        emit FundCreated(campaigns.length - 1, _name, _location, _goal);
    }

    function donate(uint256 _campaignId) public payable {
        require(campaigns[_campaignId].isActive, "Campaign is not active.");
        require(msg.value > 0, "Donation must be greater than 0.");

        campaigns[_campaignId].amountRaised += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        emit Donated(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _campaignId) public onlyAdmin {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.amountRaised > 0, "No funds available.");

        uint256 amount = campaign.amountRaised;
        campaign.amountRaised = 0;
        campaign.creator.transfer(amount);

        emit FundsWithdrawn(_campaignId, msg.sender, amount);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}