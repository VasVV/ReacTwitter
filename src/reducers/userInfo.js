const userInfo = (state = [], action) => {
    switch (action.type) {
        case 'ADD_USERINFO':
            return action.payload;
        default:
            return state    
    }
}

export default userInfo;