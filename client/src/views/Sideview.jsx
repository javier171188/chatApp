import React from 'react';
import '../styles/components/Sideview.css'

const Sideview = (props) => {
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
                        <h1>Contacts:</h1>
                        {props.children.map( child => (
                            <li key={child} className='contact'> {child} </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='chats'>
                <h1>Chats:</h1>
                <nav className='chats-nav'>You have not started any chat. Click a user to start one!</nav>
            </div>
        </aside>
    );
};

export default Sideview;