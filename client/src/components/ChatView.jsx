import  { useRef, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';


function ChatView({ socket, setCurrentMessages,  currentMessages}) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
      useEffect(scrollToBottom, [currentMessages]);

    socket.on('updateMessages', returnedMessages => {
        //remember to render only the current conversation's messages
        setCurrentMessages(returnedMessages);
        //console.log(returnedMessages);
    })

    
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
                //setCurrentMessages(returnedMessages);
                //console.log(returnedMessages);
                
            });
        }

    }

    return (
        <Context.Consumer>
            {
                ({userState, currentRoomId, currentMessages}) => {
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
                                <div ref={messagesEndRef} />
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
