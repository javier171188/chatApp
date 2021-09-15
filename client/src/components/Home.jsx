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
    
    return(
    <>
        <Header />
        <section className='main-area'>
            <Sideview />
            <WorkingArea />
        </section>
        
    </>
)}


export default Home;