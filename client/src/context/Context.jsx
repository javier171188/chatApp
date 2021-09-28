'use strict';
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
require('dotenv').config();

const socket = socketIOClient(process.env.SOCKET_ENDPOINT, {
    path: process.env.SOCKET_PATH
});



var updateLastRoom = function () {
    console.log('executed before');
};

socket.on('updateMessages', ({ participants, returnedMessages, roomId }) => {
    //participants = participants.filter((pId) => pId !== userState._id );
    /*console.log(currentRoomId);
    if (roomId === currentRoomId){
        setCurrentMessages(returnedMessages);
    }else{
        //notify that other conversation has been updated
        //setCurrentMessages(currentMessages);
    }*/
    //sessionStorage.setItem('lastRoomChanged', roomId);
    updateLastRoom(roomId, returnedMessages, participants);
})

const USER_PATH=process.env.USER_PATH;

const Context = createContext();

var countUserLoad = 0;
const Provider =  ({ children }) => {
    const [isAuth, setIsAuth] = useState(() => {
        return sessionStorage.getItem('token');
    });
    const [errorMessages, setErrorMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState('');
    const [userState, setUserState] = useState({
                                        contacts:[],
                                        email: "",
                                        hasAvatar: false,
                                        userName: "",
                                        _id: "",
                                        conversations: []
                                    });

    
    
    async function getUserState(){
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
        if (countUserLoad === 0){
            setUserState(user.data)
            countUserLoad++;
        }
    };
    getUserState();


    const [currentMessages, setCurrentMessages] = useState([]);
    //const [currentUserChat, setCurrentUserChat] = useState('');
    const [lastRoomChanged, setLastRoomChanged] = useState('');// I think I am not using this.

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

            setUserState(newState);
            
            let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
                params:{
                    email: JSON.parse(sessionStorage.getItem('email')),
                    contactId: userWithNewMsgId,
                    newStatus: true
                }
            }
            axios.post(USER_PATH+'/updateUser', conf ).catch( e => console.log(e));
        }
    }

    
    const value = {
        //currentUserChat,
        //setCurrentUserChat,
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
                    
                    setIsAuth(true);
                } else {
                    setErrorMessages(['The password does not match the confirmation']);
                }
            } catch (error) {
                let strError = error.response.data;
                strError = strError.replace('Error: ', '');
                setErrorMessages([strError]);
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