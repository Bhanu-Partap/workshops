import { ethers, toBigInt } from 'ethers';
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';

async function sendTx(registry, name) {
  console.log(`Sending register tx to set name=${name}`);
  return registry.register(name);
}

async function sendMetaTx(registry, provider, signer, name) {
  console.log(`Sending register meta-tx to set name=${name}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = registry.interface.encodeFunctionData('register', [name]);
  const to = registry.address;
  
  const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function registerName(registry, provider, name) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.BrowserProvider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  console.log(Number(userNetwork.chainId) ,"chainid is here")

  if (Number(userNetwork.chainId) !== 11155111) throw new Error(`Please switch to Sepolia for signing`);

  const signer = userProvider.getSigner();
  const from = (await signer).address;
  const balance = await provider.getBalance(from);
  const bigBalance = toBigInt(balance)
  const threshold = toBigInt(1e15)

  const canSendTx = bigBalance*threshold;
  console.log((await signer).address);
  const registryWithSigner = await registry.connect((await signer).address);
  if (canSendTx) return sendTx(registryWithSigner, name);
  else return sendMetaTx(registry, provider, signer, name);
}
