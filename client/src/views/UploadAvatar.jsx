import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Context from '../context/Context';
import '../styles/components/UploadAvatar.css';

const UploadAvatar = () => {
    function saveAvatarImage (event){
        event.preventDefault();
        const selectedFile = event.target[0].files[0];
        const formData = new FormData();

        formData.append(
            "avatar",
            selectedFile,
            selectedFile.name
          );

        const conf = {
           headers: {
                        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
                    }
        }
        axios.post("http://localhost:3000/avatar", formData, conf).then(()=>{
            window.location.href = '/chat';
        }).catch(e => console.error(e));

    }

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
};

export default UploadAvatar;
