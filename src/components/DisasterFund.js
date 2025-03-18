import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DisasterReliefFundABI from "../abis/DisasterReliefFund.json";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faInfoCircle,
  faDonate,
} from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import "./DisasterFund.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const disasterReliefWebsites = [
  {
    name: "Prime Minister's National Relief Fund",
    url: "https://pmnrf.gov.in/",
    description: "Official relief fund for national disasters.",
  },
  {
    name: "Chief Minister's Relief Fund",
    url: "https://cmrf.gov.in/",
    description: "State-level relief fund for disasters.",
  },
];

const DisasterFund = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    goal: "",
    description: "",
  });

  const [disasterInfo, setDisasterInfo] = useState([
    {
      id: 1,
      title: "Earthquake Preparedness",
      content: "Learn how to stay safe during earthquakes",
      type: "guide",
    },
    {
      id: 2,
      title: "Flood Relief Centers",
      content: "Locations of active relief centers",
      type: "location",
    },
  ]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
    
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            console.error("No accounts found.");
            return;
          }
    
          const networkId = await web3.eth.net.getId();
          console.log("Network ID:", networkId);
          const networkData = DisasterReliefFundABI.networks[networkId];
    
          if (networkData) {
            console.log("Contract Address:", networkData.address);
            const contractInstance = new web3.eth.Contract(
              DisasterReliefFundABI.abi,
              networkData.address
            );
            setContract(contractInstance);
            refreshCampaigns(contractInstance);
          } else {
            console.error("Smart contract not deployed on the current network!");
            alert("Smart contract not deployed on the current network!");
          }
        } catch (error) {
          console.error("Blockchain error:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };    
    loadBlockchainData();
  }, []);

  const refreshCampaigns = async (contractInstance) => {
    const campaigns = await contractInstance.methods.getCampaigns().call();
    setCampaigns(campaigns);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "admin123") {
      setAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert("Invalid credentials");
    }
  };
  

  const handleLogout = () => {
    setAdminLoggedIn(false);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Now any user can set their own account
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      alert("Contract not initialized or account not connected");
      return;
    }

    try {
      const weiGoal = Web3.utils.toWei(formData.goal.toString(), "ether");

      if (editingCampaign !== null) {
        await contract.methods
          .updateCampaign(
            editingCampaign,
            formData.name,
            formData.location,
            weiGoal,
            formData.description
          )
          .send({ from: account });
      } else {
        await contract.methods
          .createCampaign(
            formData.name,
            formData.location,
            weiGoal,
            formData.description
          )
          .send({ from: account });
      }

      await refreshCampaigns(contract);
      setShowCampaignModal(false);
      setFormData({ name: "", location: "", goal: "", description: "" });
    } catch (error) {
      console.error("Campaign error:", error);
      alert(`Error processing transaction: ${error.message}`);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      await contract.methods.deleteCampaign(campaignId).send({ from: account });
      refreshCampaigns(contract);
    }
  };
  const withdrawFunds = async (campaignId) => {
    if (!contract || !account) return alert("Contract not initialized");
  
    try {
      await contract.methods.withdrawFunds(campaignId).send({ from: account });
      alert("Funds withdrawn successfully!");
      await refreshCampaigns(contract); // Refresh the UI after withdrawal
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("Failed to withdraw funds.");
    }
  };
  

  const openEditModal = (campaign, index) => {
    setEditingCampaign(index);
    setFormData({
      name: campaign.name,
      location: campaign.location,
      goal: Web3.utils.fromWei(campaign.goal, "ether"),
      description: campaign.description,
    });
    setShowCampaignModal(true);
  };

  const DonationCard = ({ campaign, index }) => {
    const [donationAmount, setDonationAmount] = useState("");

    const handleDonate = async () => {
      if (!donationAmount || isNaN(donationAmount) || !contract || !account) {
        alert("Invalid donation amount or wallet not connected");
        return;
      }

      try {
        const weiAmount = Web3.utils.toWei(donationAmount.toString(), "ether");
        await contract.methods.donate(index).send({
          from: account,
          value: weiAmount,
        });
        await refreshCampaigns(contract);
        setDonationAmount("");
      } catch (error) {
        console.error("Donation error:", error);
        alert(`Donation failed: ${error.message}`);
      }
    };

    const progress = (Number(campaign.amountRaised) / Number(campaign.goal)) * 100;

    return (
      <div className="campaign-card card mb-4">
        <div className="card-body">
          <h3 className="card-title">{campaign.name}</h3>
          <p className="text-muted">{campaign.location}</p>
          <p className="card-text">{campaign.description}</p>
  
          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {progress.toFixed(1)}%
            </div>
          </div>
  
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Raised: {Web3.utils.fromWei(campaign.amountRaised, "ether")} ETH</span>
            <span>Goal: {Web3.utils.fromWei(campaign.goal, "ether")} ETH</span>
          </div>
  
          {adminLoggedIn ? (
            <div className="admin-controls">
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => openEditModal(campaign, index)}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteCampaign(index)}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
              {Number(campaign.amountRaised) > 0 && (
                <button
                  className="btn btn-success btn-sm ml-2"
                  onClick={() => withdrawFunds(index)}
                >
                  <FontAwesomeIcon icon={faDonate} /> Withdraw Funds
                </button>
              )}
            </div>
          ) : (
            <div className="donation-input input-group">
              <input
                type="number"
                className="form-control"
                placeholder="ETH amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn btn-primary" onClick={handleDonate}>
                  <FontAwesomeIcon icon={faDonate} /> Donate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const chartData = {
    labels: campaigns.map((campaign) => campaign.name),
    datasets: [
      {
        label: "Amount Raised (ETH)",
        data: campaigns.map((campaign) =>
          Web3.utils.fromWei(campaign.amountRaised, "ether")
        ),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="disaster-fund-container">
      {adminLoggedIn ? (
        <div className="admin-dashboard">
          <nav className="admin-navbar navbar navbar-dark bg-dark">
            <span className="navbar-brand">Admin Dashboard</span>
            <button className="btn btn-success" onClick={connectWallet}>
  {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
</button>
            <button className="btn btn-light" onClick={handleLogout}>
              Logout
            </button>
          </nav>

          <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
              <h2>Manage Campaigns</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingCampaign(null);
                  setFormData({
                    name: "",
                    location: "",
                    goal: "",
                    description: "",
                  });
                  setShowCampaignModal(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} /> New Campaign
              </button>
            </div>

            <div className="row">
              <div className="col-md-8">
                {campaigns.map((campaign, index) => (
                  <DonationCard key={index} campaign={campaign} index={index} />
                ))}
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Campaign Metrics</h5>
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-interface">
          <nav className="navbar navbar-dark bg-primary">
            <span className="navbar-brand">Disaster Relief Network</span>
            <button
              className="btn btn-light"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin Login
            </button>
          </nav>

          {showAdminLogin && (
            <div className="modal show" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Admin Login</h5>
                    <button
                      className="close"
                      onClick={() => setShowAdminLogin(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAdminLogin}>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-4">
                <div className="disaster-info-sidebar">
                  <h4 className="mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} /> Disaster Resources
                  </h4>

                  {disasterInfo.map((info) => (
                    <div key={info.id} className="info-card card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">{info.title}</h5>
                        <p className="card-text">{info.content}</p>
                        <button className="btn btn-outline-primary btn-sm">
                          Learn More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <div className="disaster-relief-websites mt-4">
                  <h4>Disaster Relief Fund Websites</h4>
                  {disasterReliefWebsites.map((site, index) => (
                    <div key={index} className="website-card card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">{site.name}</h5>
                        <p className="card-text">{site.description}</p>
                        <a
                          href={site.url}
                          className="btn btn-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-8">
                <h2 className="mb-4">Active Relief Campaigns</h2>
                {campaigns.map((campaign, index) => (
                  <DonationCard key={index} campaign={campaign} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCampaignModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCampaign !== null ? "Edit Campaign" : "New Campaign"}
                </h5>
                <button
                  className="close"
                  onClick={() => setShowCampaignModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCampaignSubmit}>
                  <div className="form-group">
                    <label>Campaign Name</label>
                    <input
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      className="form-control"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Goal (ETH)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.goal}
                      onChange={(e) =>
                        setFormData({ ...formData, goal: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingCampaign !== null ? "Update" : "Create"} Campaign
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterFund;
