import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';
import { useTranslation } from 'react-i18next';
import Context from '../context/Context';
import Input from '@mui/material/Input';

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
								<Input 
								name='userName'
								className='input' 
								id='input-user-name'
								type='text' 
								placeholder={t('User name')} 
								required
								/>
								<Input 
									name="email"
									className='input' 
									id='input-email'
									type='text' 
									placeholder={t('E-mail')} 
									required
								/>
								<Input 
									name='password'
									className='input' 
									id='input-password'
									type='password' 
									placeholder={t('Password')} 
									required
									minLength='6'
								/>

								<Input 
									name='confirm-password'
									className='input'
									id='input-confirm-password'
									type='password' 
									placeholder={t('Confirm your password')}
									required
									minLength='6'
								/>
								<label className='avatar-label'> 
									{t('Choose a profile image:')}
								</label>
								<Input 
                                    name='avatar'
									id='input-avatar'
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