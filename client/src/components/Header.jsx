import React from 'react';
import '../styles/components/Header.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    function changeLanguage(event){
        event.preventDefault();
        let language = event.target.id.split('-')[0];
        i18n.changeLanguage(language).then(v => console.log(v));
    }
    return(
        <Context.Consumer>
            {
                ({ logOut }) => {
                    return (
                        <header className='header'>
                        <h1 className='header-title'>{t('App name')}</h1>
                        <div className="header__menu">
                            <div className="header__menu--profile">
                                <p>H</p>
                            </div>
                            <ul>
                                <li><a href="/">{t('Setting')}</a></li>
                                <li><a href="/">{t('Logout')}</a></li>
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
*/