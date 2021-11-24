import Header from './Header';
import { socketCreateNewRoom } from '../redux/actions';
import '../styles/components/Header.css';
import '../styles/components/CreateRoom.css';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';


require('dotenv').config();
const USER_PATH = process.env.USER_PATH;

const CreateRoom = ({ userState, socketCreateNewRoom }) => {
    const { t, i18n } = useTranslation();
    function goBack(e) {
        e.preventDefault();
        window.location.href = '/chat/'
    }
    function createRoom(e) {
        e.preventDefault();
        let roomName = e.target[0].value;
        let allTarget = Object.values(e.target);
        let contactsList = allTarget.filter(c => c.checked);
        const date = new Date();
        const dateStr = date.getTime().toString();
        let participants = contactsList.map(c => {
            return { userName: c.value, _id: c.id, joinDate: dateStr };
        });
        participants.push({ userName: userState.userName, _id: userState._id, joinDate: dateStr });

        socketCreateNewRoom({ roomName, participants });

    }

    return (
        <>
            <Header />
            <h1 className='new-room__title'>{t('Create New Room')}</h1>
            <form onSubmit={createRoom}>
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
                <br />
                <div className='new-room__contacts'>
                    <h2 className='new-room__title-users'>{t('Choose people for the new chat room')}</h2>
                    <div className='new-room__contacts-list'>
                        {userState.contacts.map(c => {
                            if (c.status === "accepted") {
                                return (<label htmlFor={c._id} key={c._id} className='new-room__contacts-label'>
                                    <input
                                        id={c._id}
                                        type='checkbox'
                                        name="participants"
                                        value={c.userName} />
                                    {c.userName}
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


const mapStateToProps = (state) => {
    return {
        userState: state.userState
    }
}

const mapDispatchToProps = {
    socketCreateNewRoom
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);