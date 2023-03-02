import React, { useState, useEffect } from 'react';

function Dashboard({ loanApplication }) {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allLoans = await loanApplication.getAllLoans();
      setLoans(allLoans);
    }
    fetchData();
  }, [loanApplication]);

  return (
    <div className="container">
      <h2 className="my-4">All Loans</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Amount</th>
            <th>Duration (months)</th>
            <th>Interest Rate (%)</th>
            <th>Interest</th>
            <th>Approved</th>
            <th>Repaid</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.loanId.toString()}>
              <td>{loan.loanId.toString()}</td>
              <td>{loan.amount.toString()}</td>
              <td>{loan.duration.toString()}</td>
              <td>{loan.interestRate.toString()}</td>
              <td>{loan.interest.toString()}</td>
              <td>{loan.approved.toString()}</td>
              <td>{loan.repaid.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

