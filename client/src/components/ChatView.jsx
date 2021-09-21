//import React, { useState, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';


function ChatView({ socket, setCurrentMessages }) {

    socket.on('updateMessages', returnedMessages => {
        //remember to render only the current conversation's messages
        setCurrentMessages(returnedMessages);
    })

    
    function sendNewMessage(event, userState, currentRoomId, setCurrentMessages){
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
            socket.emit('sendMessage', messageData, (returnedMessages) => {
                //setCurrentMessages(returnedMessages);
                //console.log(returnedMessages);
                
            });
        }

    }

    return (
        <Context.Consumer>
            {
                ({userState, currentRoomId, currentMessages, setCurrentMessages}) => {
                    return (<div className='chat'>
                                <div className='chat-messages'>
                                {currentMessages.map(message => (
                                    <MessageForm 
                                            key={message.date+message.sender._id}
                                            userState={message.userState}
                                            sender={message.sender}
                                            message={message.message}
                                            date={message.date.toString()}
                                        />
                                    ))
                                }  
                                </div>
                               
                                <form onSubmit={(event)=>sendNewMessage(event,userState, currentRoomId, setCurrentMessages)}>
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
