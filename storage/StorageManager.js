/*
 * author: Julien Miens
 * date: june 2020
 * description: abstraction gérant la base de données de l'application
 */

import AsyncStorage from '@react-native-community/async-storage';

export default class StorageManager {

    static async store(key, value){
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            /* mise à jour de la liste des clés */
            const jsonList = await AsyncStorage.getItem('listOfKeys');
            if (jsonList != null){
                let listOfKeys = JSON.parse(jsonList);
                for(let k of listOfKeys){
                    if (k == key){
                        return;
                    }
                }
                listOfKeys.push(key);
                await AsyncStorage.setItem('listOfKeys', JSON.stringify(listOfKeys));
            }
            else{
                await AsyncStorage.setItem('listOfKeys', JSON.stringify([key]));
            }
        } catch (e) {
            // saving error
            console.log('Erreur store : '+e);
        }
    }

    static async load(key){
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
            console.log('Erreur load : '+e);
        }
    }

    static async remove(key){
        try {
            await AsyncStorage.removeItem(key);
            const jsonList = await AsyncStorage.getItem('listOfKeys');
            if (jsonList != null){
                let listOfKeys = JSON.parse(jsonList);
                let index = listOfKeys.indexOf(key);
                if (index > -1) {
                    listOfKeys.splice(index, 1);
                }
                await AsyncStorage.setItem('listOfKeys', JSON.stringify(listOfKeys));
            }
            else{
                console.log('Erreur remove : '+e);
            }
        } catch(e) {
            // remove error
            console.log('Erreur remove : '+e);
        }
    }

    static async removeMany(keyList){
        for(let k of keyList){
            await this.remove(k);
        }
    }

    static async loadLibrary(){
        let books = [];
        try {
            const jsonValue = await AsyncStorage.getItem('listOfKeys');
            if (jsonValue != null){
                let list = JSON.parse(jsonValue);
                for(let key of list){
                    try {
                        const book = await AsyncStorage.getItem(key);
                        if (book != null){
                            books.push(JSON.parse(book));
                        }
                    } catch(e) {
                        // error reading value
                        console.log('Erreur loadLibrary ('+key+'): '+e);
                    }
                }
            }
        } catch(e) {
            // error reading value
            console.log('Erreur loadLibrary : '+e);
        }
        return books;
    }

    static async loadKeys(){
        try {
            const jsonValue = await AsyncStorage.getItem('listOfKeys');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch(e) {
            // error reading value
            console.log('Erreur loadKeys : '+e);
        }
    }

    /* remove all data */
    static async prune(){
        try {
            const jsonValue = await AsyncStorage.getItem('listOfKeys');
            if (jsonValue != null){
                let list = JSON.parse(jsonValue);
                for(let key of list){
                    try {
                        await this.remove(key);
                    } catch(e) {
                        // error reading value
                        console.log('Erreur prune : '+e);
                    }
                }
            }
        } catch(e) {
            // error reading value
            console.log('Erreur prune : '+e);
        }
    }
}
