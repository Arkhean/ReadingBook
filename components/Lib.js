import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, BackHandler } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Book from './book';
import StorageManager from './StorageManager';
import GlobalStyles from './styles';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';


export default class Lib extends Component {
    constructor(props){
        super(props);
        this.state = {  books: [],
                        booksToShow: [],
                        filter: '',
                        showFilter: false,
                        removeMode: false,
                        checkBoxes: [] };
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.deactivateRemoveMode = this.deactivateRemoveMode.bind(this);
        this.loadLibrary();
        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });

        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.activateRemoveMode()}>
                        <Image
                         source={require('./icons/trash.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.setState({showFilter: !this.state.showFilter })}>
                        <Image
                         source={require('./icons/search.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }

    async loadLibrary(){
        let books = await StorageManager.loadLibrary();
        const filter = this.state.filter;
        if (filter == ''){
            booksToShow = books;
        }
        else{
            booksToShow = [];
            for(let book of books){
                if (book.title.includes(filter) ||
                    book.author.includes(filter) ||
                    book.genre.includes(filter) ||
                    book.editor.includes(filter)){
                        booksToShow.push(book);
                }
            }
        }
        this.setState({books: books, booksToShow: books, checkBoxes: booksToShow.map(() => false), removeMode: false});
    }

    onCheckBoxChange(i){
        let checkBoxes = this.state.checkBoxes;
        checkBoxes[i] = !checkBoxes[i];
        this.setState({checkBoxes});
    }

    activateRemoveMode(){
        this.setState({removeMode: true});
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.applyRemove()}>
                        <Image
                         source={require('./icons/trash_forever.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
        BackHandler.addEventListener("hardwareBackPress", this.deactivateRemoveMode);
    }

    applyRemove(){
        this.deactivateRemoveMode();
        let toRemove = []
        for(let i in this.state.checkBoxes){
            if (this.state.checkBoxes[i]){
                toRemove.push(this.state.booksToShow[i].title+this.state.booksToShow[i].author);
            }
        }
        StorageManager.removeMany(toRemove).then(() => this.loadLibrary());
    }

    deactivateRemoveMode(){
        this.setState({checkBoxes: booksToShow.map(() => false), removeMode: false});
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.activateRemoveMode()}>
                        <Image
                         source={require('./icons/trash.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.setState({showFilter: !this.state.showFilter })}>
                        <Image
                         source={require('./icons/search.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        return true;
    }

    chooseAnimation() {
        const animations = ['bounceIn', 'bounceInDown', 'bounceInUp', 'bounceInLeft', 'bounceInRight'];
        let index = Math.floor(Math.random() * animations.length);
        return animations[index];
    }

    render() {
        const translation = {
            from: { marginLeft: -20 },
            to: { marginLeft: 0 },
        };
        const noAnimation = {
            from:{}, to:{}
        }
        return (
            <View >
                {this.state.showFilter && <TextInput
                    style={GlobalStyles.input}
                    value={this.state.filter}
                    onChangeText={text => this.setState({filter: text})}
                    />}
                <ScrollView>
                    {this.state.booksToShow.map((book,i) =>
                        <View
                            key={i}
                            style={styles.view}>
                            {this.state.removeMode &&
                            <CheckBox
                                style={styles.checkbox}
                                value={this.state.checkBoxes[i]}
                                onValueChange={() => this.onCheckBoxChange(i)}
                             />}
                            <Book
                                style={GlobalStyles.bookStyle}
                                animation={this.state.removeMode ? translation : this.chooseAnimation()}
                                book={book}
                                onClick={this.state.removeMode ? () => this.onCheckBoxChange(i) : () => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}/>
                        </View>)}
                </ScrollView>
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
