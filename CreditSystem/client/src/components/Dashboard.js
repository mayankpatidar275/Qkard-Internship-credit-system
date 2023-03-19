import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // replace with your server URL

function Dashboard({ loanApplication }) {
  const [loans, setLoans] = useState([]);
  const [loansByDay, setLoansByDay] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allLoans = await loanApplication.getAllLoans();
      const loansString = allLoans.map((loan) => {
        return {
          "loanId": loan.loanId.toString(),
          "amount": loan.amount.toString(),
          "duration": loan.duration.toString(),
          "interestRate": loan.interestRate.toString(),
          "interest": loan.interest.toString(),
          "approved": loan.approved.toString(),
          "repaid": loan.repaid.toString(),
        };
      });
      await storeDataInSql(loansString);
    }

    fetchData();
  }, [loanApplication]);

  const storeDataInSql = async (data) => {
    try {
      // console.log(data);
      const response = await fetch('http://localhost:8000/store-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Data stored in SQL:', result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on('loansUpdate', (loansData) => {
      console.log('Loans update received:', loansData);
      setLoans(loansData);
    });

    return () => {
      socket.off('loansUpdate');
    };
  }, []);

  useEffect(() => {
    const getLoansByDay = async () => {
      const now = new Date();
      const lastDay = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
      const firstDay = parseInt(await loanApplication.startTime());
      const loansByDay = [];
      for (let day = firstDay; day <= lastDay; day++) {
        const loanCount = parseInt(await loanApplication.loansByDay(day));
        console.log(typeof (loanCount));
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
              <tr key={loan.loanId}>
                <td>{loan.loanId}</td>
                <td>{loan.amount}</td>
                <td>{loan.duration}</td>
                <td>{loan.interestRate}</td>
                <td>{loan.interest}</td>
                <td>{loan.approved}</td>
                <td>{loan.repaid}</td>
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

// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// // import { create } from 'ipfs-http-client';

// function Dashboard({ loanApplication }) {
//   const [loans, setLoans] = useState([]);
//   const [loansByDay, setLoansByDay] = useState([]);
//   // const [ipfs, setIpfs] = useState(null);
//   // const [ipfsHash, setIpfsHash] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       const allLoans = await loanApplication.getAllLoans();
//       const loansString = allLoans.map((loan) => {
//         return {
//           loanId: loan.loanId.toString(),
//           amount: loan.amount.toString(),
//           duration: loan.duration.toString(),
//           interestRate: loan.interestRate.toString(),
//           interest: loan.interest.toString(),
//           approved: loan.approved.toString(),
//           repaid: loan.repaid.toString(),
//         };
//       });
//       // if (ipfs !== null) {
//       await storeDataOnIpfs(loansString);
//       // }
//       await getDataFromIpfs();
//     }

//     fetchData();
//   }, [loanApplication]);

//   const storeDataOnIpfs = async (data) => {
//     try {
//       const result = await ipfs.add(JSON.stringify(data));
//       console.log('IPFS hash:', result.path);
//       setIpfsHash(result.path);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getDataFromIpfs = async () => {
//     try {
//       if (ipfsHash) {
//         const data = await ipfs.cat(ipfsHash);
//         let ipfsData = '';
//         for await (const chunk of data) {
//           ipfsData += chunk.toString();
//         }
//         const loansString = JSON.parse(ipfsData);
//         console.log(loansString);
//         setLoans(loansString);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

  // const getDataFromIpfs = async () => {
  //   try {
  //     const ipfsPath = ipfsPath = CID.parse(IpfsHash);
  //     const content = [];
  //     for await (const chunk of ipfs.cat(ipfsPath)) {
  //       content.push(chunk);
  //     }
  //     const decodedContent = new TextDecoder().decode((content[0]));
  //     console.log('Data from IPFS:', decodedContent);
  //     setDatabase(decodedContent);
  //   } catch (error) {
  //     console.error('Error getting data from IPFS:', error);
  //   }
  // };



  // const storeDataOnIpfs = async (data) => {
  //   try {
  //     // Upload the data to IPFS
  //     const result = await ipfs.add(data);

  //     console.log('IPFS hash:', result.cid.toString());
  //     setIpfsHash(result.cid.toString());
  //   } catch (error) {
  //     console.error('Error storing data on IPFS:', error);
  //   }
  // };
















































  // const storeDataOnPinata = async (data) => {
  //   try {
  //     const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         pinata_api_key: '5a82bdad79085e0d2ea5',
  //         pinata_secret_api_key: '0b94201e4e952a819f363045e072e98a0d22e962497498260f764d811c31b102',
  //       },
  //       data: {
  //         pinataMetadata: {
  //           name: 'loans.json',
  //         },
  //         pinataContent: data,
  //       },
  //     };
  //     const response = await axios(url, options);
  //     console.log('IPFS hash:', response.data.IpfsHash);
  //     setIpfsHash(response.data.IpfsHash);
  //   } catch (error) {
  //     console.error('Error storing data on Pinata:', error);
  //   }
  // };

  // const getDataFromIpfs = async () => {
  //   try {
  //     const url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
  //     const response = await axios.get(url);
  //     console.log('Data from IPFS:', response.data);
  //     setDatabase(response.data);
  //   } catch (error) {
  //     console.error('Error getting data from IPFS:', error);
  //   }
  // };




// This info will only be shown once
// Make sure you store the info somewhere safe

// API Key
// 5a82bdad79085e0d2ea5

// API Secret
// 0b94201e4e952a819f363045e072e98a0d22e962497498260f764d811c31b102

// JWT
// (Secret access token)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYzU0MGUxMy1mYTE5LTQzNTYtODA2ZS1hODg3NzVjZjk5NzIiLCJlbWFpbCI6Im1heWFua3BhdGlkYXIyNzVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVhODJiZGFkNzkwODVlMGQyZWE1Iiwic2NvcGVkS2V5U2VjcmV0IjoiMGI5NDIwMWU0ZTk1MmE4MTlmMzYzMDQ1ZTA3MmU5OGEwZDIyZTk2MjQ5NzQ5ODI2MGY3NjRkODExYzMxYjEwMiIsImlhdCI6MTY3ODExMDE0NH0.uUR9vxzYIRO_rMsQRngAtuOmLPfWQhFmiYomeQuzMAE

// Access-Control-Allow-Origin: http://localhost:3000
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Access-Control-Allow-Headers: Content-Type


//Replace the '*' with the origin of your ex: localhost http://localhost:3000 it will enchance security
