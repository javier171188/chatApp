import React, { useState, useEffect } from "react";
import axios from "axios";
import Context from "../context/Context";
import ChatView from "./ChatView";
import '../styles/components/WorkingArea.css';
import { useTranslation } from 'react-i18next';

require('dotenv').config();


const USER_PATH=process.env.USER_PATH;


    
const WorkingArea = () => {
    const { t, i18n } = useTranslation();
    const [ searchMessage, setSearchMessage ] = useState(t('Look for a user to chat.'));
    const [ searchUser, setSearchUser ] = useState(null);
    function lookForUser(event) {
        event.preventDefault();
        //console.log(event.target[0].value);
        const conf = {
            headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                    },
            params:{
                email: event.target[0].value
            }
        }
        event.target[0].value = '';
        axios.get(USER_PATH+'/getUser', conf )
            .then(user => {
                user.data.newMsgs = false;
                setSearchUser(user.data);
                setSearchMessage(t('One user found: '))
                //console.log(user);
            })
            .catch( e => {
                let strError = e.response.data;
                setSearchMessage(t('No user was found, try a different e-mail address.'));
                //console.log(strError);
            })
    }

    async function  addContact( userState, updateUser ){
        try {
            let currentId = userState._id;
            if (currentId === searchUser._id){
                setSearchMessage(t('You cannot add yourself, try another e-mail address.'))
            } else{
                const conf = {
                    headers: {
                                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                            }
                    };
                const data = await axios.post(USER_PATH+'/addContactNoConf', { 
                                        "logged": currentId,
                                        "searched": searchUser
                                    }, conf)
                //sessionStorage.setItem('user', data.data);
                updateUser(data.data);
            }
        } catch (e){
            console.error(e);
        }
   }
   
       
    return (
        <Context.Consumer>
        { ({ userState, updateUser, socket, setCurrentMessages, currentMessages, currentRoomId}) => (
        <div className='working'>
            <form className='working-nav' onSubmit={lookForUser}>
                <input id='email-search' className='working-search' type="text" placeholder={t('Type an e-mail...')} />
                <button className='working-button'>{t('Search!')}</button>
            </form>
            <div className="found-user">
                {searchMessage}
                { searchMessage === t('One user found: ') && <>
                                            <h2 className='found-user__user'> 
                                                    {searchUser.userName} 
                                            </h2>
                                            <button onClick={() => addContact(userState, updateUser)}>{t('Add contact')}</button>
                                            </>}
            </div>
            <ChatView 
                socket={socket} 
                setCurrentMessages={setCurrentMessages} 
                currentMessages={currentMessages} 
                userState = {userState}
                currentRoomId = {currentRoomId}
            />
        </div>
        )
        }
        </Context.Consumer>
    );
};

export default WorkingArea;