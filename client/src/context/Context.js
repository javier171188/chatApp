'use strict';
import React, { createContext, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://localhost";
const socket = socketIOClient(ENDPOINT, {
    path: '/mysocket'
});


var updateLastRoom = function(){
    console.log('executed before');
};

socket.on('updateMessages', ({participants, returnedMessages, roomId}) => {
    //participants = participants.filter((pId) => pId !== userState._id );
    /*console.log(currentRoomId);
    if (roomId === currentRoomId){
        setCurrentMessages(returnedMessages);
    }else{
        //notify that other conversation has been updated
        //setCurrentMessages(currentMessages);
    }*/
    //sessionStorage.setItem('lastRoomChanged', roomId);
    updateLastRoom(roomId, returnedMessages);
})






const Context = createContext();

const Provider = ({ children }) => {
    const [ isAuth, setIsAuth ] = useState(()=>{
        return sessionStorage.getItem('token');
    });
    const [ errorMessages, setErrorMessages ] = useState([]);
    const [ currentRoomId, setCurrentRoomId ] = useState('');
    const [ userState, setUserState ] = useState(() => {
        return JSON.parse(sessionStorage.getItem('user'));
    });
    const [currentMessages, setCurrentMessages ] = useState([]);
    //const [currentUserChat, setCurrentUserChat] = useState('');
    const [lastRoomChanged, setLastRoomChanged] = useState('');

    updateLastRoom = function(roomId, returnedMessages){
        setLastRoomChanged(roomId);
        if ( roomId === currentRoomId){
            setCurrentMessages(returnedMessages);
        }
        console.log('times');
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
        userState,
        updateUser: (newUser) => {
            sessionStorage.setItem('user', JSON.stringify(newUser));
            console.log(newUser);
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
                            
                    await axios.post("http://localhost/users/avatar/check", formData);
                }
                
                const form = {
                    userName: event.target[0].value,
                    email: event.target[1].value,
                    password: event.target[2].value,
                }

                if (event.target[2].value === event.target[3].value){
                    const data = await axios.post('http://localhost/users/register', form)
                    window.sessionStorage.setItem('token', data.data.token);
                    window.sessionStorage.setItem('user', JSON.stringify(data.data.user));

                    
                    if (selectedFile){
                        const conf = {headers: {'Authorization': 'Bearer ' + data.data.token }};
                        const user = await axios.post("http://localhost/users/avatar", formData, conf);
                        let parsedUser = JSON.stringify(user.data);
                        window.sessionStorage.setItem('user', parsedUser);
                    }
                    
                    //window.location.href = '/chat';
                    setIsAuth(true);
                } else{
                    setErrorMessages(['The password does not match the confirmation']);
                }
            }catch (error){
                console.log(error);
                let strError = error.response.data;
                strError = strError.replace('Error: ','');
                setErrorMessages([strError]);
            }
            
        },
        logIn: (event) => { 
            event.preventDefault();
            const form = {
                email: event.target[0].value,
                password: event.target[1].value,
            }
            axios.post('http://localhost/users/login', form)
                .then(data => {
                    window.sessionStorage.setItem('user', JSON.stringify(data.data.user));
                    setUserState(data.data.user);
                    window.sessionStorage.setItem('token', data.data.token);
                    //window.location.href = '/chat';		
                    setIsAuth(true);
                }).catch(e => {
                    setErrorMessages(['']);
                });
        },
        logOut: () => {
            const conf = {
                headers: {
                            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                        }
            }
            axios.post('http://localhost/users/logoutAll',{} ,conf).catch( e => {
                console.log(e);
            });
            setIsAuth(false);
            window.sessionStorage.removeItem('token');
            window.sessionStorage.removeItem('user');
            socket.disconnect();
        },

        saveAvatarImage (event){
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

            
            axios.post("http://localhost/users/avatar", formData, conf).then((user)=>{
                let parsedUser = JSON.stringify(user.data);
                sessionStorage.setItem('user', parsedUser);
                //window.location.href = '/chat';
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