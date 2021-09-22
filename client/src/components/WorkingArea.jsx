import React, { useState, useEffect } from "react";
import axios from "axios";
import Context from "../context/Context";
import ChatView from "./ChatView";
import '../styles/components/WorkingArea.css';



    
const WorkingArea = () => {
    
    const [ searchMessage, setSearchMessage ] = useState('Look for a user to chat.');
    const [ searchUser, setSearchUser ] = useState(null);
    function lookForUser(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        const conf = {
            headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                    },
            params:{
                email: event.target[0].value
            }
        }
        event.target[0].value = '';
        axios.get('http://localhost/users/getUserByEmail', conf )
            .then(user => {
                setSearchUser(user.data);
                setSearchMessage('One user found: ')
            })
            .catch( e => {
                let strError = e.response.data;
                setSearchMessage('No user was found, try a different e-mail address.');
                console.log(strError);
            })
    }

    async function  addContact( userState, updateUser ){
        try {
            let currentId = userState._id;
            if (currentId === searchUser._id){
                setSearchMessage('You cannot add yourself, try another e-mail address.')
            } else{
                const conf = {
                    headers: {
                                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                            }
                    };
                const data = await axios.post('http://localhost/users/addContactNoConf', { 
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
        { ({ userState, updateUser, socket, setCurrentMessages, currentMessages, currentUserChat}) => (
        <div className='working'>
            <form className='working-nav' onSubmit={lookForUser}>
                <input id='email-search' className='working-search' type="text" placeholder='Type an e-mail...' />
                <button className='working-button'>Search!</button>
            </form>
            <div className="found-user">
                {searchMessage}
                { searchMessage === 'One user found: ' && <>
                                            <h2 className='found-user__user'> 
                                                    {searchUser.userName} 
                                            </h2>
                                            <button onClick={() => addContact(userState, updateUser)}>Add contact</button>
                                            </>}
            </div>
            <ChatView 
                socket={socket} 
                setCurrentMessages={setCurrentMessages} 
                currentMessages={currentMessages} 
                userState = {userState}
                currentUserChat = {currentUserChat}
            />
        </div>
        )
        }
        </Context.Consumer>
    );
};

export default WorkingArea;