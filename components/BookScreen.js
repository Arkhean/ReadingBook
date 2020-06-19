import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, BackHandler, Image, Alert } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import StorageManager from './StorageManager';
import VisualBook from './VisualBook';
import Add from './Add';
import GlobalStyles from './styles';

// TODO : bug sauvegarder

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
                        comment: '', };

/* pour assurer la retro-compatibilité, du fait de l'ajout de champs à Book */
const getBook = (book) => {
    return {
        title: book.title,
        author: book.author,
        saga: 'saga' in book ? book.saga : '',
        nTome: 'nTome' in book ? book.nTome : 1,
        genre: book.genre,
        editor: book.editor,
        format: 'format' in book ? book.format : '',
        price: book.price,
        nPages: book.nPages,
        purchaseDate: book.purchaseDate,
        readingDates: 'readingDates' in book ? book.readingDates : [],
        comment: book.comment,

    };
}

/* requiert 2 params : book et visualMode : true/false */
export default class BookScreen extends Component {
    constructor(props){
        super(props);
        this.state = {  book: Object.assign({}, defaultBook), // copy de defaultBook
                        visualMode: true,
                        modificationMode: false };
        this.listOfKeys = [];
        this.modified = false;

        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.myGoBack);
            this.loadKeys();
            if (this.props.route.params.book != null){
                this.setState({book: getBook(this.props.route.params.book),
                                visualMode: this.props.route.params.visualMode,
                                modificationMode: false});
                this.props.navigation.setOptions({
                    title: 'Détails du livre',
                    headerLeft: () =>
                        <HeaderBackButton
                            onPress={this.myGoBack}
                            tintColor={'white'}/>
                });
            }
            else{
                this.setState({book: Object.assign({}, defaultBook), // copy de defaultBook
                                visualMode: this.props.route.params.visualMode,
                                modificationMode: false});
                this.props.navigation.setOptions({
                    title: 'Ajouter un livre',
                    headerLeft: () =>
                        <HeaderBackButton
                            onPress={this.myGoBack}
                            tintColor={'white'} />
                });
            }
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
            StorageManager.store(newK, book).then(() => {
                this.setState({visualMode: true, modificationMode: false});
            });
            this.props.navigation.setOptions({ title: 'Détails du livre' });
        }
        else{
            Alert.alert('Il faut au minimum renseigner le titre et l\'auteur !');
        }
    }

    alertCancel = () => {
        // TODO annuler les modifs
        this.setState({visualMode: true, modificationMode: false});
    }

    myGoBack = async () => {
        if (this.state.modificationMode){
            console.log('modif');
            if (this.modified){
                await Alert.alert('Attention !', 'Quitter sans sauvegarder ?' ,[{text: 'sauvegarder', onPress: this.save},
                                                            {text: 'annuler', onPress: this.alertCancel}]);
            }
            else{
                this.setState({visualMode: true, modificationMode: false});
            }
            return true;
        }
        BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
        this.props.navigation.goBack();
    }

    enterModifyMode = () => {
        this.setState({visualMode: false, modificationMode: true});
        this.props.navigation.setOptions({title: 'Modification'});
    }

    setField = (target, value) => {
        this.modified = true;
        let book = this.state.book;
        book[target] = value;
        this.setState({book});
    }

    render() {
        if (this.state.visualMode){
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButtonText}
                        activeOpacity={0.5}
                        onPress={() => this.enterModifyMode()}>
                        <Text style={{color: GlobalStyles.colors.textColor}}>Modifier</Text>
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
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.save()} >
                        <Image
                         source={require('./icons/done.png')}
                         style={GlobalStyles.ImageIconStyle}
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
