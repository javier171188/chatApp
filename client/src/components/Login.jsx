import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Login.css';
import Context from '../context/Context';
import { useTranslation } from 'react-i18next';
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
										<input 
											name='email'
											className='input' 
											type='text' 
											placeholder={t('E-mail')} 
											{...email}
										/>
										<input 
											name='password'
											className='input' 
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