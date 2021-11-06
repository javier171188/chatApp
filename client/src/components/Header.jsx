import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';

const Header = (props) => {
    const { t, i18n } = useTranslation();
    function goHome(e) {
        e.preventDefault();
        window.location.href = '/chat/'
    }
    function handleLogOut() {
        console.log('It must set auth= false, and request logout to the backend')
    }

    return (
        <header className='header'>
            <div className="to-center">
                <div>
                    <p> ...</p>
                </div>
            </div>
            <h1 className='header-title' onClick={goHome}>{t('App name')}</h1>
            <div className="header__menu">
                <div className="header__menu--button">
                    <p className='header__menu--icon'><MenuIcon></MenuIcon></p>
                </div>
                <ul className='header__menu--options'>
                    <li ><Link className='header__menu--item' to="/chat/settings/">{t('Settings')}</Link></li>
                    <li ><div className='header__menu--item' onClick={handleLogOut}>{t('Logout')}</div></li>
                </ul>
            </div>
        </header>
    )
}

export default Header;
