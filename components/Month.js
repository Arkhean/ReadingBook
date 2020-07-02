/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: composant affichant la liste des livres lus et achetés ce mois-ci
 * avec possibilité de visualiser les mois précédents.
 */

import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList } from 'react-native';
import BookRow, { getKey } from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';
import { ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                        'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

class Month extends Component {
    constructor(props){
        super(props);
        let now = new Date(Date.now());
        this.state = {
            nbBought: 0,
            nbRead: 0,
            total: 0,
            booksToShow: [],
            month: now.getMonth(),
            year: now.getFullYear(),
            showPicker: false,
        };

        this.props.navigation.setOptions({
            title: 'Livres du mois',
            headerRight: () => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <HeaderButton
                        onPress={this.previousMonth}
                        icon={require('./icons/back.png')}/>
                    <HeaderButton
                        onPress={this.nextMonth}
                        icon={require('./icons/forward.png')}/>
                </View>
            ),
        });

        this.props.navigation.addListener('focus', () => {
            this.setState(this.selectBooksToShow(this.state.month, this.state.year));
        });
    }

    nextMonth = () => {
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
        this.setState(this.selectBooksToShow(month, year));
    }

    previousMonth = () => {
        let month = this.state.month;
        let year = this.state.year;
        month -= 1;
        if (month == -1){
            month = 11;
            year -= 1;
        }
        this.setState(this.selectBooksToShow(month, year));
    }

    /* cette méhode parcours la liste des livres à la recherche des livres du
    mois */
    selectBooksToShow = (month, year) => {
        let books = this.props.books;
        let booksToShow = [];
        let nbBought = 0;
        let nbRead = 0;
        let total = 0;
        for(let book of books){
            let p = new Date(book.purchaseDate);
            let read = false;
            let bought = false;
            // on compare la date d'achat
            if (p.getMonth() == month && p.getFullYear() == year){
                total += parseFloat(book.price);
                bought = true;
                nbBought += 1;
            }
            // on parcours les dates de lectures
            for(let dates of book.readingDates){
                let start = new Date(dates.start);
                let end = new Date(dates.end);
                if (start.getMonth() == month && start.getFullYear() == year){
                    read = true;
                }
                if (end.getMonth() == month && end.getFullYear() == year){
                    read = true;
                }
            }
            if (read){
                nbRead += 1;
            }
            if (read || bought){
                booksToShow.push(book);
            }
        }
        return {nbBought: nbBought, nbRead: nbRead, total: total.toFixed(2),
                            booksToShow: booksToShow, month: month, year: year};
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
            <View style={styles.view}>
                <Text style={styles.title}>
                    {months[this.state.month]+" "+this.state.year}
                </Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {this.state.nbBought+ ' livres achetés'}
                </Text>
                <Text style={styles.text}>
                    {this.state.nbRead+ ' livres lus'}
                </Text>
                <Text style={styles.text}>
                    {this.state.total+ ' € dépensés'}
                </Text>
                <Divider style={GlobalStyles.divider}/>
                <FlatList
                    windowSize={8}
                    data={this.state.booksToShow}
                    renderItem={this.renderItem}
                    keyExtractor={getKey} />
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

const mapStateToProps = state => ({
	books: state.books,
});

export default connect(mapStateToProps)(Month);
