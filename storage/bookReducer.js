import
{   ADD_BOOK,
    EDIT_BOOK,
    REMOVE_BOOK,
    REMOVE_BOOKS,
    REMOVE_ALL,
}
from './bookActions.js';
import { getKey } from '../components/book.js';

const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BOOK: {
            return [ ...state, action.data ];
        }
        case EDIT_BOOK: {
            return state.map(book => {
                if (getKey(book) === getKey(action.data)){
					return action.data;
				} else {
					return book;
				}
			});
        }
        case REMOVE_BOOK: {
            return state.filter(book => getKey(book) !== action.key);
        }
        case REMOVE_BOOKS: {
            return state.filter(book => !action.keys.includes(getKey(book)));
        }
        case REMOVE_ALL: {
            return [];
        }
        default: {
            return state;
        }

    }
};

export default reducer;
