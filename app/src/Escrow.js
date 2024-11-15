import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow.json';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    async function checkApprovalStatus() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(address, EscrowContract.abi, provider);
      const approved = await contract.isApproved();
      setIsApproved(approved);
    }
    checkApprovalStatus();
  }, [address]);

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {ethers.utils.formatEther(value)} ETH </div>
        </li>
        {isApproved ? (
          <div className="complete">✓ It's been approved!</div>
        ) : (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();
              handleApprove();
            }}
          >
            Approve
          </div>
        )}
      </ul>
    </div>
  );
}
