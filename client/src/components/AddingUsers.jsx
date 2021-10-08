import Context from '../context/Context';
import {useState} from 'react';
import axios from 'axios';
import './../styles/components/AddingUsers.css';
import { useTranslation } from 'react-i18next';
require('dotenv').config();
const USER_PATH=process.env.USER_PATH;

const AddingUsers = ({currentUsers}) => {
    
    const { t, i18n } = useTranslation();
    function addUser(event, userState, socket, currentRoomId, currentRoomName, setAddingUser){
        event.preventDefault();
        let allTarget = Object.values(event.target);
        let contactsList = allTarget.filter(c => c.checked);
        const date = new Date();
        const dateStr = date.getTime().toString();
        let newUsers = contactsList.map( c => {
            return {userName: c.value, _id: c.id, joinDate: dateStr};
        });
        
        socket.emit('addUsers', {roomId:currentRoomId, newUsers}, (participants) => {
            let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
            }
            axios.post(USER_PATH+'/newRoom', {roomName:currentRoomName, participants, roomId:currentRoomId, newMsgs:true }, conf)
                    .then( () => {
                        socket.emit('updateRooms', {participants, currentRoomName}, () => {
                            //window.location.href = '/chat/';
                        })
                        })
                    .catch( e => console.log(e));
        });
        setAddingUser(false);
    }
    function goBack(setAddingUser){
        setAddingUser(false);
    }
    return (
    <Context.Consumer>
        {
            ({userState, socket, currentRoomId, currentRoomName, setAddingUser}) => {
                
            
                const currentUsersIds = currentUsers.map( c => c._id);
                

                return (<div className='adding-mod'>
                    <div className='adding-box'>
                        <h1 className='adding-title'>{t('Add users to')} {currentRoomName}</h1>
                        <hr/>
                        {<form className='adding-form' 
                               onSubmit={(event)=>addUser(event, 
                                                          userState, 
                                                          socket, 
                                                          currentRoomId, 
                                                          currentRoomName, 
                                                          setAddingUser)}
                         >
                             { <div className='adding-contacts'>
                                {   userState.contacts.map(c =>{
                                        if(!currentUsersIds.includes(c._id) && c.status === "accepted"){
                                            return (<label htmlFor={c._id} key={c._id} className='adding-contacts__contact'>
                                                <input 
                                                    id={c._id} 
                                                    type="checkbox" 
                                                    name="participants" 
                                                    value={c.userName}/> {c.userName}
                                                </label>)
                                        }
                                    })
                                }
                             </div>
                             }
                                <button className='adding-button'>{t('Add')}</button>
                            </form>}
                        <button className='adding-button__cancel' onClick={() => goBack(setAddingUser)}>{t('Cancel')}</button>
                    </div>
                </div>)
            }
        }
    </Context.Consumer>
    )
}

export default AddingUsers;