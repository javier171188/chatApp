import React, { useEffect } from 'react';
import Context from '../context/Context';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../styles/components/Sideview.css';
import { Redirect } from 'react-router-dom';

require('dotenv').config();
const USER_PATH=process.env.USER_PATH;


const Sideview = () => {
    const { t, i18n } = useTranslation();
    
    function openOneToOneChat(e,
                              current, 
                              receiver, 
                              socket, 
                              setCurrentRoomId, 
                              setCurrentMessages, 
                              userState, 
                              setUserState, 
                              setCurrentRoomName, 
                              setGroupRoom,
                              setContactStatus, 
                              setCurrentUserChat){
        /*socket.emit('joinPersonal', {current, receiver}, ({_id, lastMessages}) => {
            setCurrentRoomId(_id);
            setCurrentMessages(lastMessages);
        });*/
        let contactClasses = e.target.className.split(' ');


        setCurrentUserChat(receiver);

        socket.emit('getRoom', {current, receiver}, ({_id:_idRoom, lastMessages, participants}) => {
            setCurrentRoomId(_idRoom);
            setCurrentMessages(lastMessages);
            //console.log(`The messages were changed in the sideview. Current room: ${_idRoom}. Last changed room: ${lastRoomChanged}`);
            //setCurrentUserChat(receiver);
            let participantId = participants.filter( p => p !== userState._id)[0];
            
            let newNameObj = userState.contacts.filter( c => (c._id === participantId ));
            setCurrentRoomName(newNameObj[0].userName);
            let newUserState = {...userState};
            newUserState.contacts.forEach(c => {
                if (c._id === receiver) {
                    c.newMsgs = false;
                }
            });
            setGroupRoom(false);
            setUserState(newUserState);
            if (contactClasses.includes('pending')){
                setContactStatus('pending');
                setCurrentMessages([]);
                setCurrentRoomId('1');
                return;
            } else if(contactClasses.includes('request') ){
                setContactStatus('request');
                setCurrentMessages([]);
                setCurrentRoomId('1');
                return;
            }
            setContactStatus('accepted');
            let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                params:{
                    senderId: receiver,
                    receiver: userState._id,
                    newStatus: false,
                    roomId: _idRoom
                }
            }
            axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
        });
        //let newUserState = [...userState];
        //newUserState.conta.forEach( )
    }

    function openGroupChat(roomId, 
                           socket, 
                           setCurrentRoomId, 
                           setCurrentMessages, 
                           userState, 
                           setUserState, 
                           setCurrentRoomName,
                           setGroupRoom,
                           setContactStatus){
        
        socket.emit('getRoom', {roomId}, ({ lastMessages, participants, roomName}) => {
            setCurrentRoomId(roomId);
            setCurrentMessages(lastMessages);
            setCurrentRoomName(roomName);
        });
        
        let newUserState = {...userState};
        newUserState.conversations.forEach(c => {
            if (c.roomId === roomId) {
                    c.newMsgs = false;
                }
            });
        setGroupRoom(true);
        setUserState(newUserState);
        setContactStatus('accepted');
        let conf = {
            headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    },
            params:{
                senderId: userState._id,
                receiver: {_id:userState._id},
                newStatus: false, 
                roomId
            }
        }
        axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
    }

    function createGroupChat(){
        window.location.href = '/chat/create-room'; 
    }



    return (
        <Context.Consumer>
			{ ({userState, 
                setUserState,
                setContactStatus,
                socket,
                currentRoomId, 
                setCurrentUserChat,
                setCurrentRoomId, 
                setCurrentMessages, 
                setCurrentRoomName, 
                setGroupRoom })  => {
                console.log('times'); //just to be sure the element does not render many times
                
                return  (
                    <aside className='user'>
                        <div className='user-picture'>
                            {
                                userState.hasAvatar && <img className='user-picture' src={USER_PATH+`/${userState._id}/avatar`} alt="User's avatar" />
                            }
                        </div> 
                        <div className='user-info'>
                            <div className='user-name--container'>
                                <h1 className='user-name--text'>
                                    {userState.userName}
                                </h1>
                            </div>
                            <hr/>
                            <div className='user-contacts'>
                                <h1>{t('ContactHeader')}</h1>  
                                <ul>
                                    {userState.contacts.map( child => {
                                        let newMsgs = child.newMsgs ? 'new-messages'
                                                                    : 'no-messages';
                                        let status = child.status;

                                        //console.log(userState);
                                        return(
                                        <li key={child._id} className={`contacts ${newMsgs} ${status}`} onClick={(e) => {
                                                                    openOneToOneChat(
                                                                            e,
                                                                            userState._id, 
                                                                            child._id, 
                                                                            socket, 
                                                                            setCurrentRoomId, 
                                                                            setCurrentMessages, 
                                                                            userState, 
                                                                            setUserState,
                                                                            setCurrentRoomName,
                                                                            setGroupRoom,
                                                                            setContactStatus,
                                                                            setCurrentUserChat
                                                                            )}}
                                        > 
                                            {child.userName} 
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        </div>
                        <div className='chats'>
                            <div className='chats-header'><h1>{t('Group Chats:')}</h1> <div className='chats-button' onClick={createGroupChat}>+</div></div>
                            <hr/>
                            <nav className='chats-nav'>{
                                userState.conversations.length < 1 ?
                                t("You have not started any group chat.") :
                                <ul>
                                {userState.conversations.map( c => {
                                    let newMsgs = c.newMsgs ? 'new-messages'
                                                                : 'no-messages';
                                    return (<li 
                                                key={c.roomId} 
                                                id={c.roomId} 
                                                className={`room ${newMsgs}`}
                                                onClick={()=>openGroupChat(c.roomId,
                                                                            socket, 
                                                                            setCurrentRoomId, 
                                                                            setCurrentMessages, 
                                                                            userState, 
                                                                            setUserState,
                                                                            setCurrentRoomName,
                                                                            setGroupRoom,
                                                                            setContactStatus)}
                                            >
                                                {c.roomName}
                                            </li>)
                                })}
                                </ul>
                            }
                                
                            </nav>
                        </div>
                    </aside>
                         
                        )
            }
        }
    </Context.Consumer>

    );
};

export default Sideview;