let loginLogoutState = {
    errorMessages: [],
    isAuth: sessionStorage.getItem("token"),
}

export default loginLogoutState;