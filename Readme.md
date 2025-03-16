## **📌 Disaster Relief Crowdfunding DApp**
A decentralized web application (DApp) built on **Ethereum** that enables disaster relief crowdfunding. **Admins can create campaigns**, and **anyone can donate** securely using **MetaMask** and **smart contracts**.

---

## **📜 Table of Contents**
- [📌 Disaster Relief Crowdfunding DApp](#-disaster-relief-crowdfunding-dapp)
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#-installation--setup)
- [🔗 Smart Contract Deployment](#-smart-contract-deployment)
- [💡 Usage Guide](#-usage-guide)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## **🚀 Features**
✅ **Decentralized Fundraising** - Blockchain-based crowdfunding for disaster relief.  
✅ **Admin Authentication** - Admins log in with a username & password to create campaigns.  
✅ **Secure Donations** - Users donate using **MetaMask** with **Ethereum transactions**.  
✅ **Transparent Transactions** - All contributions are **stored on the blockchain**.  
✅ **Campaign Visibility** - Anyone can view all campaigns and donation amounts.  

---

## **🛠 Tech Stack**
- **Frontend**: React.js, Web3.js, Bootstrap  
- **Backend**: Ethereum Smart Contract (Solidity)  
- **Blockchain**: Ganache (Local), Goerli / Sepolia (Testnet)  
- **Development Tools**: Truffle, Hardhat, MetaMask  

---

## **📂 Project Structure**
```
📦 disaster-relief-dapp
 ┣  # React Frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components  # React components (Campaigns, Admin Login)
 ┃ ┃ ┣ 📂 abis        # ABI JSON files for contract interaction
 ┃ ┃ ┣ 📜 App.js      # Main React App
 ┃ ┃ ┣ 📜 index.js    # React entry point
 ┃ ┃ ┗ 📜 styles.css  # Styling
 ┣ 📂 blockchain      # Smart Contract Code
 ┃ ┣ 📂 contracts
 ┃ ┃ ┣ 📜 DisasterReliefFund.sol  # Solidity smart contract
 ┃ ┣ 📂 migrations    # Deployment scripts
 ┃ ┣ 📂 test          # Smart contract tests
 ┃ ┗ 📜 truffle-config.js # Truffle settings
 ┣ 📜 package.json    # Dependencies
 ┣ 📜 README.md       # Documentation
 ┗ 📜 .gitignore      # Ignore node_modules & unnecessary files
```

---

## **⚙️ Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/disaster-relief-fund.git
cd disaster-relief-fund
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start Ganache (Local Blockchain)**
- **For Ganache CLI**:
  ```sh
  ganache-cli
  ```
- **For Ganache GUI**:
  - Open **Ganache** → Click **Quickstart Ethereum**.

### **4️⃣ Compile & Deploy Smart Contract**
```sh
truffle compile
truffle migrate --network development --reset
```

### **5️⃣ Start React Frontend**
```sh
cd client
npm start
```
🚀 **Open [http://localhost:3000](http://localhost:3000) to access the DApp!**

---

## **🔗 Smart Contract Deployment**
### **Deploy on Ethereum Testnet (Goerli/Sepolia)**
1️⃣ **Update `truffle-config.js`** with Infura RPC URL & wallet private key.  
2️⃣ **Deploy to Goerli:**
```sh
truffle migrate --network goerli --reset
```

---

## **💡 Usage Guide**
### **1️⃣ Admin Login**
- Click **"Admin Login"** → Enter **Username & Password** (default: `admin / 12345`).  
- If correct, the **Create Campaign** form appears.

### **2️⃣ Create a Campaign**
- Enter **Campaign Name**, **Location**, **Goal (ETH)**.  
- Click **"Create Campaign"** → **MetaMask will prompt for confirmation**.  
- Once confirmed, the campaign **appears on the homepage**.

### **3️⃣ Donate to a Campaign**
- Enter the amount in ETH.  
- Click **"Donate"** → **MetaMask will prompt for confirmation**.  
- Upon confirmation, the donation is **recorded on the blockchain**.

---

## **🔧 Troubleshooting**
### **1️⃣ MetaMask - "Internal JSON-RPC error"**
✔ Ensure MetaMask is **connected to the correct network** (Ganache, Goerli, or Sepolia).  
✔ Run:
```sh
truffle migrate --network development --reset
```
✔ Restart the frontend:  
```sh
npm start
```

### **2️⃣ "Sender Account Not Recognized"**
✔ Ensure **Ganache is running** before using Truffle.  
✔ Run in Truffle Console:
```sh
web3.eth.getAccounts().then(console.log)
```
✔ Use a valid sender address when calling `createCampaign` in Truffle.

### **3️⃣ Campaigns Not Appearing**
✔ Run:
```sh
truffle console --network development
DisasterReliefFund.deployed().then(instance => instance.getCampaigns())
```
✔ If empty, **redeploy the contract**.

---

## **🤝 Contributing**
### **🛠 How to Contribute**
1. **Fork the repo** & create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
2. **Make changes & commit**:
   ```sh
   git commit -m "Added new feature"
   ```
3. **Push & create a Pull Request**:
   ```sh
   git push origin feature-branch
   ```
4. We will review your PR & merge it! 🚀

---

## **📜 License**
This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute! 😊  

---

## **⭐ Star this Repository!**
If you found this project useful, **please ⭐ it on GitHub**! 🌟  

---

## **📬 Contact**
💡 If you have any questions, **reach out via GitHub Issues**!  
📩 **Email**: sidharthsaholiya@gmail.com
