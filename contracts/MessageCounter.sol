// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Minimal counter contract used by BlockBird to track total posted messages.
contract MessageCounter {
    uint256 private count;

    event CounterIncremented(address indexed by, uint256 newCount);

    function increment() public {
        count += 1;
        emit CounterIncremented(msg.sender, count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
