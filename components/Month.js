import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity } from 'react-native';
import StorageManager from './StorageManager';
import Book from './book';
import { Divider } from 'react-native-elements';

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default class Month extends Component {
    constructor(props){
        super(props);
        this.state = { books: [],
                        month: 5,
                        year: 2020,
                        nbBought: 0,
                        nbRead: 0,
                        total: 0,
                        booksToShow: [] };
        this.loadLibrary();
        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });

        this.props.navigation.setOptions({
            title: months[this.state.month]+" "+this.state.year
        });
    }

    async loadLibrary(){
        let books = await StorageManager.loadLibrary();
        let booksToShow = [];
        let nbBought = 0;
        let nbRead = 0;
        let total = 0;
        for(let book of books){
            let p = new Date(book.purchaseDate);
            let r = new Date(book.purchaseDate);
            let done = false; // pour éviter d'ajouter deux fois un même livre
            if (p.getMonth() == this.state.month && p.getFullYear() == this.state.year){
                nbBought += 1;
                total += book.price;
                booksToShow.push(book);
                done = true;
            }
            if (r.getMonth() == this.state.month && r.getFullYear() == this.state.year){
                nbRead += 1;
                if (!done){
                    booksToShow.push(book);
                }
            }
        }
        this.setState({books: books, nbBought: nbBought, nbRead: nbRead,
                                    total: total, booksToShow: booksToShow});
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.title}> {this.state.nbBought+ ' livres achetés'} </Text>
                <Text style={styles.title}> {this.state.nbRead+ ' livres lus'} </Text>
                <Text style={styles.title}> {this.state.total+ ' € dépensés'} </Text>
                <Divider style={{ backgroundColor: 'blue' }}/>
                {this.state.booksToShow.map((book, i) => <Book key={i} book={book}/>)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        //alignItems: "center",
        flex: 1,
        //justifyContent: "center",
        marginTop: 20
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25,
        //fontWeight: 'bold',
    },
});
