'use strict';
import React, { createContext, useState } from 'react';
import axios from 'axios';

const Context = createContext();

const Provider = ({ children }) => {
    const [ isAuth, setIsAuth ] = useState(()=>{
        return sessionStorage.getItem('token');
    });
    const [ errorMessages, setErrorMessages ] = useState([]);
    const value = {
        isAuth,
        errorMessages,
        registerUser: (event) => {
            event.preventDefault();
            const form = {
                userName: event.target[0].value,
                email: event.target[1].value,
                password: event.target[2].value,
            }
            if (event.target[2].value === event.target[3].value){
                axios.post('http://localhost:3000/register', form)
                    .then(data => {
                        window.sessionStorage.setItem('token', data.data.token);
                        window.sessionStorage.setItem('user', JSON.stringify(data.data.user));
                        setIsAuth(true);
                        window.location.href = '/chat/upload/avatar';		
                    }).catch(e => {
                            let strError = e.response.data;
                            strError = strError.replace('Error: ','');
                            if (!errorMessages.includes(strError)){
                                setErrorMessages([strError]);
                            }
                        });
            } else{
                setErrorMessages(['The password does not match the confirmation']);
            }

            
            
        },
        logIn: (event) => { 
            event.preventDefault();
            const form = {
                email: event.target[0].value,
                password: event.target[1].value,
            }
            axios.post('http://localhost:3000/login', form)
                .then(data => {
                    window.sessionStorage.setItem('token', data.data.token);
                    window.sessionStorage.setItem('user', JSON.stringify(data.data.user));
                    setIsAuth(true);
                    window.location.href = '/chat';		
                }).catch(e => {
                    setErrorMessages(['Incorrect user or password']);
                });
        },
        logOut: () => {
            const conf = {
                headers: {
                            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                        }
            }
            axios.post('http://localhost:3000/logoutAll',{} ,conf).catch( e => {
                console.log(e);
            });
            setIsAuth(false);
            window.sessionStorage.removeItem('token');
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
            axios.post("http://localhost:3000/avatar", formData, conf).then((user)=>{
                let parsedUser = JSON.stringify(user.data);
                sessionStorage.setItem('user', parsedUser);
                window.location.href = '/chat';
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