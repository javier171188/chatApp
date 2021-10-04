import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
import '../styles/components/UploadAvatar.css';

const UploadAvatar = () => {
    const { t, i18n } = useTranslation();
    return (
        <Context.Consumer>
            {
                ({saveAvatarImage}) => {
                    return (
                        <section className='profile'>
                            <section className='profile__container'>
                                <h2>{t('Upload an Avatar Image')}</h2>
                                <form className='profile__container--form' onSubmit={saveAvatarImage} >
                                    <input 
                                    name='avatar'
                                    className='input' 
                                    type='file' 
                                    required
                                    />
                                    
                                    <button className='button'>{t('Save')}</button>
                                </form>
                                <p className='profile__container--login'>
                                <Link to='/chat'>{t('Skip')}</Link>
                                </p>
                            </section>
                        </section>
                    )
                }
            }
        </Context.Consumer>

    )
};

export default UploadAvatar;
