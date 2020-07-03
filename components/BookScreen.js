/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: composant pour la manipulation d'un livre
 * il permet ou de le visualiser via le composant BookRow ou de le modifier en
 * passant par le composant Add (qui a servi à sa création à l'origine).
 */

import React, { Component } from 'react';
import { Text, View, BackHandler, Alert } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import VisualBook from './VisualBook';
import Add from './Add';
import GlobalStyles from './styles';
import { defaultBook, getKey } from './book';
import { ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";
import { addBook, removeBook, editBook } from '../storage/bookActions';
import { translate } from '../translations/translator';


/* requiert 2 params : book et visualMode : true/false */
class BookScreen extends Component {
    constructor(props){
        super(props);
        this.state = {  book: Object.assign({}, defaultBook), // copy de defaultBook
                        visualMode: true,           // pour afficher un livre
                        modificationMode: false };  // quand on modifie (!= créer)
        this.modified = false;
        this.backup = null; // en cas de modifications annulées

        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.myGoBack);
            if ('fromCamera' in this.props.route.params){
                if (this.props.route.params.fromCamera){
                    this.modified = true;
                }
            }

            /* on visualise le contenu du livre */
            if (this.props.route.params.book != null){
                // petit hack pour retirer un warning
                let book = 'fromCamera' in this.props.route.params
                                ? JSON.parse(this.props.route.params.book)
                                : this.props.route.params.book;
                this.setState({ book: book,
                                visualMode: this.props.route.params.visualMode,
                                modificationMode: false });
                this.props.navigation.setOptions({
                    title: translate('details'),
                    headerLeft: () =>
                        <HeaderBackButton
                            onPress={this.myGoBack}
                            tintColor={'white'}/>
                });
            }
            /* on va créer un nouveau livre */
            else{
                this.setState({ book: Object.assign({}, defaultBook), // copy de defaultBook
                                visualMode: this.props.route.params.visualMode,
                                modificationMode: false });
                this.props.navigation.setOptions({
                    title: translate('home1'),
                    headerLeft: () =>
                        <HeaderBackButton
                            onPress={this.myGoBack}
                            tintColor={'white'} />
                });
            }
        });
    }

    // sauvegarde ou edit un book
    save = (callback) => {
        const book = this.state.book;
        let newK = getKey(book);
        // la clé d'un livre correspond à la concaténation de son titre et de
        // son auteur (couple unique)
        if (book.title !== "" && book.author !== ""){
            if (!this.state.modificationMode){
                // on ajoute un nouveau
                // donc il faut vérifier qu'il n'existe pas déjà
                for(let b of this.props.books){
                    const k = getKey(b);
                    if (k == newK){
                        Alert.alert(translate('error'),
                            book.title+translate('bookalert1')+book.author+translate('bookalert2'));
                        return;
                    }
                }
                this.props.addBook(book);
                this.modified = false;
                callback();
            }
            else{
                // sinon on est en train de modifier un existant
                this.props.editBook(book);
                this.modified = false;
                callback();
            }
            this.props.navigation.setOptions({ title: translate('details') });
        }
        else{
            Alert.alert(translate("addalert3"));
        }
    }

    alertCancel = () => {
        // annuler les modifs avec le backup
        this.modified = false;
        this.setState({ book: this.backup,
                        visualMode: true,
                        modificationMode: false });
    }

    // pour supprimer ce livre
    delete = () => {
        Alert.alert(translate('delete'), this.state.book.title,
                [{text: translate('deleteConfirm'), onPress: () => {
                    this.props.removeBook(getKey(this.state.book));
                    this.myGoBack();
                }},
                    {text: translate('cancel'), onPress: () => {}}]
        );
    }

    // on gère le retour arrière pour revenir en mode visuel si on était en
    // modification, on vérifie au passage les modifications sont enregistrées
    myGoBack = async () => {
        if (this.state.modificationMode){
            // si on modifie un livre
            if (this.modified){
                // s'il a été modifié
                Alert.alert(translate('attention'), translate('alertsave2'),
                        [{text: translate('alertsave3'), onPress: () => this.save(() => {
                            this.setState({ visualMode: true,
                                            modificationMode: false });
                        })},
                            {text: translate('cancel'), onPress: this.alertCancel}]);
            }
            else{
                // s'il n'a pas été modifié, on revient en visual
                this.setState({ visualMode: true, modificationMode: false });
            }
        }
        else{
            // si on crée un livre
            if (this.modified){
                // on a entrée des trucs, mais pas enregistré
                Alert.alert(translate('attention'), translate('alertsave2'),
                        [{text: translate('alertsave3'), onPress: () => {
                                this.save(() => {
                                    BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
                                    this.props.navigation.goBack();
                                });
                            }},
                            {text: translate('cancel'), onPress: () => {
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
        this.setState({ visualMode: false, modificationMode: true });
        this.props.navigation.setOptions({ title: translate('modification') });
    }

    // callback appelé dans add pour modifier le state avec le book
    setField = (target, value) => {
        this.modified = true;
        let book = this.state.book;
        book[target] = value;
        this.setState({ book });
    }

    render() {
        if (this.state.visualMode){
            this.props.navigation.setOptions({
                headerRight: () => (
                    <View style={{flexDirection: 'row'}}>
                        <HeaderButton
                            icon={require('./icons/trash.png')}
                            onPress={this.delete}/>
                        <HeaderButton
                            icon={require('./icons/edit.png')}
                            onPress={this.enterModifyMode}/>
                    </View>
                ),
            });
            return (
                <VisualBook book={this.state.book} />
            );
        }
        else{
            this.props.navigation.setOptions({
                headerRight: () => (
                    <HeaderButton
                        icon={require('./icons/done.png')}
                        onPress={() => this.save(this.myGoBack)}/>
                ),
            });
            return (
                <Add book={this.state.book} onChange={this.setField}/>
            );
        }
    }
}

const mapStateToProps = state => ({
	books: state.books,
});

const mapDispatchToProps = dispatch => {
	return {
        addBook: book => dispatch(addBook(book)),
        editBook: book => dispatch(editBook(book)),
		removeBook: key => dispatch(removeBook(key))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookScreen);
