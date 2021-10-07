import  { useState, useRef, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';
import AddingUsers from './AddingUsers';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './../styles/components/ChatView.css';

require('dotenv').config();
const USER_PATH=process.env.USER_PATH;



function ChatView({ socket, setCurrentMessages,  currentMessages, userState, currentRoomId }) {
    /*const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth",
                                                alignToTop: false });
        messagesEndRef.current.scrollTo(0,5000);
    }
    useEffect(scrollToBottom, [currentMessages]);
    console.log('5000t');*/
    const { t, i18n } = useTranslation();
    
    useEffect(() => {
        let $messages = document.querySelector('.chat-messages');
        if ($messages){
            $messages.scrollTop = $messages.scrollHeight;    
        }
      }, [currentMessages]);
    
    

    const [currentUsers, setCurrentUsers] = useState([]);
    

    function addUserToRoom({roomId, userState, setAddingUser}){
        socket.emit('getRoom', {roomId}, ({participants})=>{
            setCurrentUsers(participants);
        })
        setAddingUser(true);
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
            socket.emit('sendMessage', messageData, (participants) => {
                //setCurrentMessages(returnedMessages);
                let notCurrentParticipants
                if (typeof participants[0] !== 'object'){
                    notCurrentParticipants = participants.filter( p => p !== userState._id);
                } else {
                    notCurrentParticipants = participants.filter(p => p._id !== userState._id);
                }
               
                let conf = {
                    headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                            },
                    params:{
                        senderId: userState._id,
                        receiver: '',
                        newStatus: true, 
                        roomId: currentRoomId
                    }
                }
                notCurrentParticipants.forEach( p => {
                    conf.params.receiver = p;
                    //console.log(conf.receiver);
                    axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
                })

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
                ({userState, 
                  contactStatus, 
                  currentRoomId, 
                  currentMessages, 
                  currentRoomName, 
                  groupRoom, 
                  addingUser, 
                  setAddingUser }) => {
                    return (<div className='chat'>
                                {currentRoomId && (groupRoom ?
                                                            <div className='chat-header'>
                                                                <h1 className='chat-header__name'>{currentRoomName}</h1> 
                                                                <div className='chat-header__buttons'>
                                                                    <button className='chat-header__add' onClick={()=>{addUserToRoom({roomId:currentRoomId, userState, setAddingUser})}}>{t('Add')}</button>
                                                                    <button className='chat-header__remove' onClick={()=>{removeUserFromRoom()}}>{t('Remove')}</button>
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
                                        !currentRoomId && <h1 className='chat-start'>{t('Click a user or a conversation to start chatting.')}</h1>
                                    }
                                    {
                                        contactStatus === 'pending'   && <h1 className='chat-start'>{ currentRoomName + t(' has not accepted your request yet.')}</h1>
                                    }
                                    {
                                        contactStatus === 'request'   && <h1 className='chat-start'>{ currentRoomName + t(' wants to add you as a contact.')}</h1>
                                    }
                                    {/*<div ref={messagesEndRef} />*/}
                                </div>
                               { (currentRoomId && currentRoomId !== '1') &&
                                <form onSubmit={(event)=>sendNewMessage(event,userState, currentRoomId)}>
                                   <input autoFocus className='chat-writing' type="text" placeholder={t('Type a message...')} />
                                   <button className='chat-button'>{t('Send')}</button>
                               </form>
                               }
                               {addingUser && 
                                   <AddingUsers currentUsers={currentUsers}/>
                                }
                            </div>)
                }
            }
        </Context.Consumer>
    );
};

export default ChatView;
