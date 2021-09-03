import React from 'react';
import Header from './Header';
import Profile from './Profile';
import '../styles/components/Header.css';




const Home = () => {
    const mockUser = {
        userName: 'Tom',
        friends: ['Andy', 'Daniel', 'Homer', 'Bob', 'Jessica']
    };
    
    const user = mockUser; //Here the axios request;
    return(
    <>
        <Header />
        <Profile userName={user.userName}>
            {user.friends}
        </Profile>
       
        
    </>
)}


export default Home;