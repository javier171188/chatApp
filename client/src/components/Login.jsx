import React from "react";
import { connect } from "react-redux";
import store from "../redux/store";
import { setError } from "../redux/actions";
import { Link } from "react-router-dom";
import "../styles/components/Login.css";
import { useTranslation } from "react-i18next";
import { Input, Button, Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useReducer } from "react";
import { initialStateLogin, loginFormReducer } from "../hooks/useReduxLogin";
import * as type from "../redux/types";


const Login = (props) => {
	const { errorMessages } = props;

	const [state, dispatch] = useReducer(loginFormReducer, initialStateLogin);

	const {
		email,
		password
	} = state;

	const handleMailWrite = (e) => {
		dispatch({
			type: 'WRITE_EMAIL',
			payload: e.currentTarget.value,
		})
	}
	const handlePasswordWrite = (e) => {
		dispatch({
			type: 'WRITE_PASSWORD',
			payload: e.currentTarget.value
		})
	}

	const action = ({ type, data }) => store.dispatch({
		type,
		data,
	});
	function handleLogin(e) {
		e.preventDefault();
		action({
			type: type.LOGIN,
			data: e.target,
		});
	}

	function goRegister() {
		props.setError({
			errorMessages: "",
		});
	}

	const { t, i18n } = useTranslation();
	return (
		<section className='login'>
			<Box
				component="section"
				className='login__container'
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
					{t("Login")}
				</Typography>
				<Container>
					<form
						className='login__container--form'
						onSubmit={handleLogin}
						variant="outlined"
						color='primary'
					>
						<Input
							name='email'
							className='input'
							id='login-input__mail'
							type='text'
							placeholder={t("E-mail")}
							value={email}
							onChange={handleMailWrite}
						/>
						<Input
							name='password'
							className='input'
							id='login-input__password'
							type='password'
							placeholder={t("Password")}
							value={password}
							onChange={handlePasswordWrite}
						/>
						<Button
							className='button'
							variant='contained'
							color='primary'
							id='login-button'
							type='submit'
						>
							{t("Log in")}
						</Button>
						{errorMessages.length >= 1
							? <Alert severity="error">
								<AlertTitle></AlertTitle>
								{t("Incorrect credentials")}
							</Alert>
							: <></>
						}
					</form>
				</Container>
				<p className='login__container--register'>
					{t("Not a user yet?")} <Link to='/chat/register' onClick={goRegister}> {t("Register")}</Link>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
