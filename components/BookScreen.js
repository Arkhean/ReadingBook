import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StorageManager from './StorageManager';
import VisualBook from './VisualBook';
import Add from './Add';

const defaultBook = {   title: '',
                        author: '',
                        genre: 'unknown',
                        editor: 'unknown',
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDate: new Date(Date.now()),
                        comment: '', };

/* requiert 2 params : book et visualMode : true/false */
export default class BookScreen extends Component {
    constructor(props){
        super(props);
        if (this.props.route.params.book != null){
            this.state = {book: this.props.route.params.book,
                            visualMode: this.props.route.params.visualMode,
                            modificationMode: false};
            this.props.navigation.setOptions({title: 'Détails du livre'});
        }
        else{
            this.state = {book: defaultBook,
                            visualMode: this.props.route.params.visualMode,
                            modificationMode: false};
            this.props.navigation.setOptions({title: 'Ajouter un livre'});
        }
        this.setField = this.setField.bind(this);
        this.listOfKeys = [];
        this.loadKeys();

        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.save()} >
                    <Image
                     source={require('./icons/done.png')}
                     style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
            ),
        });
    }

    async loadKeys(){
        this.listOfKeys = await StorageManager.loadKeys();
    }

    save(){
        const book = this.state.book;
        let newK = book.title+book.author;
        if (book.title !== "" && book.author !== ""){
            if (!this.state.modificationMode){
                // on ajoute un nouveau
                // donc il faut vérifier qu'il n'existe pas déjà
                for(let k of this.listOfKeys){
                    if (k == newK){
                        Alert.alert('Erreur : '+book.title+' de '+book.author+' est déjà dans la bibliothèque !');
                        return;
                    }
                }
            }
            StorageManager.store(newK, book).then(() => this.setState({visualMode: true, modificationMode: false}));
            this.props.navigation.setOptions({title: 'Détails du livre'});
        }
        else{
            Alert.alert('Il faut au minimum renseigner le titre et l\'auteur !');
        }
    }

    enterModifyMode(){
        this.setState({visualMode: false, modificationMode: true});
        this.props.navigation.setOptions({title: 'Modification'});
    }

    setField(target, value){
        let book = this.state.book;
        book[target] = value;
        this.setState({book});
    }

    render() {
        if (this.state.visualMode){
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.enterModifyMode()}>
                        <Text style={styles.TextStyle}>Modifier</Text>
                    </TouchableOpacity>
                ),
            });
            return (
                <VisualBook book={this.state.book} />
            );
        }
        else{
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        //style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.save()} >
                        <Image
                         source={require('./icons/done.png')}
                         style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                ),
            });
            return (
                <Add book={this.state.book} onChange={this.setField}/>
            );
        }
    }
}

const styles = StyleSheet.create({
    ButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#33bbff',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
    TextStyle: {
        color: '#fff',
    },
    ImageIconStyle: {
        padding: 10,
        marginRight: 15,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
});
