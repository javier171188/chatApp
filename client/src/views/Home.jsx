import React from 'react';
import Header from './Header';
import '../styles/components/Header.css';


const Home = () => {
    
    return(
    <>
        <Header />
        <h1>Hello generic user!</h1>
        <div>
                You can only get here if you are registered.
        </div>
        
    </>
)}


export default Home;