import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Login.css';

const Login = () => (
    <section className='login'>
		<section className='login__container'>
			<h2>Login</h2>
			<form className='login__container--form'>
				<input className='input' type='text' placeholder='e-mail' />
				<input className='input' type='password' placeholder='password' />
				<button className='button'>Login</button>
				
			</form>
			
			<p className='login__container--register'>
				Not a user yet? <Link to='/register'> Register</Link>
			</p>
		</section>
	</section>
);

export default Login;