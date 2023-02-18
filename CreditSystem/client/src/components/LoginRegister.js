import React, { useState } from 'react';
import { ethers } from 'ethers';
import RegisterLogin from "../artifacts/contracts/RegisterLogin.sol/RegisterLogin.json";

function LoginRegister({ provider, registerLoginContract, setUser }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await registerLoginContract.login(password);
      setUsername(res);
      setUser(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      await registerLoginContract.register(username, password);
      handleLogin();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Login/Register</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary me-2" onClick={handleLogin}>Login</button>
        <button type="button" className="btn btn-secondary" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
}

export default LoginRegister;
