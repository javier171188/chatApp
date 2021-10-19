'use strict';
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { useTranslation } from 'react-i18next';

//require('dotenv').config();

var updateLastRoom = function () {
    console.log('executed before');
};
var subscribeRoom = function() {
    console.log('executed before');
}

var checkForUpdates = function(){
    console.log('executed before');
}
const socket = socketIOClient(process.env.SOCKET_ENDPOINT, {
    path: process.env.SOCKET_PATH
});

socket.on('updateMessages', ({ participants, returnedMessages, roomId }) => {
    updateLastRoom(roomId, returnedMessages, participants);
});

socket.on('newRoom',({participants, roomId}) => {
    subscribeRoom(participants, roomId)
});

socket.on('userAccepted', ({acceptedId}) =>{
    checkForUpdates(acceptedId);
});


const USER_PATH=process.env.USER_PATH;


const Context = createContext();

var countUserLoad = 0;
const Provider =  ({ children }) => {
    const { t, i18n } = useTranslation();
    const [isAuth, setIsAuth] = useState(() => {
        return sessionStorage.getItem('token');
    });
    const [errorMessages, setErrorMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState('');
    const [currentRoomName, setCurrentRoomName] = useState('');
    const [userState, setUserState] = useState({
                                        contacts:[],
                                        email: "",
                                        hasAvatar: false,
                                        userName: "",
                                        _id: "",
                                        conversations: []
                                    });
    const [contactStatus, setContactStatus] = useState('');
    const [drawingAreaOn, setDrawingAreaOn] = useState(false);
    
    checkForUpdates = function(acceptedId){
        /*console.log(userState._id === acceptedId)
        console.log(userState._id,  acceptedId)
        console.log(typeof userState._id, typeof acceptedId)*/
        if (userState._id === acceptedId){
            getUserState();
        }
    };

    subscribeRoom = async function(participants, roomId){
        try{
            let participantIds =participants.map( p => p._id);
            //console.log(participantsId.includes(userState._id));
            if (participantIds.includes(userState._id)){
                
                let conf = {
                    headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                            },
                    params:{
                        email: JSON.parse(sessionStorage.getItem('email')),
                        selfUser: true
                    }
                }
                let user = await axios.get(USER_PATH+'/getUser', conf );
                //console.log(user.data);
                setUserState(user.data);
                socket.emit('joinGroup', {roomId}, ({_id, lastMessages}) => {
                });
            }
        } catch (e){
            console.log(e);
        }
    }

                                    
    async function getUserState(refresh=true){
        let email = JSON.parse(sessionStorage.getItem('email'));
        let token = sessionStorage.getItem('token');
        if (!email || !token){
            return
        }
        let conf = {
            headers: {
                        'Authorization': 'Bearer ' + token
                    },
            params:{
                email,
                selfUser: true
            }
        }
        let user = await axios.get(USER_PATH+'/getUser', conf );
        if (countUserLoad === 0 || refresh){
            setUserState(user.data)
            i18n.changeLanguage(user.data.language);
            localStorage.setItem('language', user.data.language);
            countUserLoad++;
        }
    };
    getUserState(false);


    const [currentMessages, setCurrentMessages] = useState([]);
    const [currentUserChat, setCurrentUserChat] = useState('');
    const [lastRoomChanged, setLastRoomChanged] = useState('');// I think I am not using this.
    const [groupRoom, setGroupRoom] = useState(false);
    const [addingUser, setAddingUser] = useState(false);

    updateLastRoom = function (roomId, returnedMessages, participants) {
        setLastRoomChanged(roomId);
        if (roomId === currentRoomId) {
            setCurrentMessages(returnedMessages);
        } else {
            let userWithNewMsgId = participants.filter(p => p !== userState._id)[0];
            let newState = { ...userState };
            newState.contacts.forEach(c => {
                if (c._id === userWithNewMsgId) {
                    c.newMsgs = true;
                }
            });
            newState.conversations.forEach( c=> {
                if (c.roomId === roomId) {
                    c.newMsgs = true;
                }
            })

            setUserState(newState);
            //This does not work offline
            /*let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                params:{
                    email: JSON.parse(sessionStorage.getItem('email')),
                    contactId: userWithNewMsgId,
                    newStatus: true, 
                    roomId
                }
            }
            axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));*/
        }
    }

    function sendNewMessage(event, userState, currentRoomId, imageStr=''){
        var isImage;
        if (!imageStr){
            event.preventDefault();
            //console.log(`Sended room id: ${currentRoomId}`);
            var message = event.target[0].value;
            event.target[0].value = '';
            isImage = false;
        } else{
            var message = imageStr;
            isImage = true;
        }
        
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
                    roomId: currentRoomId,
                    isImage
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



    const value = {
        sendNewMessage,
        drawingAreaOn, 
        setDrawingAreaOn,
        getUserState,
        currentUserChat,
        setCurrentUserChat,
        contactStatus, 
        setContactStatus,
        addingUser, 
        setAddingUser,
        groupRoom, 
        setGroupRoom,
        setCurrentRoomName,
        currentRoomName,
        lastRoomChanged,
        currentMessages,
        setCurrentMessages,
        socket,
        currentRoomId,
        setCurrentRoomId,
        setUserState,
        userState,
        updateUser: (newUser) => {
            //sessionStorage.setItem('user', JSON.stringify(newUser));
            //console.log(newUser);
            setUserState(newUser);
        },
        isAuth,
        errorMessages,
        setErrorMessages,
        registerUser: async (event) => {
            try {
                event.preventDefault();
                const selectedFile = event.target[4].files[0];
                if (selectedFile) {
                    var formData = new FormData();
                    formData.append(
                        "avatar",
                        selectedFile,
                        selectedFile.name
                    );

                    await axios.post(USER_PATH+"/avatar/check", formData);
                }

                const form = {
                    userName: event.target[0].value,
                    email: event.target[1].value,
                    password: event.target[2].value,
                }

                if (event.target[2].value === event.target[3].value) {
                    const data = await axios.post(USER_PATH+'/register', form)

                    if (selectedFile) {
                        const conf = { headers: { 'Authorization': 'Bearer ' + data.data.token } };
                        var user = await axios.post(USER_PATH+"/avatar", formData, conf);
                        setUserState(user.data);
                        window.sessionStorage.setItem('email', JSON.stringify(user.data.email));
                    } else {
                        setUserState(data.data.user);
                        window.sessionStorage.setItem('email', JSON.stringify(data.data.user.email));
                    }

                    
                    window.sessionStorage.setItem('token', data.data.token);
                    setErrorMessages([]);
                    setIsAuth(true);
                } else {
                    setErrorMessages([t('The password does not match the confirmation')]);
                }
            } catch (error) {
                let strError = error.response.data;
                strError = strError.replace('Error: ', '');
                console.log(strError)
                switch (strError){
                    case 'That e-mail is already registered':
                        setErrorMessages([t('That e-mail is already registered')]);
                    break;
                    default: 
                        setErrorMessages([t('Something went wrong')]);
                    break;
                }
                
            }

        },
        logIn: (event) => {
            event.preventDefault();
            const form = {
                email: event.target[0].value,
                password: event.target[1].value,
            }
            axios.post(USER_PATH+'/login', form)
                .then(data => {
                    window.sessionStorage.setItem('email', JSON.stringify(data.data.user.email));
                    setUserState(data.data.user);
                    window.sessionStorage.setItem('token', data.data.token);
                    setErrorMessages([]);
                    setIsAuth(true);
                }).catch(e => {
                    setErrorMessages([e]);
                });
        },
        logOut: () => {
            const conf = {
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                }
            }
            axios.post(USER_PATH+'/logoutAll', {}, conf).catch(e => {
                console.log(e);
            });
            setIsAuth(false);
            window.sessionStorage.removeItem('token');
            window.sessionStorage.removeItem('email');

            socket.disconnect();
            window.location.href = '/chat/';
        },

        saveAvatarImage(event) {
            event.preventDefault();
            const selectedFile = event.target[0].files[0];
            const formData = new FormData();

            formData.append(
                "avatar",
                selectedFile,
                selectedFile.name
            );
            const conf = {
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                }
            }


            axios.post(USER_PATH+"/avatar", formData, conf).then((user) => {
                let parsedUser = JSON.stringify(user.data);
                sessionStorage.setItem('user', parsedUser);
                //window.location.href = '/chat/';
            }).catch(e => console.error(e));

        },
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}



export default {
    Provider,
    Consumer: Context.Consumer
};