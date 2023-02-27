require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    sepolia: {
      //chainId: 11155111,
      url: "https://dimensional-indulgent-diagram.ethereum-sepolia.discover.quiknode.pro/bf5b425b4615a80bef40e7e63716c216d0560f9c/",
      accounts: [
        "c2e8260b46cf0e9211485c7ae711953433cb0851df22820e262cc7841db9ef5a",
      ],
    },
  },
};
