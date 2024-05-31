// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BlockBird {
    // Estructura para almacenar mensajes
    struct Message {
        string text;
        address sender;
        bool read;
    }

    // Lista de mensajes
    Message[] public messages;

    // Evento para notificar la llegada de un nuevo mensaje
    event NewMessage(address indexed sender, string message);

    // Función para escribir un mensaje
    function writeMessage(string memory _message) public {
        require(
            bytes(_message).length <= 300,
            "Message exceeds 300 characters"
        );
        messages.push(
            Message({text: _message, sender: msg.sender, read: false})
        );
        emit NewMessage(msg.sender, _message);
    }

    // Función para leer todos los mensajes
    function readAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    // Función para leer mensajes no leídos
    function readUnreadMessages() public returns (Message[] memory) {
        uint unreadCount = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (!messages[i].read) {
                unreadCount++;
                messages[i].read = true; // Marcar como leído
            }
        }

        Message[] memory unreadMessages = new Message[](unreadCount);
        uint j = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (messages[i].read && unreadCount > 0) {
                unreadMessages[j] = messages[i];
                j++;
            }
        }

        return unreadMessages;
    }
}
