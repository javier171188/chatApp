import  { useRef, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';
import './../styles/components/ChatView.css';


function ChatView({ socket, setCurrentMessages,  currentMessages, userState, currentRoomId }) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
      useEffect(scrollToBottom, [currentMessages]);

    socket.on('updateMessages', ({participants, returnedMessages, roomId}) => {
        //participants = participants.filter((pId) => pId !== userState._id );
        console.log(currentRoomId);
        if (roomId === currentRoomId){
            setCurrentMessages(returnedMessages);
        }else{
            //notify that other conversation has been updated
        }
    })

    
    function sendNewMessage(event, userState, currentRoomId){
        event.preventDefault();
        //console.log(`Sended room id: ${currentRoomId}`);
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
    };
    userState.contacts.forEach( c => {
        socket.emit('joinPersonal', {current:userState._id, receiver:c._id}, ({_id, lastMessages}) => {
                    });
    });
        
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
                                {
                                    !currentRoomId && <h1 className='chat-start'>Click a user or a conversation to start chatting.</h1>
                                }
                                <div ref={messagesEndRef} />
                                </div>
                               { currentRoomId &&
                                <form onSubmit={(event)=>sendNewMessage(event,userState, currentRoomId)}>
                                   <input autoFocus className='chat-writing' type="text" placeholder='Type a message...' />
                                   <button className='chat-button'>Send</button>
                               </form>
                               }
                            </div>)
                }
            }
        </Context.Consumer>
    );
};

export default ChatView;
