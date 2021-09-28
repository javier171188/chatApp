import axios from 'axios';
import Header from './Header';
import '../styles/components/Header.css';
import Context from '../context/Context';
require('dotenv').config();
const USER_PATH=process.env.USER_PATH;

const CreateRoom = () => {
    function goBack(e){
        e.preventDefault();
        window.location.href = '/chat/'
        
    }
    function createRoom(e, userState, socket){
        e.preventDefault();
        let roomName = e.target[0].value;
        let allTarget = Object.values(e.target);
        let contactsList = allTarget.filter(c => c.checked);
        const date = new Date();
        const dateStr = date.getTime().toString();
        let participants = contactsList.map( c => {
            return {userName: c.value, _id: c.id, joinDate: dateStr};
        });
        participants.push({userName: userState.userName, _id: userState._id, joinDate: dateStr});
        socket.emit('newRoom', { roomName, participants}, (roomId) => {
            
            let conf = {
                headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        },
            }
            
            axios.post(USER_PATH+'/newRoom', {roomName, participants, roomId, newMsgs:false }, conf)
                    .then( window.location.href = '/chat/' )
                    .catch( e => console.log(e));
        });
        
    }

    return (
        <Context.Consumer>
            {
                ({userState, socket}) => {
                    return (
                        <>
                        <Header />
                        <h1>Create New Room</h1>
                        <form onSubmit={(e)=>createRoom(e, userState, socket)}>
                            <input type="text" placeholder='Room name' required/>
                            {userState.contacts.map(c =>{
                                return (<label htmlFor={c._id} key={c._id}>
                                        <input 
                                            id={c._id} 
                                            type="checkbox" 
                                            name="participants" 
                                            value={c.userName}/> {c.userName}
                                        </label>)
                            })}

                            <button >Create</button>
                        </form>
                        <button onClick={goBack}>Cancel</button>
                        </>
                    )
                }
            }
            
        </Context.Consumer>
    )
}

export default CreateRoom;