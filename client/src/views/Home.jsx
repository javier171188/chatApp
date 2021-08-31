import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import { homeRequest } from '../actions';
import '../styles/components/Header.css';


const Home = ({ username, friends, token }) => {
    
    return(
    <>
        <Header />
        <h1>Hello {username}</h1>
        <div>
                Friends: 
                <ul>
                {friends.map( friend => <li> {friend} </li>)}
                </ul>
        </div>
        <footer>{token}</footer>
    </>
)}

const mapStateToProps = state => {
    return {
        username: state.username,
        friends: state.friends,
        token: state.token,
    }
}

const mapDispatchToProps = {
	homeRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);