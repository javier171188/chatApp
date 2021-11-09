import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import store from '../redux/store';
import ChatView from "./ChatView";
import '../styles/components/WorkingArea.css';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import * as type from '../redux/types';


require('dotenv').config();


const USER_PATH = process.env.USER_PATH;


const WorkingArea = (props) => {
    const { userState, searchMessage, searchUser } = props;
    const { t, i18n } = useTranslation();
    //const [searchMessage, setSearchMessage] = useState(t('InitialMessage'));
    //const [searchUser, setSearchUser] = useState(null);

    const action = ({ type, data }) => store.dispatch({
        type,
        data
    })

    function lookForUser(event) {
        event.preventDefault();
        action({
            type: type.LOOK_FOR_USER,
            data: {
                event
            }
        });

    }

    async function addContact({ userState, updateUser, socket }) {
        try {
            let currentId = userState._id;
            let contactsMails = userState.contacts.map(c => c.email);
            if (currentId === searchUser._id) {
                setSearchMessage(t('You cannot add yourself, try another e-mail address.'))
            } else if (contactsMails.includes(searchUser.email)) {
                let alreadyContact = userState.contacts.filter(c => c.email === searchUser.email)[0];
                setSearchMessage(alreadyContact.userName + t(' is already your contact.'))
            }
            else {
                const conf = {
                    headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                    }
                };
                const data = await axios.post(USER_PATH + '/addContactNoConf', {
                    "logged": currentId,
                    "searched": searchUser
                }, conf)
                //sessionStorage.setItem('user', data.data);
                updateUser(data.data);

                socket.emit('userAccepted', { acceptedId: searchUser._id }, () => {
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <div className='working'>
            <form className='working-nav' onSubmit={lookForUser}>
                <Input id='email-search'
                    className='working-search'
                    type="text"
                    placeholder={t('Type an e-mail...')}
                />
                <Button
                    className='working-button'
                    id='search-user-button'
                    color='inherit'
                    variant='contained'
                    type='submit'
                    startIcon={<SearchIcon />}
                >
                    {t('Search!')}
                </Button>
            </form>
            <div className="found-user">
                {t(searchMessage)}
                {searchMessage === 'One user found: ' && <>
                    <h2 className='found-user__user'>
                        {searchUser.userName}
                    </h2>
                    <Button
                        onClick={addContact}
                        id='found-user__add-button'
                        color='inherit'
                        variant='contained'
                    >
                        {t('Add contact')}
                    </Button>
                </>}
            </div>
            <ChatView />
        </div>
    );
};

export default WorkingArea;

const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        searchMessage: state.searchMessage,
        searchUser: state.searchUser
    }
}

export default connect(mapStateToProps, null)(WorkingArea);