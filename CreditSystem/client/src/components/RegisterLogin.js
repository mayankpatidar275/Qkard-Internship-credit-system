import React, { useRef } from 'react';

function RegisterLogin(props) {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleRegister = async (event) => {
    event.preventDefault();
  
    const { registerLogin, account } = props;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
  
    if (!username || !password) {
      console.log("Username and password are required.");
      return;
    }

    try {
      await registerLogin.register(username, password, { from: account });
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const { registerLogin, account } = props;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      console.log("Username and password are required.");
      return;
    }

    try {
      await registerLogin.login( password, { from: account });
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="container">
      <h2>Register/Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter username"
            ref={usernameRef}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter password"
            ref={passwordRef}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={handleRegister}>Register</button>
        <button type="submit" className="btn btn-primary" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
}

export default RegisterLogin;
