require('dotenv').config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  console.log(accounts);

  for (const account of accounts) {
    console.log(account.address);
  }
});

console.log(`SEPOLIA_KEY: ${process.env.SEPOLIA_KEY}`);
console.log(`PRIVATE_KEY: ${process.env.PRIVATE_KEY}`);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.SEPOLIA_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
};
