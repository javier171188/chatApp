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

const mapStateToProps = state => {
    return {
        username: state.username,
        friends: state.friends,
        token: state.token,
    }
}

export default Home;