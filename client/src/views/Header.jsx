import React from 'react';
import { Link } from 'react-router-dom';
import {connect } from 'react-redux';
import '../styles/components/Header.css';

const Header = () => (
 <>
 <h1 className='header--logout'> <Link to='login'>Logout</Link></h1>
 </>
);

export default connect(null, null)(Header);