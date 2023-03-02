// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract LoanApplication {
    mapping (address => mapping(uint256 => Loan)) public loans;
    mapping (address => uint256[]) public borrowerLoans;
    mapping (address => uint256) public creditworthiness;
    mapping (address => uint256) public loancounts;

    // Struct to define loan details
    struct Loan {
        uint256 loanId;
        uint256 amount;
        uint256 duration;
        uint256 interestRate;
        uint256 interest;
        bool approved;
        bool repaid;
        uint256 timestamp; //added timestamp field to record the time of loan issuance

    }

    // Array to store the addresses and ids of applied loans
    struct LoanApplicationInfo {
        address borrower;
        uint256 loanId;
    }
    LoanApplicationInfo[] public loanApplications;

    uint256 private loanCounter = 0;
    uint256 public contractBalance = 1000;
    uint256 internal defaultInterestRate = 1;
    // Declare events
    event LoanApplied(address indexed borrower, uint256 loanId);
    event LoanApproved(address indexed borrower, uint256 loanId);
    event LoanRepaid(address indexed borrower, uint256 loanId);
    event InterestRateSet(uint256 amount, uint256 duration, uint256 interestRate);

    //Added mapping to record the number of loans issued and total value of loans by day
    mapping(uint256 => uint256) public loansByDay;
    mapping(uint256 => uint256) public totalLoanValueByDay;
    uint256 public startTime;
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
        startTime = block.timestamp; 
    }
    // function to revert all unknown transactions
    receive () external payable {
        revert("This contract does not accept");
    }

    function generateLoanId(uint256 _amount) public view returns (uint256) {
        bytes32 nonce = keccak256(abi.encodePacked(block.timestamp, msg.sender, _amount));
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _amount, nonce)));
    }

    // Function to apply for a loan
    function applyForLoan(uint256 _amount, uint256 _duration) public returns(uint256){
        // Set default creditworthiness to 50
        if ((creditworthiness[msg.sender] == 0) && (loancounts[msg.sender] == 0)) {
            creditworthiness[msg.sender] = 50;
        }

        require(creditworthiness[msg.sender] >= 50, "Insufficient creditworthiness, you should improve your credit score");

        uint256 interestRate = defaultInterestRate;    // default interest rate

        // Calculate interest
        uint256 interest = _amount * interestRate * _duration / 100;
        
        uint256 loanId = generateLoanId(_amount);

        // Add loan ID to borrower's list of loans
        borrowerLoans[msg.sender].push(loanId);
        // Store loan details
        Loan memory newLoan = Loan(loanId, _amount, _duration, interestRate, interest, false, false, block.timestamp);
        loans[msg.sender][loanId] = newLoan;
        loancounts[msg.sender]++;

        // Store the address and id of the applied loan
        LoanApplicationInfo memory newLoanApplication = LoanApplicationInfo(msg.sender, loanId);
        loanApplications.push(newLoanApplication);

        // Emit event to log loan application
        emit LoanApplied(msg.sender, loanId);

        // test = loanId;
        return loanId;
    }

    // Function to approve a loan
    function approveLoan(address payable _borrower, uint256 _loanId, uint256 _interestRate) public {
        // Check if the loan with the specified ID exists for the borrower
        Loan storage loan = loans[_borrower][_loanId];
        require(loan.loanId == _loanId, "No such loan found");
        // Check if loan is not approved
        require(!loan.approved, "Loan already approved");

        // Check if creditworthiness of the borrower is sufficient
        require(creditworthiness[_borrower] >= 50, "Insufficient creditworthiness, you should improve your credit score");

        // Transfer the loan amount to the borrower
        require(contractBalance >= loan.amount, "Sorry ! Insufficient funds in contract, consider reducing the loan amount or try later");

        //Add the loan to the loansByDay and total value of the loan to loansByDayValue
        uint256 day = (block.timestamp - block.timestamp % 240) / 240; // Get the current day
        loansByDay[day]++;
        totalLoanValueByDay[day] += loan.amount;

        loan.interestRate = _interestRate;
        loan.interest = loan.amount * loan.interestRate * loan.duration / 100;
        // Check the success of the transfer
        // bool transferSuccessful = _borrower.send(loan.amount);
        // require(transferSuccessful, "Transaction failedd");
        contractBalance -= loan.amount;

        // Approve the loan
        loan.approved = true;

        // Emit event to log loan approval
        emit LoanApproved(msg.sender, _loanId);

        // improve the creditworthiness
        creditworthiness[_borrower] += 10;
    }


    function repay(address payable _borrower, uint256 _loanId, uint256 _amount) public payable {
        // Check if the loan with the specified ID exists for the borrower
        require(loans[_borrower][_loanId].loanId == _loanId, "Loan not found.");

        // Check if the loan is approved
        require(loans[_borrower][_loanId].approved, "Loan not approved.");

        // Check if the borrower is paying enough to cover the entire loan
        require(_amount >= loans[_borrower][_loanId].amount + loans[_borrower][_loanId].interest, "Amount is insufficient.");

        contractBalance += (loans[_borrower][_loanId].amount + loans[_borrower][_loanId].interest);
        // Update the amount repaid for the loan
        loans[_borrower][_loanId].amount = 0;
        loans[_borrower][_loanId].repaid = true; // set the loan as repaid

        // Emit event to log loan approval
        emit LoanRepaid(msg.sender, _loanId);
    }

    // Function to retrieve all loans associated with a particular address
    function getBorrowerLoans(address _borrower) public view returns (Loan[] memory) {
        uint256[] memory loanIds = borrowerLoans[_borrower];
        Loan[] memory result = new Loan[](loanIds.length);
        for (uint256 i = 0; i < loanIds.length; i++) {
            result[i] = loans[_borrower][loanIds[i]];
        }
        return result;
    }

    function getAllLoans() public view returns (Loan[] memory) {
        Loan[] memory allLoans = new Loan[](loanApplications.length);

        for (uint i = 0; i < loanApplications.length; i++) {
            allLoans[i] = loans[loanApplications[i].borrower][loanApplications[i].loanId];
        }

        return allLoans;
    }

    
    function getLoan(address addr, uint256 loanId) public view returns (Loan memory) {
        return loans[addr][loanId];
    }

}