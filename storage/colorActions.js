/*
 * author: Julien Miens
 * date: Juin 2020
 * description: utilisation de redux pour la gestion des couleurs paramétrables
 * de l'application, ce fichier contient les actions applicable sur le store
 */

export const SET_MAIN_COLOR = 'SET_MAIN_COLOR';
export const SET_SECONDARY_COLOR = 'SET_SECONDARY_COLOR';
export const SET_READ_COLOR = 'SET_READ_COLOR';
export const SET_UNREAD_COLOR = 'SET_UNREAD_COLOR';

export const setMainColor = data => {
    return {
        type: SET_MAIN_COLOR,
        data,
    };
};

export const setSecondaryColor = data => {
    return {
        type: SET_SECONDARY_COLOR,
        data,
    };
};

export const setReadColor = data => {
    return {
        type: SET_READ_COLOR,
        data,
    };
};

export const setUnreadColor = data => {
    return {
        type: SET_UNREAD_COLOR,
        data,
    };
};
