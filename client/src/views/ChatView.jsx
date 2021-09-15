import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost";

function ChatView() {
    const [response, setResponse] = useState("");
    const socket = socketIOClient(ENDPOINT, {
        path: '/mysocket'
    });

    socket.on('message', (message) => {
        console.log(message);
    });
    function sendNewMessage(event){
        event.preventDefault();
        const message = event.target[0].value;
        event.target[0].value = '';
        if (message !== ''){
            socket.emit('sendMessage', message, (answer) => {
                console.log('The message was delivered', answer);
            });
        }
    }

    return (
        <div className='chat'>
            <div className='chat-messages'>
                    {response}
            </div>
            <form onSubmit={sendNewMessage}>
                <input  className='chat-writing' type="text" placeholder='Type a message...' />
                <button className='chat-button'>Send</button>
            </form>
        </div>
    );
};

export default ChatView;