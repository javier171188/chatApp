import React from 'react';
import Header from './Header';
import Sideview from './Sideview';
import WorkingArea from './WorkingArea';
import '../styles/components/Header.css';
import '../styles/components/Home.css';


const Home = () => {
    /*const mockUser = {
        userName: 'Tom',
        friends: ['Andy', 'Daniel', 'Homer', 'Bob', 'Jessica']
    };*/
    
    const user = JSON.parse( window.sessionStorage.getItem('user') );
    return(
    <>
        <Header />
        <section className='main-area'>
        <Sideview userName={user.userName}>
            {user.contacts}
        </Sideview>
        <WorkingArea />
        </section>
        
    </>
)}


export default Home;