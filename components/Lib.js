import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Book from './book';
import StorageManager from './StorageManager';

export default class Lib extends Component {
    constructor(props){
        super(props);
        this.state = { books: [] };
        this.loadLibrary();
        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });
    }

    async loadLibrary(){
        let books = await StorageManager.loadLibrary();
        this.setState({books: books});
    }

  render() {
    return (
        <ScrollView style={styles.view}>
            {this.state.books.map((book,i) => <Book key={i}
                                                    book={book}
                                                    onClick={() => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}
                                                    nav={this.props.navigation}/>)}
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    view: {
        //margin: 20,
        //flex: 1,
        //justifyContent: 'center',
        //backgroundColor: '#ffcc99',
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
        backgroundColor: '#3399ff',
        borderWidth: 0.5,
        borderColor: '#ffcc99',
        height: 50,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
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
});
