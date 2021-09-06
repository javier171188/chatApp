import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Context from '../context/Context';
import '../styles/components/UploadAvatar.css';

const UploadAvatar = () => {
    
    return (
        <Context.Consumer>
            {
                ({saveAvatarImage}) => {
                    return (
                        <section className='profile'>
                            <section className='profile__container'>
                                <h2>Upload an Avatar Image</h2>
                                <form className='profile__container--form' onSubmit={saveAvatarImage} >
                                    <input 
                                    name='avatar'
                                    className='input' 
                                    type='file' 
                                    required
                                    />
                                    
                                    <button className='button'>Save</button>
                                </form>
                                <p className='profile__container--login'>
                                <Link to='/chat'>Skip</Link>
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
