import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json';

export default async function deploy(signer, arbiter, beneficiary, value) {
  try {
    console.log("Deploying contract with params:", {
      arbiter,
      beneficiary,
      value: value.toString()
    });

    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      signer
    );

    const contract = await factory.deploy(arbiter, beneficiary, {
      value: value
    });

    await contract.deployed();
    console.log("Contract deployed at:", contract.address);
    
    return contract;
  } catch (error) {
    console.error("Deploy error:", error);
    throw error;
  }
}
