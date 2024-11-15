import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// Helper function to recreate contract instance
function getContract(address, signer) {
  return new ethers.Contract(address, EscrowContract.abi, signer);
}

export async function approve(escrowContract, signer) {
  try {
    console.log("Approving contract at:", escrowContract.address);
    console.log("Signer address:", await signer.getAddress());
    
    const signerAddress = await signer.getAddress();
    console.log("Signer address:", signerAddress);
    
    const approveTxn = await escrowContract.connect(signer).approve();
    console.log("Approval transaction:", approveTxn.hash);
    
    await approveTxn.wait();
    console.log("Approval confirmed");
  } catch (error) {
    console.error("Approval error:", error);
    throw error;
  }
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  // Load account and signer
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    getAccounts();
  }, []);

  // Load stored escrows
  useEffect(() => {
    async function loadStoredEscrows() {
      if (!signer) return;

      const storedEscrows = localStorage.getItem('escrows');
      if (storedEscrows) {
        const escrowsData = JSON.parse(storedEscrows);
        
        // Recreate contract instances and handlers
        const loadedEscrows = escrowsData.map((escrow) => {
          const contract = getContract(escrow.address, signer);
          
          // Reattach event listener when loading
          contract.on('Approved', () => {
            document.getElementById(escrow.address).className = 'complete';
            document.getElementById(escrow.address).innerText = "✓ It's been approved!";
          });

          return {
            ...escrow,
            handleApprove: async () => {
              await approve(contract, signer);
            },
          };
        });

        setEscrows(loadedEscrows);
      }
    }

    loadStoredEscrows();
  }, [signer]);

  // Save escrows to localStorage
  useEffect(() => {
    if (escrows.length > 0) {  // Only save if there are escrows
      // Only save the serializable data
      const serializableEscrows = escrows.map(({ address, arbiter, beneficiary, value }) => ({
        address,
        arbiter,
        beneficiary,
        value,
      }));

      localStorage.setItem('escrows', JSON.stringify(serializableEscrows));
    }
  }, [escrows]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const valueInEther = document.getElementById('ether').value;
    const value = ethers.utils.parseEther(valueInEther);
    
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className = 'complete';
          document.getElementById(escrowContract.address).innerText = "✓ It's been approved!";
        });
        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="container">
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (ETH)
          <input type="text" id="ether" />
        </label>

        <div className="button-container">
    </div>


        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
