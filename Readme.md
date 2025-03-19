# Disaster Relief Fund - Blockchain Crowdfunding

This is a **blockchain-based crowdfunding platform** for disaster relief, built using **React, Web3.js, Truffle, and Ganache**. Users can **donate ETH to relief campaigns**, while **admins manage campaigns and withdraw funds** securely.

## **🛠 Technologies Used**
- **Smart Contract Development**: Solidity, Truffle
- **Local Blockchain**: Ganache
- **Frontend**: React.js, Bootstrap
- **Web3 Integration**: Web3.js, MetaMask
- **Data Visualization**: Chart.js

---

## **📌 Features**
### **1. User Features**
- **Connect Wallet**: Users can connect their MetaMask wallet.
- **Donate ETH**: Users donate ETH to specific disaster relief campaigns.
- **View Campaigns**: Users can see active fundraising campaigns.

### **2. Admin Features**
- **Create Campaigns**: Admins can create new campaigns.
- **Edit & Delete Campaigns**: Manage active campaigns.
- **Withdraw Funds**: Admins can withdraw donated ETH from campaigns.
- **Dashboard Analytics**: View fundraising progress via Chart.js.

### **3. Smart Contract Functions**
- `createCampaign()` → Admin-only function to create new campaigns.
- `donate()` → Allows users to donate ETH to campaigns.
- `withdrawFunds()` → Admin-only function to withdraw collected ETH.
- `getCampaigns()` → Fetches all active campaigns.

---

## **🚀 Setup & Installation**
### **1️⃣ Prerequisites**
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)
- [Ganache](https://trufflesuite.com/ganache/)
- [Truffle](https://www.trufflesuite.com/)

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/disaster-relief-fund.git
cd disaster-relief-fund
```

### **3️⃣ Install Dependencies**
```sh
npm install
```

### **4️⃣ Compile & Deploy Smart Contract (Truffle)**
```sh
truffle compile
truffle migrate --network development
```
Ensure **Ganache** is running before executing the migration.

### **5️⃣ Start the Development Server (React)**
```sh
npm start
```

---

## **⚡ Usage Guide**
### **1. Start Ganache**
- Open Ganache and start a new workspace.
- Copy the first account's private key (Admin Wallet).
- Import it into **MetaMask**.

### **2. Connect Wallet (For Users & Admins)**
- Open the React frontend (`http://localhost:3000`).
- Click **"Connect Wallet"** to link your MetaMask account.

### **3. Admin Actions**
- Log in as Admin (Default: `admin` / `admin123`).
- Create new campaigns and manage existing ones.
- Withdraw funds after donations.

### **4. User Actions**
- View campaigns.
- Donate ETH using MetaMask.
- Track fundraising progress via charts.

---

## **📝 Smart Contract Overview**
### **Contract: DisasterReliefFund.sol**
```solidity
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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createCampaign(string memory _name, string memory _location, uint256 _goal) public onlyAdmin {
        campaigns.push(Campaign(_name, _location, 0, _goal, true, payable(msg.sender)));
    }

    function donate(uint256 _campaignId) public payable {
        require(campaigns[_campaignId].isActive, "Campaign is not active.");
        require(msg.value > 0, "Donation must be greater than 0.");
        campaigns[_campaignId].amountRaised += msg.value;
    }

    function withdrawFunds(uint256 _campaignId) public onlyAdmin {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.amountRaised > 0, "No funds available.");
        campaign.amountRaised = 0;
        campaign.creator.transfer(campaign.amountRaised);
    }
}
```

---

## **📌 Deployment on Testnet (Goerli, Sepolia, etc.)**
To deploy on a real Ethereum testnet:
1. Update **Truffle Config (`truffle-config.js`)**:
```js
module.exports = {
  networks: {
    goerli: {
      provider: () => new HDWalletProvider("YOUR_MNEMONIC", "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"),
      network_id: 5,
      gas: 5500000,
    },
  },
};
```
2. Run the migration:
```sh
truffle migrate --network goerli
```
3. Verify deployment using:
```sh
truffle console --network goerli
```

---

## **📌 Possible Improvements**
✅ Add **KYC verification** for campaigns.
✅ Implement **QR code-based donations**.
✅ Use **IPFS** for storing campaign images.
✅ Deploy on **Polygon or Binance Smart Chain** for lower fees.

---

## **📞 Support**
If you need help, reach out via **GitHub Issues** or email at **sidharthsaholiyabh@gmail.com**.

---

**🚀 Built for Transparency & Impact in Disaster Relief 🚀**

Simple Steps to run the project ->
first thing is to start the ganache server -> ganache-cli
2nd -> Open Metamask and connect your local server in show test network
3rd-> Compile the Contract using truffle compile
then use the
4th-> truffle migrate --network development
5th-> start the frontend using npm start

ganache-cli --db ./ganache-data --port 8545 --networkId 1337 this command is used to store the our campaign data without getting it lost

