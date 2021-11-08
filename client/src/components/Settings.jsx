import axios from 'axios';
import Header from './Header';
import '../styles/components/Header.css';
import '../styles/components/Settings.css';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from '@mui/material/Button';

require('dotenv').config();

const USER_PATH = process.env.USER_PATH;

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
];



const Settings = ({ userState }) => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('language'));

    function goBack(e) {
        e.preventDefault();
        window.location.href = '/chat/'
    }

    function changeLanguage(event) {
        event.preventDefault();
        let languages = Object.values(event.target);
        let chosenLanguage = languages.filter(l => l.checked)[0];



        const conf = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        };
        let paramsLang = {
            email: JSON.parse(sessionStorage.getItem('email')),
            language: chosenLanguage.value
        };
        axios.post(USER_PATH + '/changeLanguage', paramsLang, conf).catch(e => console.log(e));
        i18n.changeLanguage(chosenLanguage.value);
        localStorage.setItem('language', chosenLanguage.value);
    }

    function handleChange(e) {
        setLanguage(e.target.value);
    }


    return (
        <>
            <Header />
            <h1 className='settings__title'>{t('Settings')}</h1>
            <div className='settings__user'>
                <h2 className='settings__user-title'>{t('User Options')} </h2>
                <div className='setting__user--options'>{t('User Options')}...</div>
            </div>
            <form onSubmit={(e) => changeLanguage(e)} className='settings__language'>
                <h2 className='settings__language-title'>{t('Choose your language')}</h2>
                <div className='settings__language-container'>
                    <div className='settings__language-list'>
                        {LANGUAGES.map(l => {
                            return (<label htmlFor={l.code} key={l.code} className='settings__language-label'>
                                <input
                                    id={l.code}
                                    type="radio"
                                    name="participants"
                                    value={l.code}
                                    checked={l.code === language}
                                    onChange={e => handleChange(e)}
                                />
                                {t(l.name)}
                            </label>)
                        })}
                    </div>
                    <Button
                        className='settings__language-button'
                        id='settings__language-button'
                        type='submit'
                        color='inherit'
                        variant='contained'
                    >
                        {t('Choose')}
                    </Button>
                </div>
            </form>
            <Button
                onClick={goBack}
                className='settings__cancel-button'
                id='settings__cancel-button'
                color='inherit'
                variant='contained'
            >
                {t('Go back')}
            </Button>
        </>
    )
}

export default Settings;
const mapStateToProps = (state) => {
    return {
        userState: state.userState
    }
}

export default connect(mapStateToProps, null)(Settings);