// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract UserRegistry {
    struct Identity {
        string did;
        string name;
        string email;
        // add other relevant information here
    }

    mapping(address => Identity) private identities;
    mapping(address => mapping(address => bool)) private access;

    event IdentityAdded(address indexed user, string did);
    event IdentityUpdated(address indexed user, string did);
    event AccessGranted(address indexed user, address indexed dApp);

    function addIdentity(
        string memory _did,
        string memory _name,
        string memory _email
    ) public {
        require(bytes(_did).length > 0, "DID must not be empty");
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_email).length > 0, "Email must not be empty");

        Identity storage identity = identities[msg.sender];
        identity.did = _did;
        identity.name = _name;
        identity.email = _email;

        emit IdentityAdded(msg.sender, _did);
    }

    function updateIdentity(
        string memory _did,
        string memory _name,
        string memory _email
    ) public {
        require(bytes(_did).length > 0, "DID must not be empty");
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_email).length > 0, "Email must not be empty");

        Identity storage identity = identities[msg.sender];
        identity.did = _did;
        identity.name = _name;
        identity.email = _email;

        emit IdentityUpdated(msg.sender, _did);
    }

    function grantAccess(address _user, address _dApp) public {
        access[_user][_dApp] = true;
        emit AccessGranted(_user, _dApp);
    }

    function revokeAccess(address _user, address _dApp) public {
        access[_user][_dApp] = false;
    }

    function hasAccess(
        address _user,
        address _dApp
    ) public view returns (bool) {
        return access[_user][_dApp];
    }

    function getIdentity(
        address _user
    ) public view returns (string memory, string memory, string memory) {
        Identity memory identity = identities[_user];
        return (identity.did, identity.name, identity.email);
    }
}
