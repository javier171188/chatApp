const reducer = (state, action) => {
    switch (action.type){
        case 'LOGIN_REQUEST':
           {
            return {
                ...state,
                user: action.payload,
            }
           } 
        case 'REGISTER_REQUEST':
            {   
                return {
                    ...state,
                    token:action.payload.data.token
                }
            }
        default: {
            return state;
        }
    }
}

export default reducer;