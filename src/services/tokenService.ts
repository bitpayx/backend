import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import BitpayXToken from '../abis/BitpayXToken.json';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS!;

const contract = new ethers.Contract(contractAddress, BitpayXToken.abi, provider);

export const getBalance = async (address: string) => {
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18); // Convertir a formato legible
};

export const getTotalSupply = async () => {
  const total = await contract.totalSupply();
  return ethers.formatUnits(total, 18);
};