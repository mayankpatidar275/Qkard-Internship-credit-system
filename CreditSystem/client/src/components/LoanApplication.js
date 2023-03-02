import React, { useState } from 'react';

function LoanApplication(props) {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  // const [loanId, setLoanId] = useState('');
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentLoanId, setRepaymentLoanId] = useState('');
  const [approveLoanId, setApproveLoanId] = useState('');
  const [approveLoanAddress, setApproveLoanAddress] = useState('');
  const [approveInterestRate, setApproveInterestRate] = useState('');

  // const [loans, setLoans] = useState([]);

  const handleApplyLoan = async (event) => {
    try {
      event.preventDefault();
      const newLoan = await props.loanApplication.applyForLoan(
        loanAmount, 
        loanDuration, 
        { from: props.account }
      );
      await newLoan.wait(); // Wait for the transaction to be confirmed


      // const loanAppliedFilter = props.loanApplication.filters.LoanApplied(props.account, null);

      // Listen for the LoanApplied event
      // props.loanApplication.on(loanAppliedFilter, (borrower, newloanId) => {
      //   console.log(`Borrower ${borrower} applied for loan ID ${newloanId}`);

      //   // Retrieve loan information
      //   props.loanApplication.getLoan(props.account, newloanId)
      //     .then((loan) => {
      //       console.log(`Loan information for loan ID ${newloanId}:`);
      //       console.log(`- Amount: ${loan.amount}`);
      //       console.log(`- Duration: ${loan.duration}`);
      //       console.log(`- Interest Rate: ${loan.interestRate}`);
      //       // function addLoan(loan) {
      //       setLoans([...loans, loan]);
      //       // }
      //     })
      //     .catch((error) => console.error("Error retrieving loan information:", error));

      //   setLoanId(newloanId.toString());
        
      // });

      // Stop listening for the LoanApplied event after 10 seconds
      // setTimeout(() => {
      //   props.loanApplication.off(loanAppliedFilter);
      // }, 10000);
    } catch (error) {
      console.error("Error applying for loan:", error);
    }
  };

  const handleRepayLoan = async (event) => {
    try {
      event.preventDefault();
      await props.loanApplication.repay(
        props.account,
        repaymentLoanId, 
        repaymentAmount
      );
      console.log("Loan repayment successful!");
    } catch (error) {
      console.error("Error repaying loan:", error);
    }
  };

  const handleApproveLoan = async (event) => {
    try {
      event.preventDefault();
      await props.loanApplication.approveLoan(
        approveLoanAddress,
        approveLoanId, 
        approveInterestRate
      );
      console.log("Loan approval successful!");
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  return (
    <div className="container">
      <h2>Loan Application</h2>
      <form onSubmit={handleApplyLoan}>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount</label>
          <input
            type="number"
            id="loanAmount"
            className="form-control"
            value={loanAmount}
            placeholder="Enter loan amount"
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

      <hr />

      <h2>Approve Loan</h2>
      <form onSubmit={handleApproveLoan}>
      <div className="form-group">
          <label htmlFor="approveBorrowerAddress">borrower address</label>
          <input
            type="text"
            id="approveBorrowerAddress"
            className="form-control"
            value={approveLoanAddress}
            placeholder="Enter borrower address"
            onChange={(event) => setApproveLoanAddress(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="approveLoanId">Loan ID</label>
          <input
            type="text"
            id="approveLoanId"
            className="form-control"
            value={approveLoanId}
            placeholder="Enter loan ID"
            onChange={(event) => setApproveLoanId(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="approveLoanId">Interest rate</label>
          <input
            type="text"
            id="approveLoanId"
            className="form-control"
            value={approveInterestRate}
            placeholder="Enter loan ID"
            onChange={(event) => setApproveInterestRate(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Approve Loan</button>
      </form>

      <h2>Repay Loan</h2>
      <form onSubmit={handleRepayLoan}>
        <div className="form-group">
          <label htmlFor="loanId">Loan ID</label>
          <input
            type="text"
            id="loanId"
            className="form-control"
            value={repaymentLoanId}
            placeholder="Enter loan ID"
            onChange={(event) => setRepaymentLoanId(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="repaymentAmount">Repayment Amount</label>
          <input
            type="number"
            id="repaymentAmount"
            className="form-control"
            placeholder="Enter repayment amount"
            value={repaymentAmount}
            onChange={(event) => setRepaymentAmount(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Repay Loan</button>
      </form>

      <hr />
    </div>
  );
}

export default LoanApplication;

