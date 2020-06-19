import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';

function pad(n) {return n < 10 ? "0"+n : n;}

function displayDate(date){
    return pad(date.getDate())+"/"+pad(date.getMonth()+1)+"/"+date.getFullYear();
}

export default class VisualBook extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const book = this.props.book;
        const date1 = new Date(book.purchaseDate);
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{book.title}</Text>
                {book.saga != '' && <Text style={styles.subtitle}>{book.saga+", tome "+book.nTome}</Text>}
                <Text style={styles.author}>{"de "+book.author}</Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{"Genre: "}
                    <Text style={styles.innerText}>{book.genre}</Text>
                </Text>
                <Text style={styles.text}>{"Publié par: "}
                    <Text style={styles.innerText}>{book.editor}</Text>
                </Text>
                <Text style={styles.text}>{"Format: "}
                    <Text style={styles.innerText}>{book.format}</Text>
                </Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{"Acheté le "+displayDate(date1)+" pour "+book.price+" €."}</Text>
                <Text style={styles.text}>{"Le livre contient "+book.nPages+" pages."}</Text>
                {book.readingDates.length == 0 && <Text style={styles.text}>{"Le livre n'a pas été lu"}</Text>}
                {book.readingDates.map((item, i) =>
                    <Text key={i} style={styles.innerText}>
                        {'Lu du '+displayDate(new Date(item.start))+' au '+displayDate(new Date(item.end))}
                    </Text>)
                }
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{"Commentaires: "}
                    <Text style={styles.innerText}>{book.comment}</Text>
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 10,
    },
    text: {
        fontSize: 18,
    },
    innerText: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25,
        fontWeight: 'bold'
    },
    subtitle: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 20
    },
    author: {
        fontSize: 20,
        marginBottom: 4,
        marginRight: 20,
        fontStyle: 'italic',
        textAlign: 'right'
    },
});
