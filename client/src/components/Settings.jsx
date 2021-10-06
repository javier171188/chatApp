import axios from 'axios';
import Header from './Header';
import '../styles/components/Header.css';
import '../styles/components/Settings.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

require('dotenv').config();

const USER_PATH=process.env.USER_PATH;

const LANGUAGES = [
                    {code: 'en', name:'English'},
                    {code: 'es', name:'Spanish'},
                    {code: 'fr', name:'French'},
                ];



const Settings = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('language'));
    
    function goBack(e){
        e.preventDefault();
        window.location.href = '/chat/'
    }

    function changeLanguage(event){
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
        axios.post(USER_PATH+'/changeLanguage', paramsLang ,conf ).catch( e => console.log(e));
        i18n.changeLanguage(chosenLanguage.value);
        localStorage.setItem('language', chosenLanguage.value);
    }

    function handleChange(e){
        setLanguage(e.target.value);
    }


    return (
        <Context.Consumer>{
            ({userState}) => {
                return (
                    <>
                    <Header />
                    <h1 className='settings__title'>{t('Settings')}</h1>
                    <div className='settings__user'>
                        <h2 className='settings__user-title'>{t('User Options')} </h2>
                        <div className='setting__user--options'>{t('User Options')}...</div>
                    </div>
                    <form onSubmit={(e)=> changeLanguage(e)} className='settings__language'>
                        <h2 className='settings__language-title'>{t('Choose your language')}</h2>
                        <div className='settings__language-container'>
                            <div className='settings__language-list'>
                                {LANGUAGES.map(l =>{
                                return (<label htmlFor={l.code} key={l.code} className='settings__language-label'>
                                            <input 
                                                id={l.code} 
                                                type="radio" 
                                                name="participants" 
                                                value={l.code}
                                                checked={l.code === language}   
                                                onChange={ e => handleChange(e)} 
                                            /> 
                                            {t(l.name)}
                                        </label>)
                            })}
                            </div>
                            <button className='settings__language-button'>{t('Choose')}</button>
                        </div>
                    </form>
                    <button onClick={goBack} className='settings__cancel-button'>{t('Go back')}</button>
                    </>
                )
            }
        }
        </Context.Consumer>
    )
}

export default Settings;