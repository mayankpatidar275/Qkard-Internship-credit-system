import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import RegisterLogin from './components/RegisterLogin';
import LoanApplication from './components/LoanApplication';
import User from './components/User';
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

      const registerLoginAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
      const registerLogin = new ethers.Contract(registerLoginAddress, RegisterLoginContract.abi, signer);
      setRegisterLogin(registerLogin);
      const isLoggedIn = await registerLogin.isLoggedIn();
      setIsLoggedIn(isLoggedIn);
   
      const loanApplication = new ethers.Contract("0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e", LoanApplicationContract.abi, signer);
      setLoanApplication(loanApplication);
      const user = new ethers.Contract("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318", UserContract.abi, signer);
      setUser(user);
 
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Loan Application System</h1>
      </header>
      <div className="row">
        <div className="container-fluid mt-5">
          <main role="main" className="col-lg-12 d-flex text-center">
            {isLoggedIn ? (
              <>
                <LoanApplication
                  account={account}
                  loanApplication={loanApplication}
                  user={user}
                />
                <User account={account} user={user} />
              </>
            ) : (
              <RegisterLogin account={account} registerLogin={registerLogin} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
