import React from "react";
import { connect } from "react-redux";
import { setError, registerAction } from "../redux/actions";
import { Link } from "react-router-dom";
import "../styles/components/Register.css";
import { initialStateRegister, registerFormReducer } from "../hooks/useReduxRegister";
import { useTranslation } from "react-i18next";
import { useReducer } from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';


const Register = (props) => {
	const { t, i18n } = useTranslation();

	const [state, dispatch] = useReducer(registerFormReducer, initialStateRegister);

	const {
		userName,
		email,
		password,
		confirmPassword
	} = state;

	const handleUserNameWrite = (e) => {
		dispatch({
			type: 'WRITE_USER_NAME',
			payload: e.currentTarget.value,
		})
	}

	const handleEMailWrite = (e) => {
		dispatch({
			type: 'WRITE_EMAIL',
			payload: e.currentTarget.value,
		})
	}

	const handlePasswordWrite = (e) => {
		dispatch({
			type: 'WRITE_PASSWORD',
			payload: e.currentTarget.value,
		})
	}

	const handleConfirmPasswordWrite = (e) => {
		dispatch({
			type: 'WRITE_CONFIRM_PASSWORD',
			payload: e.currentTarget.value,
		})
	}

	function registerUser(e) {
		e.preventDefault();
		props.registerAction(e);
	}

	function setErrorMessages(eM) {
		props.setError(eM);
	}

	return (
		<section className='register'>
			<Box
				component="section"
				className='register__container'
				sx={{
					border: 3,
					borderColor: 'primary.main'
				}}
			>
				<Typography
					variant="h4"
					component="h2"
					className='settings__title'
					color="primary"
				>
					{t("Register")}
				</Typography>
				<form className='register__container--form' onSubmit={registerUser}>
					<Input
						name='userName'
						className='input'
						id='input-user-name'
						type='text'
						placeholder={t("User name")}
						required
						value={userName}
						onChange={handleUserNameWrite}
					/>
					<Input
						name="email"
						className='input'
						id='input-email'
						type='text'
						placeholder={t("E-mail")}
						required
						value={email}
						onChange={handleEMailWrite}
					/>
					<Input
						name='password'
						className='input'
						id='input-password'
						type='password'
						placeholder={t("Password")}
						required
						minLength='6'
						value={password}
						onChange={handlePasswordWrite}
					/>

					<Input
						name='confirm-password'
						className='input'
						id='input-confirm-password'
						type='password'
						placeholder={t("Confirm your password")}
						required
						minLength='6'
						value={confirmPassword}
						onChange={handleConfirmPasswordWrite}
					/>
					<label className='avatar-label'>
						{t("Choose a profile image:")}
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
						variant='contained'
						type='submit'
					>
						{t("Register")}
					</Button>

					{props.errorMessages.length >= 1
						&& <Alert severity="error">
							<AlertTitle></AlertTitle>
							{t(props.errorMessages[0])}
						</Alert>
					}
				</form>
				<p className='register__container--login'>
					{t("Already a member?")}  <Link to='/chat/login' onClick={() => setErrorMessages([])}>{t("Log in")}</Link>
				</p>
			</Box>
		</section >
	);
};

const mapStateToProps = (state) => ({
	errorMessages: state.loginLogout.errorMessages,
});

const mapDispatchToProps = {
	setError,
	registerAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
