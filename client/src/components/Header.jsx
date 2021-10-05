import React from 'react';
import { Link } from 'react-router-dom';
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
                        <div className="header__menu">
                            <div className="header__menu--button">
                                <p className='header__menu--icon'> ...</p>
                            </div>
                            <ul className='header__menu--options'>
                                <li ><Link className='header__menu--item'  to="/chat/settings/">{t('Settings')}</Link></li>
                                <li ><div className='header__menu--item' onClick={logOut}>{t('Logout')}</div></li>
                            </ul>
                        </div>
                        </header>
                    )
                }
            }   
        </Context.Consumer>
        );
}
export default Header;

/*<button onClick={logOut}> {t('Logout')}</button>
                        <button onClick={changeLanguage} id="en-button"> {t('English')}</button>
                        <button onClick={changeLanguage} id="es-button"> {t('Spanish')}</button>
                        <button onClick={changeLanguage} id="fr-button"> {t('French')}</button>

                        function changeLanguage(event){
        event.preventDefault();
        let language = event.target.id.split('-')[0];
        i18n.changeLanguage(language).then(v => console.log(v));
    }
*/