import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connect, SimpleSigner } from "uport-connect";
import IdentityRegistryContract from "../contracts/IdentityRegistry.json";
import './App.css';

import RegisterLogin from './components/RegisterLogin';
import LoanApplication from './components/LoanApplication';
import User from './components/User';
import Dashboard from './components/Dashboard';

import RegisterLoginContract from './artifacts/contracts/RegisterLogin.sol/RegisterLogin.json';
import LoanApplicationContract from './artifacts/contracts/LoanApplication.sol/LoanApplication.json';
import UserContract from './artifacts/contracts/User.sol/User.json';

const contractAddress = "0x5Ccc62bB4C1EA54f7D64756F9CbFF7b53c1814Cd";

function App() {
  const [uport, setUport] = useState(null);
  const [ethersProvider, setEthersProvider] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDid, setUserDid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

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

    // const registerLoginAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    // const registerLogin = new ethers.Contract(registerLoginAddress, RegisterLoginContract.abi, signer);
    // setRegisterLogin(registerLogin);
    // const isLoggedIn = await registerLogin.isLogIn();
    // setIsLoggedIn(isLoggedIn);

    const loanApplication = new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", LoanApplicationContract.abi, signer);
    setLoanApplication(loanApplication);
    const user = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", UserContract.abi, signer);
    setUser(user);
  }

  useEffect(() => {
    const initUport = async () => {
      const uport = new Connect("credit system", {
        clientId: "Client ID",
        network: "http://localhost:8545",
        signer: SimpleSigner("uPort Signer Private Key"),
      });
      setUport(uport);

      const ethersProvider = new ethers.providers.Web3Provider(uport.getProvider());
      setEthersProvider(ethersProvider);
    };
    initUport();
  }, []);

  const loginWithUport = async () => {
    if (uport) {
      try {
        // Request user's DID, name, and email
        const credentials = await uport.requestCredentials({
          requested: ["did", "name", "email"],
        });

        // Retrieve user's information from the credentials
        const { did, name, email } = credentials;

        // Update state with user's information
        setUserDid(did);
        setUserName(name);
        setUserEmail(email);
        setIsLoggedIn(true);

        // Call smart contract to store user's information
        if (ethersProvider) {
          const contract = new ethers.Contract(
            contractAddress,
            IdentityRegistryContract.abi,
            ethersProvider.getSigner()
          );
          await contract.addIdentity(did, name, email);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


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
          // <RegisterLogin account={account} registerLogin={registerLogin} />
          <div>
            <h1>Please Login with uPort</h1>
            <button onClick={loginWithUport}>Login with uPort</button>
          </div>
        )}
      </div>
    </div>
  );

}

export default App;
