'use strict';
import React, { createContext, useState } from 'react';
import axios from 'axios';

const Context = createContext();

const Provider = ({ children }) => {
    const [ isAuth, setIsAuth ] = useState(()=>{
        return sessionStorage.getItem('token');
    });

    const value = {
        isAuth,
        registerUser: (event) => {
            event.preventDefault();
            const form = {
                userName: event.target[0].value,
                email: event.target[1].value,
                password: event.target[2].value,
            }
            axios.post('http://localhost:3000/register', form)
                .then(data => {
                    console.log(data.data);
                    window.sessionStorage.setItem('token', data.data.token);
                    setIsAuth(true);
                    window.location.href = '/chat';		
                }).catch(e => console.log(e));
            
        },
        logIn: (event) => {
            event.preventDefault();
            const form = {
                email: event.target[0].value,
                password: event.target[1].value,
            }
            axios.post('http://localhost:3000/login', form)
                .then(data => {
                    console.log(data.data);
                    window.sessionStorage.setItem('token', data.data.token);
                    setIsAuth(true);
                    //window.location.href = '/chat';		
                }).catch(e => console.log(e));
            
        },
        logOut: () => {
            const conf = {
                headers: {
                            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                        }
            }
            console.log(conf);
            axios.post('http://localhost:3000/logoutAll',{} ,conf).catch( e => {
                console.log(e);
            });
            setIsAuth(false);
            window.sessionStorage.removeItem('token');
        }
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