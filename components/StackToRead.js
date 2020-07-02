/*
 * author: Julien Miens
 * date: june 2020
 * description: pile à lire: ensemble des livres non lus
 */

import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import BookRow, { getKey } from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';
import { connect } from "react-redux";

class StackToRead extends Component {
    constructor(props){
        super(props);
        this.state = { booksToShow: [] };

        this.props.navigation.setOptions({
            title: 'Pile à lire',
        });
    }

    componentDidMount = () => {
        let booksToShow = this.selectBooksToShow();
        this.setState({booksToShow: booksToShow});
        // rafraichir si la liste à été modifié entre temps
        this.props.navigation.addListener('focus', () => {
            let booksToShow = this.selectBooksToShow();
            this.setState({booksToShow: booksToShow});
        });
    }

    selectBooksToShow = () => {
        let books = this.props.books;
        let booksToShow = [];
        for(let book of books){
            if (book.readingDates.length == 0){
                booksToShow.push(book);
            }
        }
        return booksToShow;
    }

    handleItemClick = (index) => {
        this.props.navigation.navigate('BookScreen',
                    { book: this.state.booksToShow[index], visualMode: true });
    }

    renderItem = ({item, index}) => {
        return (
            <BookRow
                style={GlobalStyles.bookStyle}
                index={index}
                book={item}
                onClick={this.handleItemClick}
                onLongClick={this.handleItemClick}/>
        );
    }

    render() {
        return (
            <FlatList
                windowSize={10}
                data={this.state.booksToShow}
                renderItem={this.renderItem}
                keyExtractor={getKey} />
        );
    }
}

const mapStateToProps = state => ({
	books: state.books,
    colors: state.colors
});

export default connect(mapStateToProps)(StackToRead);
