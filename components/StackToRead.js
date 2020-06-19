import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import StorageManager from './StorageManager';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';


export default class StackToRead extends Component {
    constructor(props){
        super(props);
        let now = new Date(Date.now());
        this.state = { books: [],
                       booksToShow: [] };

        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });

        this.props.navigation.setOptions({
            title: 'Pile à lire',
        });
    }

    selectBooksToShow(){
        let books = this.state.books;
        let booksToShow = [];
        for(let book of books){
            if (book.readingDates.length == 0){
                booksToShow.push(book);
            }
        }
        this.setState({booksToShow: booksToShow});
    }

    async loadLibrary(){
        let books = await StorageManager.loadLibrary();
        this.setState({books: books}, () => this.selectBooksToShow());
    }

    render() {
        return (
            <ScrollView>
                {this.state.booksToShow.map((book,i) =>
                    <Book
                        key={i}
                        style={GlobalStyles.bookStyle}
                        animation={'bounceIn'}
                        book={book}
                        onClick={() => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}/>)
                }
            </ScrollView>
        );
    }
}
