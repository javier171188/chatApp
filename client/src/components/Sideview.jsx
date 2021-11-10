import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setGroupRoom, setCurrentUserChat, socketGetRoom } from '../redux/actions';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../styles/components/Sideview.css';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import * as type from '../redux/types';

require('dotenv').config();
const USER_PATH = process.env.USER_PATH;


const Sideview = (props) => {
    const { t, i18n } = useTranslation();
    const { userState } = props;


    function openOneToOneChat(e, current, receiver, userState) {
        let clickedElement = e.target;
        let localName = clickedElement.localName;
        while (localName !== 'li') {
            clickedElement = clickedElement.parentElement;
            localName = clickedElement.localName;
        }
        let contactClasses = clickedElement.className.split(' ');

        props.setGroupRoom(false);
        props.setCurrentUserChat({
            currentUserChat: receiver
        })

        props.socketGetRoom({
            users: { current, receiver, userState, contactClasses }
        })
    }

    function openGroupChat(roomId,
        socket,
        setCurrentRoomId,
        setCurrentMessages,
        userState,
        setUserState,
        setCurrentRoomName,
        setGroupRoom,
        setContactStatus) {

        socket.emit('getRoom', { roomId }, ({ lastMessages, participants, roomName }) => {
            setCurrentRoomId(roomId);
            setCurrentMessages(lastMessages);
            setCurrentRoomName(roomName);
        });

        let newUserState = { ...userState };
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
            params: {
                senderId: userState._id,
                receiver: { _id: userState._id },
                newStatus: false,
                roomId
            }
        }
        axios.post(USER_PATH + '/updateUser', conf).catch(e => console.log(e));
    }

    function createGroupChat() {
        window.location.href = '/chat/create-room';
    }

    console.log('times'); //just to be sure the element does not render many times
    return (
        <Box className='user'>
            <div className='user-picture user-picture__container'>
                {
                    userState.hasAvatar && <img className='user-picture' src={USER_PATH + `/${userState._id}/avatar`} alt="User's avatar" />
                }
            </div>
            <div className='user-info'>
                <div className='user-name--container'>
                    <h1 className='user-name--text'>
                        {userState.userName}
                    </h1>
                </div>
                <Divider />
                <Divider />
                <div className='user-contacts'>
                    <h1>{t('ContactHeader')}</h1>
                    <List>
                        {userState.contacts.map(child => {
                            let newMsgs = child.newMsgs ? 'new-messages'
                                : 'no-messages';
                            let status = child.status;

                            return (
                                <ListItem key={child._id} className={`contacts ${newMsgs} ${status}`} onClick={(e) => {
                                    openOneToOneChat(
                                        e,
                                        userState._id,
                                        child._id,
                                        userState,
                                    )
                                }}
                                >
                                    <ListItemIcon >
                                        <ArrowRightRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={child.userName} />
                                </ListItem>
                            )
                        })}
                    </List>
                </div>
            </div>
            <div className='chats'>
                <div className='chats-header'>
                    <h1>{t('Group Chats:')}</h1>
                    <div className='chats-button' onClick={createGroupChat}>
                        <AddCircleIcon></AddCircleIcon>
                    </div>
                </div>
                <Divider />
                <Divider />
                <nav className='chats-nav'>{
                    userState.conversations.length < 1 ?
                        t("You have not started any group chat.") :
                        <List>
                            {userState.conversations.map(c => {
                                let newMsgs = c.newMsgs ? 'new-messages'
                                    : 'no-messages';
                                return (<ListItem
                                    key={c.roomId}
                                    id={c.roomId}
                                    className={`room ${newMsgs}`}
                                    onClick={() => openGroupChat(c.roomId,
                                        socket,
                                        setCurrentRoomId,
                                        setCurrentMessages,
                                        userState,
                                        setUserState,
                                        setCurrentRoomName,
                                        setGroupRoom,
                                        setContactStatus)}
                                >
                                    <ListItemIcon>
                                        <ArrowRightRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={c.roomName} />
                                </ListItem>)
                            })}
                        </List>
                }
                </nav>
            </div>
        </Box>
    )
}


const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        currentUserChat: state.currentUserChat
    }
};

const mapDispatchToProps = {
    setGroupRoom,
    setCurrentUserChat,
    socketGetRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(Sideview);