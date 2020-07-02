/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: composant affichant la liste entière de tous les livres contenus
 * dans la bibliothèque, il propose la suppression et redirige vers un affichage
 * détaillé au besoin (pour consultation ou modification).
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, TextInput, BackHandler, FlatList } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { HeaderBackButton } from '@react-navigation/stack';
import BookRow, { getKey, defaultBook, BookSelector } from './book';
import GlobalStyles from './styles';
import { createAnimatableComponent, View } from 'react-native-animatable';
import { ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";
import { removeBooks, addBook } from '../storage/bookActions';

const noAnimation = { from:{}, to:{} };
/*const rTranslation = { from: { marginLeft: -30 },
                      to: { marginLeft: 0 } };
const lTranslation = { from: { marginLeft: 30 },
                      to: { marginLeft: 5 } };*/
const scrollDownAnimation = { from: { marginTop: -30 },
                              to: { marginTop: 0 }
};
const scrollUpAnimation = { from: { marginTop: 30 },
                            to: { marginTop: 0 }
};

////////////////////////////////////////////////////////////////////////////////

class Lib extends Component {
    constructor(props){
        super(props);
        this.state = {  booksToShow: [],
                        filter: '',
                        showFilter: false,
                        removeMode: false,
                        checkBoxes: [] };
        // on retient la valeur de ces bouléens pour gérer les animations
        this.showFilterWasTrue = false;
        this.removeModeWasTrue = false;

        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.activateRemoveMode}
                        icon={require('./icons/trash.png')}/>
                    <HeaderButton
                        onPress={this.activateShowFilter}
                        icon={require('./icons/search.png')}/>
                </View>
            ),
            headerLeft: () =>
                <HeaderBackButton
                    onPress={this.myGoBack}
                    tintColor={'white'}/>
        });

        this.props.navigation.addListener('focus', () => {
            console.log('focus');
            this.applyFilter(); // force render ...
        });
    }

    /* réduit la liste à afficher aux éléments correspondant au filtre entré */
    applyFilter = () => {
        const filter = this.state.filter;
        let booksToShow = []
        if (filter == ''){
            booksToShow = this.props.books;
        }
        else{
            booksToShow = [];
            for(let book of this.props.books){
                // on vérifie la présence du filtre dans ces termes:
                if ( book.title.includes(filter) ||
                     book.author.includes(filter) ||
                     book.saga.includes(filter) ||
                     (book.genre != '<non renseigné>' && book.genre.includes(filter)) ||
                     (book.editor.includes(filter)) ){
                        booksToShow.push(book);
                }
            }
        }
        console.log('up');
        this.setState({booksToShow: booksToShow, checkBoxes: booksToShow.map(() => false)});
    }

    // les checkbox servent à savoir qui est à supprimer
    onCheckBoxChange = (i) => {
        if (this.state.removeMode){
            let checkBoxes = this.state.checkBoxes;
            checkBoxes[i] = !checkBoxes[i];
            this.setState({checkBoxes});
        }
    }

    // on gère soit même le retour arrière dans les cas où l'onglet de recherche
    // ou que la sélection soient ouverts
    myGoBack = () => {
        if (this.state.removeMode){
            this.deactivateRemoveMode();
            this.setState({ removeMode: false,
                            checkBoxes: this.state.booksToShow.map(() => false) });
            return true;
        }
        else if (this.state.showFilter){
            this.deactivateShowFilter();
            this.setState({showFilter: false});
            return true;
        }
        this.props.navigation.goBack();
    }


    /* méthodes pour la gestion de la recherche dans la liste */
    activateShowFilter = () => {
        this.setState({showFilter: true});
        // on change les boutons pour gérer le goBack
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.activateRemoveMode}
                        icon={require('./icons/trash.png')}/>
                    <HeaderButton
                        onPress={this.myGoBack}
                        icon={require('./icons/search.png')}/>
                </View>
            ),
        });
        BackHandler.addEventListener("hardwareBackPress", this.myGoBack);
    }

    deactivateShowFilter = () => {
        // on rétablit les boutons
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.activateRemoveMode}
                        icon={require('./icons/trash.png')}/>
                    <HeaderButton
                        onPress={this.activateShowFilter}
                        icon={require('./icons/search.png')}/>
                </View>
            ),
        });
        this.showFilterWasTrue = true;
        BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
    }

    /* méthode pour la suppression d'élément dans la liste */
    activateRemoveMode = () => {
        this.setState({removeMode: true});
        // il faut mettre le bouton de suppression définitive
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.applyRemove}
                        icon={require('./icons/trash_forever.png')}/>
                </View>
            ),
        });
        BackHandler.addEventListener("hardwareBackPress", this.myGoBack);
    }

    applyRemove = () => {
        this.deactivateRemoveMode();
        let toRemove = []
        for(let i in this.state.checkBoxes){
            if (this.state.checkBoxes[i]){
                toRemove.push(getKey(this.state.booksToShow[i]));
            }
        }
        // il est plus efficace d'envoyer la liste des éléments à supprimer
        // plutôt qu'un par un
        if (toRemove.length > 0){
            this.props.removeBooks(toRemove);
            // actualiser la base de données locales...
            // il faudrait remettre à jour booksToShow après la fin du remove
            // mais on ne peut pas faire .then() ici...
            const newBooks = this.state.booksToShow.filter(book => !toRemove.includes(getKey(book)));
            this.setState({ booksToShow: newBooks,
                            checkBoxes: newBooks.map(() => false),
                            removeMode: false });
        }
        else{
            this.setState({ checkBoxes: this.state.booksToShow.map(() => false),
                            removeMode: false });
        }

    }

    deactivateRemoveMode = () => {
        this.removeModeWasTrue = true;
        // on rétablit les boutons
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.activateRemoveMode}
                        icon={require('./icons/trash.png')}/>
                    <HeaderButton
                        onPress={this.state.showFilter
                                        ? this.deactivateShowFilter
                                        : this.activateShowFilter}
                        icon={require('./icons/search.png')}/>
                </View>
            ),
        });
        if (!this.state.showFilter){
            BackHandler.removeEventListener("hardwareBackPress", this.myGoBack);
        }
        return true;
    }

    handleLongItemClick = (index) => {
        if (!this.state.removeMode){
            this.activateRemoveMode();
            this.onCheckBoxChange(index);
        }
    }

    handleItemClick = (index) => {
        if (this.state.removeMode){
            this.onCheckBoxChange(index);
        }
        else{
            this.props.navigation.navigate('BookScreen',
                    { book: this.state.booksToShow[index], visualMode: true });
        }
    }

    renderItem = (bookAnim, item, index) => {
        return (
            <View
                animation={bookAnim}
                delay={10}
                duration={1000}>
                <BookSelector
                    index={index}
                    removeMode={this.state.removeMode}
                    checkBox={this.state.checkBoxes[index]}
                    onCheckBoxChange={this.onCheckBoxChange}
                    book={item}
                    onLongClick={this.handleLongItemClick}
                    onClick={this.handleItemClick} />
            </View>
        );
    }

    /* render */
    render() {
        /* Etape 1 : choisir les bonnes animations */
        let scrollAnim = noAnimation;
        let bookAnim = noAnimation;
        /*if (this.state.removeMode){
            scrollAnim = noAnimation;
            //bookAnim = rTranslation
        }
        else if (this.removeModeWasTrue){
            this.removeModeWasTrue = false;
            scrollAnim = noAnimation;
            //bookAnim = lTranslation;
        }
        else*/ if (this.showFilterWasTrue){
            this.showFilterWasTrue = false;
            scrollAnim = scrollUpAnimation;
            //bookAnim = noAnimation;
        }
        else if (this.state.showFilter){
            scrollAnim = scrollDownAnimation;
            //bookAnim = noAnimation;
        }
        else{
            scrollAnim = noAnimation;
            bookAnim = 'bounceIn';
        }

        /* maintenant on peut render */
        return (
            <View
                animation={scrollAnim}
                duration={1000}>
                {this.state.showFilter &&
                    <TextInput
                        style={{
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                            paddingHorizontal: 10,
                            alignItems: 'center',
                        }}
                        value={this.state.filter}
                        onChangeText={text => this.setState({filter: text},
                                                    () => this.applyFilter())}/>
                }
                <FlatList
                    windowSize={7}
                    data={this.state.booksToShow}
                    renderItem={({item, index}) => this.renderItem(bookAnim, item, index)}
                    keyExtractor={getKey} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
    },
    checkbox: {
        alignSelf: 'center',
        margin: 5,
    },
});

const mapStateToProps = state => ({
	books: state.books,
});

const mapDispatchToProps = dispatch => {
	return {
        addBook: book => dispatch(addBook(book)),
        removeBooks: keys => dispatch(removeBooks(keys)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Lib);
