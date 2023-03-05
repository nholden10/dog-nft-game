require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const QUIKNODE_API_KEY = process.env.QUIKNODE_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    sepolia: {
      chainId: 11155111,
      url: `https://dimensional-indulgent-diagram.ethereum-sepolia.discover.quiknode.pro/bf5b425b4615a80bef40e7e63716c216d0560f9c/`,
      accounts: PRIVATE_KEY,
    },
  },
};
