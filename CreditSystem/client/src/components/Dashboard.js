import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Dashboard({ loanApplication }) {
  const [loans, setLoans] = useState([]);
  const [loansByDay, setLoansByDay] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allLoans = await loanApplication.getAllLoans();
      setLoans(allLoans);
    }
    fetchData();
  }, [loanApplication]);

  useEffect(() => {
    const getLoansByDay = async () => {
      // const days = await loanApplication.methods.getDays().call(); // Assuming getDays() is a function that returns the days for which the loansByDay mapping has data
      const now = new Date();
      const lastDay = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
      const firstDay = parseInt(await loanApplication.startTime());
      const loansByDay = [];
      for (let day = firstDay; day <= lastDay; day++) {
        const loanCount = parseInt(await loanApplication.loansByDay(day));
        console.log(typeof(loanCount));
        loansByDay.push({ day, loanCount });
      }
      setLoansByDay(loansByDay);
    };
    getLoansByDay();
  }, []);

  return (
    <>
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
    <div>
    <h1>Loans By Day</h1>
    <LineChart width={800} height={400} data={loansByDay}>
      <XAxis dataKey="day" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="loanCount" stroke="#8884d8" />
      <Tooltip />
      <Legend />
    </LineChart>
  </div>
  </>
  );
}

export default Dashboard;

