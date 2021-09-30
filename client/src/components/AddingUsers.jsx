import Context from '../context/Context';
import {useState} from 'react';


const AddingUsers = ({currentUsers}) => {
    
    
    function addUser(event, userState, socket, currentRoomId){
        event.preventDefault();
        console.log('add users');
        
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
                    {<form onSubmit={(event)=>addUser(event, userState, socket, currentRoomId)}>
                            
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
                            <button >Create</button>
                        </form>}
                    <button onClick={goBack}>Cancel</button>
                </div>)
            }
        }
    </Context.Consumer>
    )
}

export default AddingUsers;