import
{   SET_MAIN_COLOR,
    SET_SECONDARY_COLOR,
    SET_READ_COLOR,
    SET_UNREAD_COLOR
}
from './actions.js';

const initialState = {
    mainColor: 'purple', 
    secondaryColor: 'cyan',
    readColor: 'green',
    unreadColor: 'red'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MAIN_COLOR: {
            return { ...state, mainColor: action.data };
        }
        case SET_SECONDARY_COLOR: {
            return { ...state, secondaryColor: action.data };
        }
        case SET_READ_COLOR: {
            return { ...state, readColor: action.data };
        }
        case SET_UNREAD_COLOR: {
            return { ...state, unreadColor: action.data };
        }
        default: {
            return state;
        }

    }
};

export default reducer;
