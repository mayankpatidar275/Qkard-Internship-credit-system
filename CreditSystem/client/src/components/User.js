import React, { useEffect, useState } from 'react';

function User(props) {
  const [userDetails, setUserDetails] = useState(null);

  const handleLogout = async () => {
    try {
      await props.registerLogin.logout({ from: props.account });
      setUserDetails(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        // console.log(props.registerLogin.users(props.account));
        const userDetails = await props.registerLogin.users(props.account);
        setUserDetails(userDetails);

      } catch (e) {
        console.log(`Error retrieving user details: ${e}`);
      }
    }
    fetchUserDetails();
  }, [props.registerLogin, props.account]);
  

  return (
    <div className="container">
      {/* <h2>User Details</h2> */}
      {userDetails ? (
        <div>
          <h2><strong>Welcome </strong> {userDetails[0]}</h2>
          <p><strong>Your address:</strong> {props.account}</p>
          {/* <p><strong>Phone:</strong> {userDetails[2]}</p> */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>Loading User Details...</div>
      )}
    </div>
  );
}

export default User;
