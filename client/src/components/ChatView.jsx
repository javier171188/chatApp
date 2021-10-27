import  { useState, useRef, useEffect } from 'react';
import Context from '../context/Context';
import MessageForm from './MessageForm';
import AddingUsers from './AddingUsers';
import Drawing from './Drawing';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './../styles/components/ChatView.css';
import Button from '@mui/material/Button';
import BrushIcon from '@mui/icons-material/Brush';
import Input from '@mui/material/Input';


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
    
    function acceptRequest({currentUserChat, setCurrentRoomId, userState, socket, setContactStatus, getUserState}){
        let conf = {
            headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
        }
        let params = {
            participants:[currentUserChat, userState._id]
        }
        axios.patch(USER_PATH+'/confirmAdding', params, conf)
        .then(()=> {
            socket.emit('userAccepted', {acceptedId:currentUserChat}, ()=>{
            });
            getUserState();
        })
        .catch(e=>console.log(e));
        setCurrentRoomId('');
        setContactStatus('accepted');
        
        
    }

    userState.contacts.forEach( c => {
        socket.emit('joinPersonal', {current:userState._id, receiver:c._id}, ({_id, lastMessages}) => {
                    });
    });
        
    userState.conversations.forEach( c => {
        socket.emit('joinGroup', {roomId:c.roomId}, ({_id, lastMessages}) => {
                    });
    });

    function openDrawingArea(setDrawingAreaOn){
        setDrawingAreaOn(true);
    }

    return (
        <Context.Consumer>
            {
                ({userState, 
                  contactStatus, 
                  setContactStatus,
                  currentRoomId, 
                  setCurrentRoomId,
                  currentMessages, 
                  currentRoomName, 
                  groupRoom, 
                  addingUser, 
                  setAddingUser,
                  currentUserChat,
                  socket,
                  getUserState,
                  drawingAreaOn, 
                  setDrawingAreaOn,
                  sendNewMessage }) => {
                    return (<div className='chat'>
                                {currentRoomId && (groupRoom ?
                                                            <div className='chat-header'>
                                                                <h1 className='chat-header__name'>{currentRoomName}</h1> 
                                                                <div className='chat-header__buttons'>
                                                                    <Button 
                                                                        className='chat-header__add' 
                                                                        onClick={()=>{addUserToRoom({roomId:currentRoomId, userState, setAddingUser})}}
                                                                        color='inherit'
                                                                        variant='contained' 
                                                                        id='add-user-button'
                                                                    >
                                                                        {t('Add')}
                                                                    </Button>
                                                                    <Button 
                                                                        className='chat-header__remove' 
                                                                        onClick={()=>{removeUserFromRoom()}}
                                                                        color='inherit'
                                                                        variant='contained'
                                                                        id='remove-user-button'
                                                                    >
                                                                        {t('Remove')}
                                                                    </Button>
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
                                                isImage={message.isImage}
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
                                        contactStatus === 'request'   && <>
                                                                            <h1 className='chat-start'>{ currentRoomName + t(' wants to add you as a contact.')}</h1>
                                                                            <Button 
                                                                                className='chat-accept' 
                                                                                id='chat-accept-button'
                                                                                color='inherit'
                                                                                variant='contained'
                                                                                onClick={() => acceptRequest({currentUserChat, 
                                                                                                              userState, 
                                                                                                              setCurrentRoomId, 
                                                                                                              socket, 
                                                                                                              setContactStatus,
                                                                                                              getUserState})}
                                                                            >
                                                                                {t('Accept')}
                                                                            </Button>
                                                                        </>
                                    }
                                    {/*<div ref={messagesEndRef} />*/}
                                </div>
                               { (currentRoomId && currentRoomId !== '1') &&
                               <div className='chat-submit-bar'>
                                <form onSubmit={(event)=>sendNewMessage(event,userState, currentRoomId)} 
                                      className='chat-submit-form'
                                >
                                   <div className='chat-input__container' >
                                    <Input 
                                            autoFocus 
                                            id='messages-input'
                                            className='chat-writing' 
                                            type="text" 
                                            placeholder={t('Type a message...')}
                                            fullWidth
                                        />
                                    </div>
                                   <Button 
                                        className='chat-button'
                                        id='send-message__button'
                                        color='inherit'
                                        variant='contained'
                                        type="submit"
                                    >
                                        {t('Send')}
                                    </Button>
                               </form>
                               <Button 
                                    className='chat-button__drawing' 
                                    id='drawing-button'
                                    onClick={() => openDrawingArea(setDrawingAreaOn)}
                                    variant="contained"
                                    color='inherit'
                                    startIcon={<BrushIcon/>}
                                >
                                   {t('Draw')}
                                </Button>
                               </ div>
                               }
                               {addingUser && 
                                   <AddingUsers currentUsers={currentUsers}/>
                                }
                                {drawingAreaOn &&
                                    <Drawing/>
                                }
                            </div>)
                }
            }
        </Context.Consumer>
    );
};

export default ChatView;
