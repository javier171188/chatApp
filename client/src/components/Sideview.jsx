import React, { useEffect } from 'react';
import Context from '../context/Context';
import axios from 'axios';
import '../styles/components/Sideview.css'



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
        });

        //let newUserState = [...userState];
        //newUserState.conta.forEach( )
        //HERE I have to update userState so the (M) disappear when I change to that room

    }

    return (
        <Context.Consumer>
			{ ({userState, setUserState,socket,currentRoomId, setCurrentRoomId, setCurrentMessages }) => {
                console.log('times'); //just to be sure the element does not render many times
                return  (
                    <aside className='user'>
                        <div className='user-picture'>
                            {
                                userState.hasAvatar && <img className='user-picture' src={`http://localhost/users/${userState._id}/avatar`} alt="User's avatar" />
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
                            <h1>Group Chats:</h1>
                            <nav className='chats-nav'>You have not started any group chat.</nav>
                        </div>
                    </aside>
                         
                        )
            }
        }
    </Context.Consumer>

    );
};

export default Sideview;