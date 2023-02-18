import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LoanApplication from './artifacts/contracts/LoanApplication.sol/LoanApplication.json';
import './App.css';
import Login from './components/LoginRegister';
import ApplyLoan from './components/ApplyLoan';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);
  const [loanApplicationContract, setLoanApplicationContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();

        const contractAddress = LoanApplication.networks[network.chainId].address;
        const loanApplicationContract = new ethers.Contract(contractAddress, LoanApplication.abi, signer);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const user = accounts[0];

        setIsLoggedIn(true);
        setProvider(provider);
        setLoanApplicationContract(loanApplicationContract);
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleLogout = async () => {
    try {
      await window.ethereum.request({ method: 'eth_logout' });

      setIsLoggedIn(false);
      setProvider(null);
      setLoanApplicationContract(null);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyLoanClick = () => {
    setIsApplyingLoan(true);
  };

  const renderMainContent = () => {
    if (isLoggedIn && isApplyingLoan) {
      return (
        <ApplyLoan provider={provider} loanApplicationContract={loanApplicationContract} user={user} />
      );
    } else if (isLoggedIn) {
      return (
        <div>
          <h2>Welcome, {user}!</h2>
          <button onClick={handleApplyLoanClick}>Apply for Loan</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <Login />
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loan DApp</h1>
      </header>
      <main>
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
