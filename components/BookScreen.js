import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, BackHandler, Image, Alert } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import StorageManager from './StorageManager';
import VisualBook from './VisualBook';
import Add from './Add';
import GlobalStyles from './styles';

const defaultBook = {   title: '',
                        author: '',
                        saga: '',
                        nTome: 1, // si sage != ''
                        genre: '<non rensigné>',
                        editor: '',
                        format: '<non rensigné>', // poche, grand format
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDates: [], // liste de couple début/fin
                        imageUrl: '',
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
        imageUrl: 'imageUrl' in book ? book.imageUrl : '',
        comment: book.comment,
    };
}

/* requiert 2 params : book et visualMode : true/false */
export default class BookScreen extends Component {
    constructor(props){
        super(props);
        this.state = {  book: Object.assign({}, defaultBook), // copy de defaultBook
                        visualMode: true,           // pour afficher un livre
                        modificationMode: false };  // quand on modifie (!= créer)
        this.listOfKeys = [];
        this.modified = false;
        this.backup = null; // en cas de modifications annulées

        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.myGoBack);
            this.loadKeys();
            if ('fromCamera' in this.props.route.params){
                if (this.props.route.params.fromCamera){
                    this.modified = true;
                }
            }

            /* on visualise le contenu du livre */
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
            /* on va créer un nouveau livre */
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

    save = (callback) => {
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
                this.modified = false;
                if (callback != undefined){
                    callback();
                }
            });
            this.props.navigation.setOptions({ title: 'Détails du livre' });
        }
        else{
            Alert.alert('Il faut au minimum renseigner le titre et l\'auteur !');
        }
    }

    alertCancel = () => {
        // annuler les modifs avec le backup
        this.modified = false;
        this.setState({book: this.backup, visualMode: true, modificationMode: false});
    }

    myGoBack = async () => {
        if (this.state.modificationMode){
            // si on modifie un livre
            if (this.modified){
                // s'il a été modifié
                Alert.alert('Attention !', 'Quitter sans sauvegarder ?' ,
                        [{text: 'sauvegarder', onPress: () => this.save(() => {
                            this.setState({visualMode: true, modificationMode: false});
                        })},
                            {text: 'annuler', onPress: this.alertCancel}]);
            }
            else{
                // s'il n'a pas été modifié, on revient en visual
                this.setState({visualMode: true, modificationMode: false});
            }
        }
        else{
            // si on crée un livre
            if (this.modified){
                // on a entrée des trucs, mais pas enregistré
                Alert.alert('Attention !', 'Quitter sans sauvegarder ?' ,
                        [{text: 'sauvegarder', onPress: () => {
                                this.save(() => {
                                    BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
                                    this.props.navigation.goBack();
                                });
                            }},
                            {text: 'annuler', onPress: () => {
                                BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
                                this.props.navigation.goBack();
                            }}]);
            }
            else{
                // si on a rien touché, on peut quitter
                BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
                this.props.navigation.goBack();
            }
        }
    }

    enterModifyMode = () => {
        this.backup = Object.assign({}, this.state.book); // en cas d'annulation
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
                        onPress={() => this.save(this.myGoBack)} >
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
