// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BlockBird {
    struct Message {
        string text;
        address sender;
        uint256 timestamp;
        bool read;
    }

    Message[] public messages;

    // Counter contract interface
    interface IMessageCounter {
        function increment() external;
        function getCount() external view returns (uint256);
    }

    address public counter;
    address public owner;

    event MessagePosted(address indexed sender, uint256 timestamp, string message);

    constructor(address _counter) {
        owner = msg.sender;
        if (_counter != address(0)) {
            counter = _counter;
        }
    }

    function setCounter(address _counter) public {
        require(msg.sender == owner, "Only owner");
        require(_counter != address(0), "Invalid counter address");
        counter = _counter;
    }

    function writeMessage(string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 300, "Message exceeds 300 characters");
        require(counter != address(0), "Counter not set");

        messages.push(Message({
            text: _message,
            sender: msg.sender,
            timestamp: block.timestamp,
            read: false
        }));

        emit MessagePosted(msg.sender, block.timestamp, _message);

        // Increment external counter; if this call fails, revert to keep consistency
        IMessageCounter(counter).increment();
    }

    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }

    function getTotalMessages() public view returns (uint256) {
        require(counter != address(0), "Counter not set");
        return IMessageCounter(counter).getCount();
    }

    function readAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function readUnreadMessages() public returns (Message[] memory) {
        uint256 len = messages.length;
        uint256 unreadCount = 0;

        for (uint256 i = 0; i < len; i++) {
            if (!messages[i].read) {
                unreadCount++;
            }
        }

        Message[] memory unread = new Message[](unreadCount);
        uint256 j = 0;
        for (uint256 i = 0; i < len; i++) {
            if (!messages[i].read) {
                unread[j] = messages[i];
                messages[i].read = true;
                j++;
            }
        }

        return unread;
    }

    function getMessage(uint256 index) public view returns (Message memory) {
        require(index < messages.length, "Index out of bounds");
        return messages[index];
    }
}
