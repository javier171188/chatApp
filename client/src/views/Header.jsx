import React from 'react';
import '../styles/components/Header.css';
import Context from '../context/Context';


const Header = () => (
<Context.Consumer>
    {
        ({ logOut }) => {
            return (
                <button onClick={logOut} className='header--logout'> Logout</button>
            )
        }
    }   
</Context.Consumer>
);

export default Header;