import React from 'react';
import '../styles/components/Profile.css'

const Profile = (props) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const avatar = user.avatar ? user.avatar : undefined;
    
    return (
        <aside className='user'>
            <div className='user-picture'>
                {
                    avatar && <img className='user-picture' src={"data:image/jpg;base64,"+avatar} alt="User's avatar" />
                
                }
                
            </div> 
            <div className='user-info'>
                <div className='user-name--container'>
                    <h1 className='user-name--text'>
                        {props.userName}
                    </h1>
                </div>
                <hr/>
                <div className='user-contacts'>
                    <ul>
                        <h2>Contacts:</h2>
                        {props.children.map( child => (
                            <li key={child} className='contact'> {child} </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Profile;