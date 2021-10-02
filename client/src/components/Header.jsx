import React from 'react';
import '../styles/components/Header.css';
import Context from '../context/Context';

import { useTranslation } from 'react-i18next';

const Header = ({t}) => {
    //const { t, i18n } = useTranslation();
    //https://react.i18next.com/legacy-v9/step-by-step-guide
    return(
        <Context.Consumer>
            {
                ({ logOut }) => {
                    return (
                        <header className='header'>
                        <h1 className='header-title'>{t('Welcome to React')}</h1>
                        <button onClick={logOut}> Logout</button>
                        </header>
                    )
                }
            }   
        </Context.Consumer>
        );
}


export default Header;