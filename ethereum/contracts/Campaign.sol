// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address campaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(campaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;

    uint numRequests;
    mapping (uint => Request) requests;

    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function getRequestDescription(uint index) public view returns(string memory) {
        require(index < numRequests);

        return requests[index].description;
    }

    function getRequestValue(uint index) public view returns(uint) {
        require(index < numRequests);

        return requests[index].value;
    }

    function createRequest (string memory description, uint value, address recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalsCount > (approversCount / 2));

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}