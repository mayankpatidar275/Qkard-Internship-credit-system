import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import RegisterLogin from './components/RegisterLogin';
import LoanApplication from './components/LoanApplication';
import User from './components/User';
import Dashboard from './components/Dashboard';

import RegisterLoginContract from './artifacts/contracts/RegisterLogin.sol/RegisterLogin.json';
import LoanApplicationContract from './artifacts/contracts/LoanApplication.sol/LoanApplication.json';
import UserContract from './artifacts/contracts/User.sol/User.json';

function App() {
  const [account, setAccount] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerLogin, setRegisterLogin] = useState(null);
  const [loanApplication, setLoanApplication] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      await loadWeb3();
      await loadBlockchainData();
    }
    loadData();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async function loadBlockchainData() {
    const provider = window.web3Provider;
    const signer = provider.getSigner();
    const accounts = await provider.listAccounts();
    setAccount(accounts[0]);

    const registerLoginAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const registerLogin = new ethers.Contract(registerLoginAddress, RegisterLoginContract.abi, signer);
    setRegisterLogin(registerLogin);
    const isLoggedIn = await registerLogin.isLogIn();
    setIsLoggedIn(isLoggedIn);

    const loanApplication = new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", LoanApplicationContract.abi, signer);
    setLoanApplication(loanApplication);
    const user = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", UserContract.abi, signer);
    setUser(user);


  }

  return (
    <div className="App">
      <h1 className="App-title">Loan Application System</h1>
      <div className="container-fluid mt-5">
        {isLoggedIn ? (
          <>
            <User account={account} user={user} registerLogin={registerLogin} />
            <Dashboard loanApplication={loanApplication} />
            <LoanApplication
              account={account}
              loanApplication={loanApplication}
              user={user}
            />
          </>
        ) : (
          <RegisterLogin account={account} registerLogin={registerLogin} />
        )}
      </div>
    </div>
  );

}

export default App;

