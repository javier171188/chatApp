import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';
import { useTranslation } from 'react-i18next';
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

	const { t, i18n } = useTranslation();
	return (
	<Context.Consumer>
		{
			({ registerUser, errorMessages, setErrorMessages }) => {
				return (
					<section className='register'>
						<section className='register__container'>
							<h2>{t('Register')}</h2>
							<form className='register__container--form' onSubmit={ registerUser }>
								<input 
								name='userName'
								className='input' 
								type='text' 
								placeholder={t('User name')} 
								required
								/>
								<input 
									name="email"
									className='input' 
									type='text' 
									placeholder={t('E-mail')} 
									required
								/>
								<input 
									name='password'
									className='input' 
									type='password' 
									placeholder={t('Password')} 
									required
									minLength='6'
								/>

								<input 
									name='confirm-password'
									className='input' 
									type='password' 
									placeholder={t('Confirm your password')}
									required
									minLength='6'
								/>
								<label className='avatar-label'> 
									{t('Choose a profile image:')}
								</label>
								<input 
                                    name='avatar'
                                    className='input avatar-input' 
                                    type='file' 
                                />
								

								<button className='button' id='register-button'>{t('Register')}</button>
								
								{ errorMessages.length >= 1
										&& <div className='login--error' >{errorMessages[0]}</div>
										
								}
							</form>
							<p className='register__container--login'>
							{t('Already a member?')}  <Link to='/chat/login' onClick={()=>setErrorMessages([])}>{t('Log in')}</Link>
							</p>
						</section>
					</section>
				)
			}
		}
	</Context.Consumer>
	)};
	

export default Register;