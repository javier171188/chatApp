const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return {
                ...state,
                errorMessages: [action.payload]
            }
        default:
            return state;
    }
}

export default reducer;