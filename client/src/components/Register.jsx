import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setError } from '../redux/actions';
import { Link } from 'react-router-dom';
import '../styles/components/Register.css';
import { useTranslation } from 'react-i18next';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const Register = (props) => {
	const { t, i18n } = useTranslation();

	function registerUser(e) {
		e.preventDefault();
		props.setError(['sagas not ready'])
	}

	function setErrorMessages(eM) {
		props.setError(eM)
	}

	return (
		<section className='register'>
			<section className='register__container'>
				<h2>{t('Register')}</h2>
				<form className='register__container--form' onSubmit={registerUser}>
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


					<Button
						className='button'
						id='register-button'
						color='inherit'
						variant='contained'
						type='submit'
					>
						{t('Register')}
					</Button>

					{props.errorMessages.length >= 1
						&& <div className='login--error' >{props.errorMessages[0]}</div>
					}
				</form>
				<p className='register__container--login'>
					{t('Already a member?')}  <Link to='/chat/login' onClick={() => setErrorMessages([])}>{t('Log in')}</Link>
				</p>
			</section>
		</section>
	)
};

const mapStateToProps = (state) => {
	return {
		errorMessages: state.errorMessages
	}
}

const mapDispatchToProps = {
	setError,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);