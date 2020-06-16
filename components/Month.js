import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import StorageManager from './StorageManager';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default class Month extends Component {
    constructor(props){
        super(props);
        let now = new Date(Date.now());
        this.state = { books: [],
                        month: now.getMonth(),
                        year: now.getFullYear(),
                        nbBought: 0,
                        nbRead: 0,
                        total: 0,
                        booksToShow: [],
                        showPicker: false };
        this.loadLibrary();
        this.props.navigation.addListener('focus', () => {
            this.loadLibrary();
        });

        this.props.navigation.setOptions({
            title: 'Livres du mois',
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.previousMonth()}>
                        <Image
                         source={require('./icons/back.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={GlobalStyles.HeaderButton}
                        activeOpacity={0.5}
                        onPress={() => this.nextMonth()}>
                        <Image
                         source={require('./icons/forward.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }

    nextMonth(){
        let month = this.state.month;
        let year = this.state.year;
        let now = new Date(Date.now());
        if (year == now.getFullYear() && month == now.getMonth()){
            return;
        }
        month += 1;
        if (month == 12){
            month = 0;
            year += 1;
        }
        this.setState({month: month, year: year}, () => this.selectBooksToShow());
    }

    previousMonth(){
        let month = this.state.month;
        let year = this.state.year;
        month -= 1;
        if (month == -1){
            month = 11;
            year -= 1;
        }
        this.setState({month: month, year: year}, () => this.selectBooksToShow());
    }

    selectBooksToShow(){
        let books = this.state.books;
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
                total += parseInt(book.price);
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
        this.setState({nbBought: nbBought, nbRead: nbRead, total: total,
                                                booksToShow: booksToShow});
    }

    async loadLibrary(){
        let books = await StorageManager.loadLibrary();
        this.setState({books: books}, () => this.selectBooksToShow());
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{months[this.state.month]+" "+this.state.year}</Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}> {this.state.nbBought+ ' livres achetés'} </Text>
                <Text style={styles.text}> {this.state.nbRead+ ' livres lus'} </Text>
                <Text style={styles.text}> {this.state.total+ ' € dépensés'} </Text>
                <Divider style={GlobalStyles.divider}/>
                <ScrollView>
                    {this.state.booksToShow.length != 0
                        && this.state.booksToShow.map((book, i) =>
                            <Book
                                style={GlobalStyles.bookStyle}
                                animation={'bounceIn'}
                                key={i}
                                book={book}
                                onClick={() => this.props.navigation.navigate('BookScreen', {book: book, visualMode: true})}/>)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 20
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: "center"
    },
    text: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25,
    },
});
