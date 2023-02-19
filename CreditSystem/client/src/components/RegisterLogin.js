import React, { useRef } from 'react';

function RegisterLogin(props) {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleRegister = (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    console.log("before");
    console.log(typeof(username));
    console.log(typeof(password));
    props.registerLogin.methods.register(username, password).send({ from: props.account });
    console.log("after");
  };

  return (
    <div className="container">
      <h2>Register/Login</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit" className="btn btn-primary">Register/Login</button>
      </form>
    </div>
  );
}

export default RegisterLogin;
