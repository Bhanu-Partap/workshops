require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('hardhat')
const { writeFileSync } = require('fs')

async function main() {
  const creds = {
    relayerApiKey: process.env.API_KEY,
    relayerApiSecret: process.env.API_SECRET,
  };
  const client = new Defender(creds);

  const provider = client.relaySigner.getProvider();
  const signer = client.relaySigner.getSigner(provider, { speed: 'fast' });

  const forwarderFactory = await ethers.getContractFactory('ERC2771Forwarder', signer)
  const forwarder = await forwarderFactory.deploy('ERC2771Forwarder')
    .then((f) => f.deployed())

  const registryFactory = await ethers.getContractFactory('Registry', signer)
  const registry = await registryFactory.deploy(forwarder.address)
    .then((f) => f.deployed())

  writeFileSync(
    'deploy.json',
    JSON.stringify(
      {
        ERC2771Forwarder: forwarder.address,
        Registry: registry.address,
      },
      null,
      2
    )
  )

  console.log(
    `ERC2771Forwarder: ${forwarder.address}\nRegistry: ${registry.address}`
  )
}

if (require.main === module) {
  main().catch(console.error);
}

// SEPOLIA_KEY: 96821ac4b63e4f349f5b25d47e91f571
// PRIVATE_KEY: 2448a6d99f541c0b355a1092072a5b0222911f2410854b1218c1c2daacd3977b
// ERC2771Forwarder: 0xeC7fC1DbD0Ba594c6D80F3f360251fD83A5f616E
// Registry: 0x9fD3e97314bCf4559730194d3eCB4A16e7d9D679

const SEPOLIA_ENDPOINT = SEPOLIA_KEY;

require('dotenv').config()
const {SEPOLIA_KEY} = process.env