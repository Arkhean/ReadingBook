/*
 * author: Julien Miens
 * date: june 2020
 * description: pile à lire: ensemble des livres non lus
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';
import { connect } from "react-redux";

class StackToRead extends Component {
    constructor(props){
        super(props);
        this.state = { booksToShow: [] };

        this.props.navigation.addListener('focus', () => {
            this.setState({booksToShow: this.selectBooksToShow()});
        });

        this.props.navigation.setOptions({
            title: 'Pile à lire',
        });
    }

    selectBooksToShow(){
        let books = this.props.books;
        let booksToShow = [];
        for(let book of books){
            if (book.readingDates.length == 0){
                booksToShow.push(book);
            }
        }
        return booksToShow;
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

const mapStateToProps = state => ({
	books: state.books,
});

export default connect(mapStateToProps)(StackToRead);
