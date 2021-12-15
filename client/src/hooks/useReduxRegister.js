const initialStateRegister = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const registerFormReducer = (state, action) => {
    switch (action.type) {
        case 'WRITE_USER_NAME':
            return {
                ...state,
                userName: action.payload
            }
        case 'WRITE_EMAIL':
            return {
                ...state,
                email: action.payload
            }
        case 'WRITE_PASSWORD':
            return {
                ...state,
                password: action.payload
            }
        case 'WRITE_CONFIRM_PASSWORD':
            return {
                ...state,
                confirmPassword: action.payload
            }
        default: return state
    }
}

module.exports = {
    initialStateRegister,
    registerFormReducer
}