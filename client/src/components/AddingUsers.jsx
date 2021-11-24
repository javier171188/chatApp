import { connect } from 'react-redux';
import { setAddingUser, addUsersAction } from '../redux/actions';
import './../styles/components/AddingUsers.css';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

require('dotenv').config();
const USER_PATH = process.env.USER_PATH;

const AddingUsers = (props) => {
    const { currentUsers,
        currentRoomName,
        userState,
        setAddingUser,
        addUsersAction,
        currentRoomId } = props;
    const { t, i18n } = useTranslation();

    function addUser(event) {
        event.preventDefault();
        let allTarget = Object.values(event.target);
        let contactsList = allTarget.filter(c => c.checked);
        const date = new Date();
        const dateStr = date.getTime().toString();
        let newUsers = contactsList.map(c => {
            return { userName: c.value, _id: c.id, joinDate: dateStr };
        });

        addUsersAction({ roomId: currentRoomId, newUsers });
    }


    function goBack() {
        setAddingUser(false);

    }
    const currentUsersIds = currentUsers.map(c => c._id);
    return (
        <div className='adding-mod'>
            <div className='adding-box'>
                <h1 className='adding-title'>{t('Add users to')} {currentRoomName}</h1>
                <Divider />
                <Divider />
                {<form className='adding-form'
                    onSubmit={addUser}
                >
                    {<div className='adding-contacts'>
                        {userState.contacts.map(c => {
                            if (!currentUsersIds.includes(c._id) && c.status === "accepted") {
                                return (<label htmlFor={c._id} key={c._id} className='adding-contacts__contact'>
                                    <input
                                        id={c._id}
                                        type="checkbox"
                                        name="participants"
                                        value={c.userName} /> {c.userName}
                                </label>)
                            }
                        })
                        }
                    </div>
                    }
                    <Button
                        className='adding-button'
                        id='adding-button'
                        type='submit'
                        color='inherit'
                        variant='contained'
                    >
                        {t('Add')}
                    </Button>
                </form>}
                <Button
                    className='adding-button__cancel'
                    id='adding-button__cancel'
                    onClick={goBack}
                    color='inherit'
                    variant='contained'
                >
                    {t('Cancel')}
                </Button>
            </div>
        </div>)
}



const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        currentRoomName: state.currentRoomName,
        currentRoomId: state.currentRoomId,
        currentUsers: state.currentUsers
    }
};

const mapDispatchToProps = {
    setAddingUser,
    addUsersAction
};

export default connect(mapStateToProps, mapDispatchToProps)(AddingUsers);