require('dotenv').config();
const {API_KEY, API_SECRET, RELAYER_ID} = process.env

const { Defender } = require('@openzeppelin/defender-sdk');
const { appendFileSync, writeFileSync} = require('fs');

async function main() {
  const creds = { apiKey: API_KEY, apiSecret: API_SECRET };
  const client = new Defender(creds);

  // Create Relayer using Defender SDK client.
  const requestParams = {
    name: 'MetaTxRelayer',
    network: 'sepolia',
    minBalance: BigInt(1e17).toString(),
  };

  const relayer = await client.relay.create(requestParams);
  
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



// require('dotenv').config();
// const { RelayClient } = require('@openzeppelin/defender-relay-client');
// const { appendFileSync, writeFileSync } = require('fs');

// const { API_KEY, API_SECRET } = process.env;

// async function createRelayerWithRetry(client, params, retries = 3, delay = 5000) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const relayer = await client.create(params);
//       return relayer;
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed: ${error.message}`);
//       if (attempt < retries) {
//         console.log(`Retrying in ${delay / 1000} seconds...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//       } else {
//         throw new Error('Max retries reached. Could not create relayer.');
//       }
//     }
//   }
// }

// async function main() {
//   if (!API_KEY || !API_SECRET) {
//     throw new Error('Missing API_KEY or API_SECRET in environment variables');
//   }

//   const relayClient = new RelayClient({ apiKey: API_KEY, apiSecret: API_SECRET });

//   const requestParams = {
//     name: 'MetaTxRelayer',
//     network: 'sepolia',
//     minBalance: BigInt(1e17).toString(),
//   };

//   try {
//     const relayer = await createRelayerWithRetry(relayClient, requestParams);

//     writeFileSync('relayer.json', JSON.stringify({ relayer }, null, 2));
//     console.log('Relayer ID: ', relayer.relayerId);

//     const { apiKey: relayerKey, secretKey: relayerSecret } = await relayClient.createKey(relayer.relayerId);
//     appendFileSync('.env', `\nRELAYER_API_KEY=${relayerKey}\nRELAYER_API_SECRET=${relayerSecret}`);
//   } catch (error) {
//     console.error('Error creating relayer:', error);
//   }
// }

// if (require.main === module) {
//   main().catch(console.error);
// }