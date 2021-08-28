import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginRequest } from '../actions';
import '../styles/components/Login.css';

const Login = props => {
	const [ form, setValues ] = useState({
		email: '',
	});

	const handleInput = event => {
		setValues({
			...form,
			[event.target.name]: event.target.value
		})
	}

	const handleSubmit  = event => {
		event.preventDefault();
		props.loginRequest(form);
		props.history.push('/chat');
		console.log(form);
	}
	return (
		<section className='login'>
			<section className='login__container'>
				<h2>Login</h2>
				<form className='login__container--form' onSubmit={handleSubmit}>
					<input 
						name='email'
						className='input' 
						type='text' 
						placeholder='E-mail' 
						onChange={handleInput}
					/>
					<input 
						name='password'
						className='input' 
						type='password' 
						placeholder='Password' 
						onChange={handleInput} 
					/>
					<button className='button'>Login</button>
				</form>
				
				<p className='login__container--register'>
					Not a user yet? <Link to='/chat/register'> Register</Link>
				</p>
			</section>
		</section>
)};

const mapDispatchToProps = {
	loginRequest,
};

export default connect(null, mapDispatchToProps)(Login);