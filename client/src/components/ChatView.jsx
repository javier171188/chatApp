import React from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';

import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost";

const messages = [{
                        sender:{
                            _id:2,
                            userName: 'Usering'
                        },
                        message:'hellou',
                        date: 'today'
                    }]




function ChatView() {
    const socket = socketIOClient(ENDPOINT, {
        path: '/mysocket'
    });

    socket.on('message', (message) => {
        console.log(message);
    });
    function sendNewMessage(event, userState){
        event.preventDefault();
        const message = event.target[0].value;
        event.target[0].value = '';
        if (message !== ''){
            let date = new Date();
            let dateStr = date.getTime().toString();
            
            let messageData = {
                    sender: {
                        _id: userState._id,
                        userName: userState.userName
                    },
                    message,
                    date: dateStr
            };
            socket.emit('sendMessage', messageData, (answer) => {
                //function to confirm the message 
                //console.log('The message was delivered', answer);
            });
        }
    }
    return (
        <Context.Consumer>
            {
                ({userState}) => {
                    return (<div className='chat'>
                                <div className='chat-messages'>
                                {messages.map(message => (
                                <MessageForm 
                                        key={message.date+message.sender._id}
                                        userState={message.userState}
                                        sender={message.sender}
                                        message={message.message}
                                        date={message.date.toString()}
                                    />
                                ))}
                                </div>
                                <form onSubmit={(event)=>sendNewMessage(event,userState)}>
                                    <input  className='chat-writing' type="text" placeholder='Type a message...' />
                                    <button className='chat-button'>Send</button>
                                </form>
                            </div>)
                }
            }
        </Context.Consumer>
        
    );
};

export default ChatView;
