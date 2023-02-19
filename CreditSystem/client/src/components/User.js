import React, { useEffect, useState } from 'react';

function User(props) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function fetchUserDetails() {
      const userDetails = await props.user.methods.getUserDetails().call({ from: props.account });
      setUserDetails(userDetails);
    }
    fetchUserDetails();
  }, [props.user, props.account]);

  return (
    <div className="container">
      <h2>User Details</h2>
      {userDetails ? (
        <div>
          <p><strong>Username:</strong> {userDetails[0]}</p>
          <p><strong>Email:</strong> {userDetails[1]}</p>
          <p><strong>Phone:</strong> {userDetails[2]}</p>
        </div>
      ) : (
        <div>Loading User Details...</div>
      )}
    </div>
  );
}

export default User;
