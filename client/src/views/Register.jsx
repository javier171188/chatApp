import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';
import Context from '../context/Context';

const Register = () => {
	/*const [form, setValues] = useState({
		email: '',
		userName: '',
		password: ''
	})
	const handleInput = event => {
		setValues({
			...form,
			[event.target.name]: event.target.value
		})
	};*/

	/*const handleSubmit = (event) => {
		event.preventDefault();
		const form = {
			userName: event.target[0].value,
			email: event.target[1].value,
			password: event.target[2].value,
		}
		axios.post('http://localhost:3000/register', form)
			.then(data => {
				//console.log(data);
				activateAuth();
				props.history.push('/chat');		
			}).catch(e => console.log(e));
	}
	*/

	
	return (
	<Context.Consumer>
		{
			({ registerUser }) => {
				return (
					<section className='register'>
						<section className='register__container'>
							<h2>Register</h2>
							<form className='register__container--form' onSubmit={ registerUser }>
								<input 
								name='userName'
								className='input' 
								type='text' 
								placeholder='User name' 
								required
								/>
								<input 
									name="email"
									className='input' 
									type='text' 
									placeholder='E-mail' 
									required
								/>
								<input 
									name='password'
									className='input' 
									type='password' 
									placeholder='Password' 
									required
									minLength='6'
								/>
								<button className='button'>Register</button>
							</form>
							<p className='register__container--login'>
							Already a member?  <Link to='/chat/login'>Log in</Link>
							</p>
						</section>
					</section>
				)
			}
		}
	</Context.Consumer>
	)};
	

export default Register;