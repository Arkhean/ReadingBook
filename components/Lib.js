import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Book from './book';
import StorageManager from './StorageManager';

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
        this.loadLibrary();
        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });

        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.activateRemoveMode()}>
                        <Image
                         source={require('./icons/trash.png')}
                         style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.setState({showFilter: !this.state.showFilter })}>
                        <Image
                         source={require('./icons/search.png')}
                         style={styles.ImageIconStyle}
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
        let checkBoxes = booksToShow.map(() => false);
        this.setState({books: books, booksToShow: books, checkBoxes: checkBoxes, removeMode: false});
    }

    onCheckBoxChange(i){
        let checkBoxes = this.state.checkBoxes;
        checkBoxes[i] = !checkBoxes[i];
        this.setState({checkBoxes});
    }

    activateRemoveMode(){
        this.setState({removeMode: !this.state.removeMode});
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.applyRemove()}>
                        <Image
                         source={require('./icons/trash_forever.png')}
                         style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }

    applyRemove(){
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.activateRemoveMode()}>
                        <Image
                         source={require('./icons/trash.png')}
                         style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.setState({showFilter: !this.state.showFilter })}>
                        <Image
                         source={require('./icons/search.png')}
                         style={styles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
        let toRemove = []
        for(let i in this.state.checkBoxes){
            if (this.state.checkBoxes[i]){
                toRemove.push(this.state.booksToShow[i].title+this.state.booksToShow[i].author);
            }
        }
        StorageManager.removeMany(toRemove);
        this.loadLibrary();
    }

    render() {
        return (
            <View>
                {this.state.showFilter && <TextInput
                    style={styles.input}
                    value={this.state.filter}
                    onChangeText={text => this.setState({filter: text})}
                    />}
                <ScrollView style={styles.view}>
                    {this.state.booksToShow.map((book,i) => <View key={i} style={styles.view}>
                        {this.state.removeMode &&
                        <CheckBox
                            disabled={false}
                            value={this.state.checkBoxes[i]}
                            onValueChange={() => this.onCheckBoxChange(i)}
                         />}
                        <Book
                            book={book}
                            onClick={() => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}/>
                    </View>)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        borderWidth: 1
    },
    title: {
        marginHorizontal: 40,
        marginBottom: 60,
        fontSize: 30
    },
    subTitle: {
        marginHorizontal: 40,
        fontSize: 15
    },
    ButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
    TextStyle: {
        color: '#fff',
        marginBottom: 4,
        marginRight: 20,
        fontSize: 25
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
});
