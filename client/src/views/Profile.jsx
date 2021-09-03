import React from 'react';
import '../styles/components/Profile.css'

const Profile = (props) => {
    return (
        <aside className='user'>
            <div className='user-picture'>
                
            </div>
            <div className='user-info'>
                <div className='user-name--container'>
                    <h1 className='user-name--text'>
                        {props.userName}
                    </h1>
                </div>
                <hr/>
                <div className='user-friends'>
                    <ul>
                        <h2>Friends:</h2>
                        {props.children.map( child => (
                            <li key={child} className='friend'> {child} </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Profile;