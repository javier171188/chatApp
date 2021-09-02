import React from 'react';
import '../styles/components/Header.css';
import Context from '../context/Context';


const Header = () => (
<Context.Consumer>
    {
        ({ logOut }) => {
            return (
                <header className='header'>
                <h1>Chat App</h1>
                <button onClick={logOut}> Logout</button>
                </header>
            )
        }
    }   
</Context.Consumer>
);

export default Header;