// import React, { useState } from 'react';
// import { Connect, SimpleSigner } from 'uport-connect';
// import Web3 from 'web3';

// const web3 = new Web3();

// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [did, setDid] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   async function handleRegister() {
//     setLoading(true);
//     setError(null);

//     const uport = new Connect('Web3 Credit System', {
//       clientId: '<YOUR_CLIENT_ID>',
//       network: '<YOUR_NETWORK>',
//       signer: SimpleSigner('<YOUR_SIGNER>')
//     });

//     const web3Provider = uport.getProvider();
//     web3.setProvider(web3Provider);

//     const { did: userDid } = await uport.requestCredentials({ requested: ['name', 'email', 'did'] });
//     setDid(userDid);

//     try {
//       const contract = new web3.eth.Contract(<YOUR_ABI>, <YOUR_CONTRACT_ADDRESS>);
//       await contract.methods.register(name, email, userDid).send({ from: userDid });
//       alert('Registration successful!');
//     } catch (err) {
//       console.error(err);
//       setError('Error registering user.');
//     }

//     setLoading(false);
//   }

//   return (
//     <div>
//       <h2>Register</h2>
//       <div>
//         <label htmlFor="name">Name</label>
//         <input
//           id="name"
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={e => setName(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="email">Email</label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//         />
//       </div>
//       <button onClick={handleRegister} disabled={loading}>Register</button>
//       {did && <p>Your uPort DID: {did}</p>}
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// }

// export default Register;
