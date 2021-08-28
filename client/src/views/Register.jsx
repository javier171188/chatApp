import React, { useState } from 'react';
import { connect } from 'react-redux';
import { registerRequest } from '../actions';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';
import axios from 'axios';

const Register = (props) => {
	const [form, setValues] = useState({
		email: '',
		userName: '',
		password: ''
	})

	const handleInput = event => {
		setValues({
			...form,
			[event.target.name]: event.target.value
		})
	};

	const handleSubmit = event => {
		event.preventDefault();
		props.registerRequest(form);
		console.log(form);
		axios.post('http://localhost:3000/register', form)
			.then(data => console.log(data));
		props.history.push('/chat');
	}

	return (
		<section className='register'>
			<section className='register__container'>
				<h2>Register</h2>
				<form className='register__container--form' onSubmit={handleSubmit}>
					<input 
					name='userName'
					className='input' 
					type='text' 
					placeholder='User name' 
					onChange={handleInput}
					/>
					<input 
						name="email"
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
					<button className='button'>Register</button>
				</form>
				<p className='register__container--login'>
				Already a member?  <Link to='/chat/login'>Log in</Link>
				</p>
			</section>
		</section>
)};
	
const mapDispatchToProps = {
	registerRequest,
};	

export default connect(null, mapDispatchToProps)(Register);