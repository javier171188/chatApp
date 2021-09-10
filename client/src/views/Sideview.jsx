import React from 'react';
import Context from '../context/Context';
import '../styles/components/Sideview.css'

const Sideview = (props) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const avatar = user.avatar ? user.avatar : undefined;
    
    return (
        <Context.Consumer>
			{ ({userState}) => (
        <aside className='user'>
            <div className='user-picture'>
                {
                    avatar && <img className='user-picture' src={"data:image/jpg;base64,"+avatar} alt="User's avatar" />
                
                }
                
            </div> 
            <div className='user-info'>
                <div className='user-name--container'>
                    <h1 className='user-name--text'>
                        {user.userName}
                    </h1>
                </div>
                <hr/>
                <div className='user-contacts'>
                    <ul>
                        <h1>Contacts:</h1>
                        {user.contacts.map( child => (
                            <li key={child._id} className='contact'> {child.userName} </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='chats'>
                <h1>Chats:</h1>
                <nav className='chats-nav'>You have not started any chat. Click a user to start one!</nav>
            </div>
        </aside>
             
            )
        }
    </Context.Consumer>

    );
};

export default Sideview;