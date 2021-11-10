import React from 'react';
import { connect } from 'react-redux';
import store from '../redux/store';
import { setError } from '../redux/actions';
import { Link } from 'react-router-dom';
import '../styles/components/Login.css';
import { useTranslation } from 'react-i18next';
import { useInputValue } from '../hooks/useInputValue';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import * as type from '../redux/types';


const Login = (props) => {
	const { errorMessages } = props;
	const email = useInputValue('')
	const password = useInputValue('')


	// Example execute the action directly
	const action = ({ type, data }) => store.dispatch({
		type,
		data
	})
	function handleLogin(e) {
		e.preventDefault();
		action({
			type: type.LOGIN,
			data: e.target
		});
	}

	// Example execute the action with connect, imported from actions
	function goRegister() {
		props.setError({
			errorMessages: ''
		})
	}

	const { t, i18n } = useTranslation();
	return (
		<section className='login'>
			<section className='login__container'>
				<h2>{t('Login')}</h2>
				<form className='login__container--form' onSubmit={handleLogin}>
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
					<Button
						className='button'
						color='inherit'
						variant='contained'
						id='login-button'
						type='submit'
					>
						{t('Log in')}
					</Button>
					{errorMessages.length >= 1
						? <div className='login--error'> {t('Incorrect credentials')} </div>
						: ''
					}
				</form>
				<p className='login__container--register'>
					{t('Not a user yet?')} <Link to='/chat/register' onClick={goRegister}> {t('Register')}</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);