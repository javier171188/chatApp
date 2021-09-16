import React, { useState, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost";




function ChatView() {
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {
            path: '/mysocket'
        });
        socket.on('message', (message) => {
            console.log(message);
            let newMessages = [...messages];
            newMessages.push(message);
            setMessages([...newMessages]);
        });

        function fastEmit(e,value){
            e.preventDefault();
            console.log(value)
        }
        return () => socket.disconnect();
    }, []);

   
    
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
                                {/*<form onSubmit={(event)=>sendNewMessage(event,userState)}>*/}
                                 <form onSubmit={(e)=>fastEmit(e,'hello')}>
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
