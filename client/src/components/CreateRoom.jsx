import axios from 'axios';
import Header from './Header';
import '../styles/components/Header.css';
import '../styles/components/CreateRoom.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Checkbox from "@material-ui/core/Checkbox";


require('dotenv').config();
const USER_PATH=process.env.USER_PATH;

const CreateRoom = () => {
    const { t, i18n } = useTranslation();
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
            axios.post(USER_PATH+'/newRoom', {roomName, participants, roomId, newMsgs:true }, conf)
                    .then( () => {
                        socket.emit('updateRooms', {participants, roomId}, () => {
                            window.location.href = '/chat/';
                        })
                        })
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
                        <h1 className='new-room__title'>{t('Create New Room')}</h1>
                        <form onSubmit={(e)=>createRoom(e, userState, socket)}>
                            <div className='new-room__name'>
                                <label>{t('Room Name')} </label>
                                <br />
                                <Input 
                                    type="text" 
                                    placeholder={t('Write a name for the room...')} 
                                    required
                                    className='new-room__input-name'
                                />
                            </div>
                            <br/>
                            <div className='new-room__contacts'>
                                <h2 className='new-room__title-users'>{t('Choose people for the new chat room')}</h2>
                                <div className='new-room__contacts-list'>
                                    {userState.contacts.map(c =>{
                                    if (c.status === "accepted"){
                                        return (<label htmlFor={c._id} key={c._id} className='new-room__contacts-label'>
                                            <input 
                                                id={c._id} 
                                                type="checkbox" 
                                                name="participants" 
                                                value={c.userName}/> {c.userName}
                                            </label>)
                                    }
                                })}
                                </div>
                                <Button 
                                    className='new-room__create-button'
                                    id='new-room__create-button'
                                    color='inherit'
                                    variant='contained'
                                    type='submit'
                                >
                                    {t('Create')}
                                </Button>
                            </div>
                        </form>
                        <Button 
                            onClick={goBack} 
                            className='new-room__cancel-button'
                            id='new-room__cancel-button'
                            color='inherit'
                            variant='contained'
                        >
                            {t('Cancel')}
                        </Button>
                        </>
                    )
                }
            }
            
        </Context.Consumer>
    )
}

export default CreateRoom;