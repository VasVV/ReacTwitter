const updatecomponent = (state = 0, action) => {
    switch (action.type) {
        case 'UPDATE':
            return state+1;
        default:
            return state    
    }
}

export default updatecomponent;