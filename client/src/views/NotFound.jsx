import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/NotFound.css';

const NotFound = () => (
    <>
    <h1>
        <p>We could not find what you are looking for. </p>
        <p>Did you spell correctly the address?</p>
    </h1>
    <div>
        Go &nbsp;
        <Link to='/'>
             Home!
        </Link>        
    </div> 
    </>
);

export default NotFound;