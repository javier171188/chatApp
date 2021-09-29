import React, { useEffect } from 'react';
import Context from '../context/Context';
import axios from 'axios';
import '../styles/components/Sideview.css'
import { Redirect } from 'react-router-dom';
require('dotenv').config();

const USER_PATH=process.env.USER_PATH;


const Sideview = (props) => {
    
    
    function openOneToOneChat(current, receiver, socket, setCurrentRoomId, setCurrentMessages, userState, setUserState ){
        /*socket.emit('joinPersonal', {current, receiver}, ({_id, lastMessages}) => {
            setCurrentRoomId(_id);
            setCurrentMessages(lastMessages);
        });*/
        
        socket.emit('getRoom', {current, receiver}, ({_id:_idRoom, lastMessages, participants}) => {
            setCurrentRoomId(_idRoom);
            setCurrentMessages(lastMessages);
            //console.log(`The messages were changed in the sideview. Current room: ${_idRoom}. Last changed room: ${lastRoomChanged}`);
            //setCurrentUserChat(receiver);
            let newUserState = {...userState};
            newUserState.contacts.forEach(c => {
                if (c._id === receiver) {
                    c.newMsgs = false;
                }
            });
            
            setUserState(newUserState);
            let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                params:{
                    email: JSON.parse(sessionStorage.getItem('email')),
                    contactId: receiver,
                    newStatus: false
                }
            }
            axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
        });
        //let newUserState = [...userState];
        //newUserState.conta.forEach( )
    }

    function openGroupChat(roomId, socket, setCurrentRoomId, setCurrentMessages, userState, setUserState){
        socket.emit('getRoom', {roomId}, ({ lastMessages, participants}) => {
            setCurrentRoomId(roomId);
            setCurrentMessages(lastMessages);
        });

        let newUserState = {...userState};
        newUserState.conversations.forEach(c => {
            if (c.roomId === roomId) {
                    c.newMsgs = false;
                }
            });
            
        setUserState(newUserState);
        let conf = {
            headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    },
            params:{
                email: JSON.parse(sessionStorage.getItem('email')),
                roomId,
                newStatus: false
            }
        }
        axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
    }

    function createGroupChat(){
        window.location.href = '/chat/create-room'; 
    }



    return (
        <Context.Consumer>
			{ ({userState, setUserState,socket,currentRoomId, setCurrentRoomId, setCurrentMessages }) => {
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
                                <ul>
                                    <h1>Contacts:</h1>
                                    {userState.contacts.map( child => {
                                        let newMsgs = child.newMsgs ? 'new-messages'
                                                                    : 'no-messages';
                                        //console.log(userState);
                                        return(
                                        <li key={child._id} className={`contacts ${newMsgs}`} onClick={() => {
                                                                    openOneToOneChat(userState._id, 
                                                                            child._id, 
                                                                            socket, 
                                                                            setCurrentRoomId, 
                                                                            setCurrentMessages, 
                                                                            userState, 
                                                                            setUserState
                                                                            )}}
                                        > 
                                            {child.userName} 
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        </div>
                        <div className='chats'>
                            <div className='chats-header'><h1>Group Chats:</h1> <div className='chats-button' onClick={createGroupChat}>+</div></div>
                            <hr/>
                            <nav className='chats-nav'>{
                                userState.conversations.length < 1 ?
                                "You have not started any group chat." :
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
                                                                            setUserState)}
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