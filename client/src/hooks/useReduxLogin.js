const initialStateLogin = {
  email: '',
  password: ''
}

const loginFormReducer = (state, action) => {
  switch (action.type) {
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
    default: return state
  }
}

module.exports = {
  initialStateLogin,
  loginFormReducer
}