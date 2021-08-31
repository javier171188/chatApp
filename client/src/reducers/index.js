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
                console.log(state);
                console.log(action.payload.data.token);
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