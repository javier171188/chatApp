import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';

const Register = () => (
    <section className='register'>
		<section className='register__container'>
			<h2>Register</h2>
			<form className='register__container--form'>
				<input className='input' type='text' placeholder='User name' />
				<input className='input' type='text' placeholder='E-mail' />
				<input className='input' type='password' placeholder='Password' />
				<button className='button'>Register</button>
			</form>
            <p className='register__container--login'>
            Already a member?
			<Link to='/login'>Log in</Link>
            </p>
		</section>
	</section>
);

export default Register;