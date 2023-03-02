const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy User contract
  const User = await hre.ethers.getContractFactory("User");
  const user = await User.deploy();
  await user.deployed();
  console.log("User contract deployed to:", user.address);

  // Deploy RegisterLogin contract
  const RegisterLogin = await hre.ethers.getContractFactory("RegisterLogin");
  const registerLogin = await RegisterLogin.deploy();
  await registerLogin.deployed();
  console.log("RegisterLogin contract deployed to:", registerLogin.address);

  // Deploy LoanApplication contract
  const LoanApplication = await hre.ethers.getContractFactory("LoanApplication");
  // const loanApplication = await LoanApplication.deploy(registerLogin.address);
  const loanApplication = await LoanApplication.deploy();

  await loanApplication.deployed();
  console.log("LoanApplication contract deployed to:", loanApplication.address);

  await registerLogin.setUserContract(user.address);

  console.log("Deployment completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
