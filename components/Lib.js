import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Book from './book';
import StorageManager from './StorageManager';

export default class Lib extends Component {
    constructor(props){
        super(props);
        this.state = { books: [],
                        filter: '',
                        showFilter: false};
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
                        onPress={() => console.log('todo')}>
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
        this.setState({books: books, booksToShow: books});
    }

    render() {
        const books = this.state.books;
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
        return (
            <View>
                {this.state.showFilter && <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({filter: text})}
                    />}
                <ScrollView style={styles.view}>
                    {booksToShow.map((book,i) => <Book key={i}
                                        book={book}
                                        onClick={() => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}/>)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
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
