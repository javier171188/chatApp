import React from 'react';
import '../styles/components/Header.css';
import Context from '../context/Context';

import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    return(
        <Context.Consumer>
            {
                ({ logOut }) => {
                    return (
                        <header className='header'>
                        <h1 className='header-title'>{t('App name')}</h1>
                        <button onClick={logOut}> Logout</button>
                        </header>
                    )
                }
            }   
        </Context.Consumer>
        );
}


export default Header;