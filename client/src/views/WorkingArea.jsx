import React from "react";
import '../styles/components/WorkingArea.css';


const WorkingArea = () => {
    return (
        <div className='working'>
            <nav className='working-nav'>
                <input className='working-search' type="text" placeholder='Search for users...' />
                <button className='working-button'>Search!</button>
            </nav>
            <div className='chats'>
                <h1>Chats:</h1>
                <nav className='chats-nav'>You have not started any chat. Click a user to start one!</nav>
            </div>
            <div className='chat'>
                <div className='chat-messages'></div>
                <input className='chat-writing' type="text" placeholder='Type a message...' />
                <button className='chat-button'>Send</button>
            </div>
        </div>
    );
};

export default WorkingArea;