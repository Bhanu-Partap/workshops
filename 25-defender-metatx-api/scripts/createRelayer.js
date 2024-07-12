require('dotenv').config();
const {API_KEY, API_SECRET} = process.env


// const { Defender } = require('@openzeppelin/defender-sdk');
const { RelayClient } = require('@openzeppelin/defender-relay-client');
const { appendFileSync, writeFileSync} = require('fs');



async function main() {

  const relayClient = new RelayClient({apiKey: API_KEY, apiSecret: API_SECRET});

  const requestParams = {
    name: 'MetaTxRelayer',
    network: 'sepolia',
    minBalance: BigInt(1e17).toString(),
  };
  const relayer = await relayClient.create(requestParams);
  
  // Store Relayer info in file - ID is all you need if sending tx via Action.
  writeFileSync('relayer.json', JSON.stringify({
    relayer
  }, null, 2));
  console.log('Relayer ID: ', relayer.relayerId);
  

  // Create and save the Relayer API key to .env - needed for sending tx directly
  const {apiKey: relayerKey, secretKey: relayerSecret} = await client.relay.createKey(relayer.relayerId);
  appendFileSync('.env', `\nRELAYER_API_KEY=${relayerKey}\nRELAYER_API_SECRET=${relayerSecret}`);
}

if (require.main === module) {
  main().catch(console.error);
}