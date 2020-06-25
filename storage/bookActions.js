/*
 * author: Julien Miens
 * date: Juin 2020
 * description: utilisation de redux pour le stokage des livres
 */

export const ADD_BOOK = 'ADD_BOOK';
export const EDIT_BOOK = 'EDIT_BOOK';
export const REMOVE_BOOK = 'REMOVE_BOOK';
export const REMOVE_BOOKS = 'REMOVE_BOOKS'; // pour en supprimer plusieurs d'un coup
//export const GET_LENGTH = 'GET_LENGTH'; // nombre de livres total
//export const EXISTS = 'EXISTS';  // existence d'un livre, à vérifier avant ajout
export const REMOVE_ALL = 'REMOVE_ALL';


export const addBook = data => {
    return {
        type: ADD_BOOK,
        data,
    };
};

export const editBook = data => {
    return {
        type: EDIT_BOOK,
        data,
    };
};

export const removeBook = key => {
    return {
        type: REMOVE_BOOK,
        key,
    };
};

export const removeBooks = keys => {
    return {
        type: REMOVE_BOOKS,
        keys,
    };
};

export const removeAll = () => {
    return {
        type: REMOVE_ALL,
    };
};
