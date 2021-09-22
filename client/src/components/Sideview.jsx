import React from 'react';
import Context from '../context/Context';
import '../styles/components/Sideview.css'

const Sideview = (props) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const avatar = user.avatar ? user.avatar : undefined;
    
    
   

    function openOneToOneChat(current, receiver, socket, setCurrentRoomId, setCurrentMessages,  setCurrentUserChat){
        /*socket.emit('joinPersonal', {current, receiver}, ({_id, lastMessages}) => {
            setCurrentRoomId(_id);
            setCurrentMessages(lastMessages);
        });*/
        
        socket.emit('getRoom', {current, receiver}, ({_idRoom, lastMessages, participants}) => {
            setCurrentRoomId(_idRoom);
            setCurrentMessages(lastMessages);
            setCurrentUserChat(receiver);
        });
    }

    return (
        <Context.Consumer>
			{ ({userState, socket,currentRoomId, setCurrentRoomId, setCurrentMessages, setCurrentUserChat }) => (
        <aside className='user'>
            <div className='user-picture'>
                {
                    avatar && <img className='user-picture' src={"data:image/jpg;base64,"+avatar} alt="User's avatar" />
                }
            </div> 
            <div className='user-info'>
                <div className='user-name--container'>
                    <h1 className='user-name--text'>
                        {user.userName}
                    </h1>
                </div>
                <hr/>
                <div className='user-contacts'>
                    <ul>
                        <h1>Contacts:</h1>
                        {user.contacts.map( child => (
                            <li key={child._id} className='contacts' onClick={() => {
                                                        openOneToOneChat(user._id, child._id, socket, setCurrentRoomId, setCurrentMessages, setCurrentUserChat)}}> {child.userName} </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='chats'>
                <h1>Group Chats:</h1>
                <nav className='chats-nav'>You have not started any group chat. Click a user to start one!</nav>
            </div>
        </aside>
             
            )
        }
    </Context.Consumer>

    );
};

export default Sideview;