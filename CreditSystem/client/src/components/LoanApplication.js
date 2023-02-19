import React, { useState } from 'react';

function LoanApplication(props) {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await props.loanApplication.methods.applyForLoan(loanAmount, loanDuration).send({ from: props.account });
  };

  return (
    <div className="container">
      <h2>Loan Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount</label>
          <input
            type="number"
            id="loanAmount"
            className="form-control"
            placeholder="Enter loan amount"
            value={loanAmount}
            onChange={(event) => setLoanAmount(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanDuration">Loan Duration</label>
          <input
            type="number"
            id="loanDuration"
            className="form-control"
            placeholder="Enter loan duration in months"
            value={loanDuration}
            onChange={(event) => setLoanDuration(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Apply for Loan</button>
      </form>
    </div>
  );
}

export default LoanApplication;
