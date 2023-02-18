import React, { useState } from 'react';
import { ethers } from 'ethers';
import LoanApplication from "../artifacts/contracts/LoanApplication.sol/LoanApplication.json";

function ApplyLoan({ provider, loanApplicationContract, user }) {

  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleApplyForLoan = async () => {
    try {
      await loanApplicationContract.applyForLoan(amount, duration);
      console.log('Loan application successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Apply for Loan</h2>
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Duration:
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </label>
      </div>
      <button onClick={handleApplyForLoan}>Apply for Loan</button>
    </div>
  );
}

export default ApplyLoan;
