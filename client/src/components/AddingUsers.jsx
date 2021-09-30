import Context from '../context/Context';
import {useState} from 'react';
import axios from 'axios';
require('dotenv').config();
const USER_PATH=process.env.USER_PATH;

const AddingUsers = ({currentUsers}) => {
    
    
    function addUser(event, userState, socket, currentRoomId, currentRoomName){
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
        console.log('Close the adding user window');
    }
    function goBack(){
        console.log('close the adding window');
    }
    return (
    <Context.Consumer>
        {
            ({userState, socket, currentRoomId, currentRoomName}) => {
                
            
                const currentUsersIds = currentUsers.map( c => c._id);
                return (<div>
                    <h1>Add users to {currentRoomName}</h1>
                    {<form onSubmit={(event)=>addUser(event, userState, socket, currentRoomId, currentRoomName)}>
                            
                            {userState.contacts.map(c =>{
                                
                                if(!currentUsersIds.includes(c._id)){
                                    return (<label htmlFor={c._id} key={c._id}>
                                        <input 
                                            id={c._id} 
                                            type="checkbox" 
                                            name="participants" 
                                            value={c.userName}/> {c.userName}
                                        </label>)
                                }
                            })}
                            <button >Add</button>
                        </form>}
                    <button onClick={goBack}>Cancel</button>
                </div>)
            }
        }
    </Context.Consumer>
    )
}

export default AddingUsers;