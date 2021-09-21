import React, { useState, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';


function ChatView({ socket }) {
    
    const [messages, setMessages] = useState( () => {
                        return JSON.parse(localStorage.getItem('messages')) || [];
                        });

    useEffect(() => {
        socket.on('message', (msg) => {
            saveMessage(msg)
        });
    }, [])
    function saveMessage(msg){
        let prevMessages = JSON.parse(sessionStorage.getItem('messages')) ||[];
        let newMessages = [ msg, ...prevMessages];
        sessionStorage.setItem('messages', JSON.stringify(newMessages));
        setMessages(newMessages);
        
    }
    function sendNewMessage(event, userState, currentRoomId){
        event.preventDefault();
        let message = event.target[0].value;
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
                    date: dateStr, 
                    roomId: currentRoomId
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
                ({userState, currentRoomId}) => {
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
                                <form onSubmit={(event)=>sendNewMessage(event,userState, currentRoomId)}>
                                    <input autoFocus className='chat-writing' type="text" placeholder='Type a message...' />
                                    <button className='chat-button'>Send</button>
                                </form>
                            </div>)
                }
            }
        </Context.Consumer>
    );
};

export default ChatView;
