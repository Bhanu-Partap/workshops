/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';

const CLOUDFLARE_ENDPOINT = 'https://sepolia.prylabs.net';
const MAIN_ENDPOINT = 'https://ethereum-sepolia.publicnode.com';
const ALTERNATE_ENDPOINT = 'https://gateway.tenderly.co/public/sepolia';
const UNSECURE_ENDPOINT = 'http://sepolia.blockscout.com';
const QUICKNODE_ENDPOINT = process.env.REACT_APP_QUICKNODE_URL;
const SEPOLIA_ENDPOINT = process.env.SEPOLIA_URL_INFURA;

export function createProvider() {  
  return new ethers.JsonRpcProvider(SEPOLIA_ENDPOINT || MAIN_ENDPOINT, 11155111);
}