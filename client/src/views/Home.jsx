import React from 'react';
import { connect } from 'react-redux';

const Home = ({ username, friends }) => (
    <>
    <h1>Hello {username}</h1>
    <div>
            Friends: 
            <ul>
            {friends.map( friend => <li> {friend} </li>)}
            </ul>
    </div>
    </>
)

const mapStateToProps = state => {
    return {
        username: state.users[0].username,
        friends: state.users[0].friends
    }
}

export default connect(mapStateToProps, null)(Home);