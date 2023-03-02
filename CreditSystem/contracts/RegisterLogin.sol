// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./User.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RegisterLogin is User, Ownable {
    address public userContract;

    function setUserContract(address _userContract) public onlyOwner {
        require(_userContract != address(0), "Invalid contract address");
        userContract = _userContract;
    }
    
    enum UserStatus { NotRegistered, Registered, LoggedIn }
    enum Action { AdminAction }

    using Strings for uint256;

    mapping (address => UserStatus) private userStatuses;

    function isLogIn() public view returns (bool) {
        return userStatuses[msg.sender] == UserStatus.LoggedIn;
    }
    function logout() external {
        require(userStatuses[msg.sender] == UserStatus.LoggedIn, "User is not registered");
        // deleteUser(msg.sender);
        userStatuses[msg.sender] = UserStatus.Registered;
    }

    function register(string memory _username, string memory _password) external {
        require(bytes(_username).length != 0, "Username must not be empty.");
        require(userStatuses[msg.sender] == UserStatus.NotRegistered, "User is already registered");

        addUser(msg.sender, _username, keccak256(abi.encodePacked(_password)));
        userStatuses[msg.sender] = UserStatus.Registered;
    }

    function login(string memory _password) public returns (string memory) {
        require(userStatuses[msg.sender] == UserStatus.Registered, "User is not registered");
        require(keccak256(abi.encodePacked(_password)) == getUser(msg.sender).passwordHash, "Incorrect password");
        userStatuses[msg.sender] = UserStatus.LoggedIn;
        return getUser(msg.sender).username;
    }

    function updateUsername(string memory _newUsername) external {
        require(userStatuses[msg.sender] == UserStatus.Registered, "User is not registered");
        require(bytes(_newUsername).length != 0, "Username must not be empty");

        updateUserUsername(msg.sender, _newUsername);
    }

    function performAction(Action _action) view public onlyOwner {
        require(userStatuses[msg.sender] == UserStatus.Registered, "User is not registered");
        require(_action == Action.AdminAction, "Unsupported action");

        if (_action == Action.AdminAction && getUserRole(msg.sender) != UserRole.Admin) {
            revert("Unauthorized access");
        }
    }

    function transferContractOwnership(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }
}
