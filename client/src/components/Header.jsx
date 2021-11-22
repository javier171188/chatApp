import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';
import { connect } from 'react-redux';
import { setAuth } from '../redux/actions';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import * as type from '../redux/types';
import store from '../redux/store';

const Header = (props) => {
    const { t, i18n } = useTranslation();

    const action = ({ type, data }) => store.dispatch({
        type,
        data
    })
    action({
        type: type.GET_USER,
    });

    function goHome(e) {
        e.preventDefault();
        window.location.href = '/chat/'
        //props.history.push('/chat/');
    }

    function handleLogOut() {
        action({
            type: type.LOGOUT,
        });
        //window.location.href = '/chat/';
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


const mapDispatchToProps = {
    setAuth,
}

export default connect(null, mapDispatchToProps)(Header);