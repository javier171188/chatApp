import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Login.css';
import Context from '../context/Context';
import { useInputValue } from '../hooks/useInputValue';


const Login = () => {
	const email = useInputValue('')
	const password = useInputValue('')
	/*
	const handleInput = event => {
		setValues({
			...form,
			[event.target.name]: event.target.value
		})
	}

	const handleSubmit  = event => {
		event.preventDefault();
		props.history.push('/chat');
		console.log(form);
	}*/
	return (
		<Context.Consumer>
			{
				({ logIn, errorMessages }) => {
					return (<section className='login'>
								
								<section className='login__container'>
									<h2>Login</h2>
									<form className='login__container--form' onSubmit={logIn}>
										<input 
											name='email'
											className='input' 
											type='text' 
											placeholder='E-mail' 
											{...email}
										/>
										<input 
											name='password'
											className='input' 
											type='password' 
											placeholder='Password' 
											{...password}
										/>
										<button className='button'>Login</button>
										{ errorMessages.length >= 1
											? <div className='login--error'> Wait. </div>
											: ''
										}
										
									</form>
									
									<p className='login__container--register'>
										Not a user yet? <Link to='/chat/register'> Register</Link>
									</p>
								</section>
							</section>

					)
				}
			}
		
		</Context.Consumer>
)};


export default Login;