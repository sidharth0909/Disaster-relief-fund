import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DisasterReliefFundABI from "../abis/DisasterReliefFund.json";
import "bootstrap/dist/css/bootstrap.min.css";

const DisasterFund = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignLocation, setNewCampaignLocation] = useState("");
  const [newCampaignGoal, setNewCampaignGoal] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          console.log("Connected to network:", networkId);

          const networkData = DisasterReliefFundABI.networks[networkId];
          if (networkData) {
            const contractInstance = new web3.eth.Contract(
              DisasterReliefFundABI.abi,
              networkData.address
            );
            setContract(contractInstance);

            console.log("Fetching campaigns...");
            const campaigns = await contractInstance.methods.getCampaigns().call();
            console.log("Campaigns fetched:", campaigns);

            setCampaigns(campaigns);
          } else {
            console.error("Smart contract not deployed on this network.");
            alert("Smart contract not deployed on this network.");
          }
        } catch (error) {
          console.error("Error connecting to blockchain:", error);
        }
      } else {
        alert("MetaMask is not installed.");
      }
    };
    loadBlockchainData();
  }, []);

  const donate = async (campaignId) => {
    await contract.methods.donate(campaignId).send({
      from: account,
      value: Web3.utils.toWei(donationAmount, "ether"),
    });
    alert("Donation successful!");
  };

  const handleAdminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "admin123") {
      setAdminLoggedIn(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const createCampaign = async () => {
    await contract.methods
      .createCampaign(newCampaignName, newCampaignLocation, Web3.utils.toWei(newCampaignGoal, "ether"))
      .send({ from: account });
    alert("Campaign created successfully!");
    const updatedCampaigns = await contract.methods.getCampaigns().call();
    setCampaigns(updatedCampaigns);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Disaster Relief Fund</h2>
      {!adminLoggedIn ? (
        <div className="mb-4">
          <h3>Admin Login</h3>
          <input
            type="text"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            placeholder="Username"
            className="form-control mb-2"
          />
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Password"
            className="form-control mb-2"
          />
          <button className="btn btn-primary" onClick={handleAdminLogin}>Login</button>
        </div>
      ) : (
        <div className="mb-4">
          <h3>Create New Campaign</h3>
          <input
            type="text"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            placeholder="Campaign Name"
            className="form-control mb-2"
          />
          <input
            type="text"
            value={newCampaignLocation}
            onChange={(e) => setNewCampaignLocation(e.target.value)}
            placeholder="Location"
            className="form-control mb-2"
          />
          <input
            type="text"
            value={newCampaignGoal}
            onChange={(e) => setNewCampaignGoal(e.target.value)}
            placeholder="Goal in ETH"
            className="form-control mb-2"
          />
          <button className="btn btn-primary" onClick={createCampaign}>Create Campaign</button>
        </div>
      )}
      {campaigns.map((campaign, index) => (
        <div key={index} className="card p-4 mb-4">
          <h3>{campaign.name} - {campaign.location}</h3>
          <p>Raised: {Web3.utils.fromWei(campaign.amountRaised, "ether")} ETH</p>
          <p>Goal: {Web3.utils.fromWei(campaign.goal, "ether")} ETH</p>
          <input
            type="text"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Amount in ETH"
            className="form-control mb-2"
          />
          <button className="btn btn-primary" onClick={() => donate(index)}>Donate</button>
        </div>
      ))}
    </div>
  );
};

export default DisasterFund;