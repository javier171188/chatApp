import React, { useState } from "react";
import axios from "axios";
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
        axios.get('http://localhost:3000/getUserByEmail', conf )
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

    function addContact(){
        let currentId = JSON.parse(sessionStorage.getItem('user'))._id;
        
        if (currentId === searchUser._id){
            setSearchMessage('You cannot add yourself, try another e-mail address.')
        } else{
            const conf = {
                headers: {
                            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                        }
                };
            axios.post('http://localhost:3000/addContactNoConf', { 
                                    "logged": currentId,
                                    "searched": searchUser
                                }, conf)
                .then( data =>{
                    console.log(data.data)
                })
                .catch( e => {
                    console.log(e);
                })
        }
    }

    return (
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
                                            <button onClick={addContact}>Add contact</button>
                                            </>}
            </div>
            <div className='chat'>
                <div className='chat-messages'></div>
                <input  className='chat-writing' type="text" placeholder='Type a message...' />
                <button className='chat-button'>Send</button>
            </div>
        </div>
    );
};

export default WorkingArea;