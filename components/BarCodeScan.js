import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

// TODO : ajouter la lampe si besoin... ?

const defaultBook = {   title: '',
                        author: '',
                        saga: '',
                        nTome: 1, // si sage != ''
                        genre: '',
                        editor: '',
                        format: '', // poche, grand format
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDates: [], // liste de couple début/fin
                        imageUrl: '',
                        comment: '', };

export default class BarcodeScan extends Component {
    constructor(props) {
        super(props);
    }

    onBarCodeRead = (e) => {
        // retransmettre les données vers add et faire la requête
        const value = e.data;
        const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
        fetch(url+value)
            .then((response) => response.json())
            .then((json) => {
                if (json.totalItems == 0){
                    Alert.alert("Ce code ne fait pas partie de la base de données.");
                }
                else{
                    // pour avoir plus de détails
                    fetch(json.items[0].selfLink)
                        .then((response) => response.json())
                        .then((json) => {
                            // générer le book avec les infos
                            const info = json.volumeInfo;
                            let book = Object.assign({}, defaultBook);
                            book.title = info.title;
                            book.author = info.authors[0]; // TODO si plusieurs auteurs
                            book.nPages = info.pageCount;
                            book.editor = info.publisher;
                            if ('imageLinks' in info){
                                book.imageUrl = info.imageLinks.thumbnail;
                            }
                            // date publication : info.publishedDate
                            // description : info.description

                            // navigate to add
                            this.props.navigation.navigate('BookScreen', {book: book, visualMode: false, fromCamera: true});
                        });
                }
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}
                    ref={cam => this.RNCamera = cam}
                    captureAudio={false}>
                </RNCamera>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});
