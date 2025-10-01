// src/config.js
// ✅ Tunewave token contract
export const tokenAddress = "0xE457c164d488E2Bd1A66d80e83de6be9fa4b877a";

export const tokenAbi = [ 
  // --- Token ABI you sent earlier (shortened for clarity) ---
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
  // 👉 keep the rest of ABI functions here…
];

// ✅ Crowdfunding contract
export const crowdfundingAddress = "0x0E29B0A637721804ffD464BEBCF8da7d78Dfc6CA";

export const crowdfundingAbi = [
  {
    "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "raised", "type": "uint256" }
    ],
    "name": "CampaignClosed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getCampaign",
    "outputs": [
      { "internalType": "address", "name": "artist", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "goal", "type": "uint256" },
      { "internalType": "uint256", "name": "raised", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" },
      { "internalType": "uint256", "name": "revenue", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
  // 👉 keep the rest of ABI functions here…
];