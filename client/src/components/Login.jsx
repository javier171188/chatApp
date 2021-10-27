import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Login.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
import { useInputValue } from '../hooks/useInputValue';
import Input from '@mui/material/Input';


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
	function goRegister(setErrorMessages){
		setErrorMessages([]);
		//window.location.href ='/chat/register';
	}
	const { t, i18n } = useTranslation();
	return (
		<Context.Consumer>
			{
				({ logIn, errorMessages, setErrorMessages }) => {
					return (<section className='login'>
								<section className='login__container'>
									<h2>{t('Login')}</h2>
									<form className='login__container--form' onSubmit={logIn}>
										<Input 
											name='email'
											className='input' 
											id='login-input__mail'
											type='text' 
											placeholder={t('E-mail')} 
											{...email}
										/>
										<Input 
											name='password'
											className='input' 
											id='login-input__password'
											type='password' 
											placeholder={t('Password')} 
											{...password}
										/>
										<button className='button'>{t('Log in')}</button>
										{ errorMessages.length >= 1
											? <div className='login--error'> {t('Incorrect credentials')} </div>
											: ''
										}
									</form>
									<p className='login__container--register'>
										{t('Not a user yet?')} <Link to='/chat/register' onClick={() => goRegister(setErrorMessages)}> {t('Register')}</Link>
									</p>
								</section>
							</section>
					)
				}
			}
		</Context.Consumer>
)};


export default Login;