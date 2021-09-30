import  { useRef, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';
import './../styles/components/ChatView.css';



function ChatView({ socket, setCurrentMessages,  currentMessages, userState, currentRoomId }) {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        //messagesEndRef.current.scrollIntoView()
      }
      useEffect(scrollToBottom, [currentMessages]);

    function addUserToRoom({roomId, userState}){
        console.log('Adding users');
    }
    
    function removeUserFromRoom(){
        console.log('Deleting user');
    }
    
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
        
    userState.conversations.forEach( c => {
        socket.emit('joinGroup', {roomId:c.roomId}, ({_id, lastMessages}) => {
                    });
    });
    return (
        <Context.Consumer>
            {
                ({userState, currentRoomId, currentMessages, currentRoomName, groupRoom }) => {
                    return (<div className='chat'>
                                {currentRoomId && (groupRoom ?
                                                            <div className='chat-header'>
                                                                <h1 className='chat-header__name'>{currentRoomName}</h1> 
                                                                <div className='chat-header__buttons'>
                                                                    <button className='chat-header__add' onClick={()=>{addUserToRoom({roomId:currentRoomId, userState})}}>Add</button>
                                                                    <button className='chat-header__remove' onClick={()=>{removeUserFromRoom()}}>Remove</button>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='chat-header'>
                                                                <h1 className='chat-header__name'>{currentRoomName}</h1> 
                                                            </div>
                                                            )}
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
