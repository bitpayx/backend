import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import BitpayXToken from '../abis/BitpayXToken.json';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const privateKey = process.env.METATASK_PRIVATE_KEY!;

// Signer (wallet que firmará la transacción)
const signer = new ethers.Wallet(privateKey, provider);
// Contrato conectado al signer
const contractWithSigner = new ethers.Contract(contractAddress, BitpayXToken.abi, signer);
// Contrato de solo lectura
const contract = new ethers.Contract(contractAddress, BitpayXToken.abi, provider);

export const getBalance = async (address: string) => {
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18); // Convertir a formato legible
};

export const getTotalSupply = async () => {
  const total = await contract.totalSupply();
  return ethers.formatUnits(total, 18);
};

export const transferTokens = async (to: string, amount: string) => {
  const amountInWei = ethers.parseUnits(amount, 18);
  const tx = await contractWithSigner.transfer(to, amountInWei);
  await tx.wait(); // Esperar confirmación
  return tx.hash; // Devolver hash de transacción
};

