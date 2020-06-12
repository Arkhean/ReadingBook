export default class StorageManager {
    /* pour sauvegarder la base de données */
    async store(key, value){
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            // saving error
        }
    }

    async load(key){
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    async remove(key){
        try {
            await AsyncStorage.removeItem(key);
        } catch(e) {
            // remove error
        }
    }

}
