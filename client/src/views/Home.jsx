import React from 'react';
import Header from './Header';
import Profile from './Profile';
import WorkingArea from './WorkingArea';
import '../styles/components/Header.css';
import '../styles/components/Home.css';


const Home = () => {
    const mockUser = {
        userName: 'Tom',
        friends: ['Andy', 'Daniel', 'Homer', 'Bob', 'Jessica']
    };
    
    const user = mockUser; //Here the axios request;
    return(
    <>
        <Header />
        <section className='main-area'>
        <Profile userName={user.userName}>
            {user.friends}
        </Profile>
        <WorkingArea />
        </section>
        
    </>
)}


export default Home;