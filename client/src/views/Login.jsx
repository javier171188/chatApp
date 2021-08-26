import React from 'react';
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
				Not an user yet? <a href=''>Register</a>
			</p>
		</section>
	</section>
);

export default Login;