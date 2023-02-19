// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract User {
    enum UserRole { NormalUser, Admin }

    struct UserData {
        string username;
        bytes32 passwordHash;
        UserRole role;
        address next;
    }

    mapping (address => UserData) private users;

    address private head;
    uint256 private size;

    function addUser(address _userAddress, string memory _username, bytes32 _passwordHash) internal {
        UserData storage newUser = users[_userAddress];
        newUser.username = _username;
        newUser.passwordHash = _passwordHash;
        newUser.role = UserRole.NormalUser;
        newUser.next = head;
        head = _userAddress;
        size++;
    }

    function getUser(address _userAddress) internal view returns (UserData memory) {
        require(_userAddress != address(0), "Invalid address");
        address currentAddress = head;
        while (currentAddress != address(0)) {
            if (currentAddress == _userAddress) {
                return users[_userAddress];
            }
            currentAddress = users[currentAddress].next;
        }
        revert("User not found");
    }

    function updateUserUsername(address _userAddress, string memory _newUsername) internal {
        require(_userAddress != address(0), "Invalid address");
        require(bytes(_newUsername).length != 0, "Username must not be empty");
        users[_userAddress].username = _newUsername;
    }

    function deleteUser(address _userAddress) internal {
        require(_userAddress != address(0), "Invalid address");
        require(bytes(users[_userAddress].username).length > 0, "User not found");
        address currentAddress = head;
        if (currentAddress == _userAddress) {
            head = users[_userAddress].next;
            size--;
            return;
        }
        while (users[currentAddress].next != address(0)) {
            if (users[currentAddress].next == _userAddress) {
                users[currentAddress].next = users[_userAddress].next;
                size--;
                return;
            }
            currentAddress = users[currentAddress].next;
        }
        revert("User not found");
    }

    function getUserRole(address _userAddress) internal view returns (UserRole) {
        return users[_userAddress].role;
    }

    function setUserRole(address _userAddress, UserRole _role) internal {
        require(_userAddress != address(0), "Invalid address");
        users[_userAddress].role = _role;
    }

    function getUsersList() external view returns (address[] memory) {
        address[] memory list = new address[](size);
        address currentAddress = head;
        uint256 i = 0;
        while (currentAddress != address(0)) {
            list[i] = currentAddress;
            currentAddress = users[currentAddress].next;
            i++;
        }
        return list;
    }
}
