import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';

// TODO : afficher les champs nouveaux

export default class VisualBook extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const book = this.props.book;
        const date1 = new Date(book.purchaseDate);
        const date2 = new Date(book.readingDate);
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{"de "+book.author}</Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{"Genre: "}
                    <Text style={styles.innerText}>{book.genre}</Text>
                </Text>
                <Text style={styles.text}>{"Publié par: "}
                    <Text style={styles.innerText}>{book.editor}</Text>
                </Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{"Acheté le "+date1.toLocaleDateString('fr-FR')+" pour "+book.price+" €."}</Text>
                <Text style={styles.text}>{"Le livre contient "+book.nPages+" pages."}</Text>
                <Text style={styles.text}>{"Lecture terminée le "+date2.toLocaleDateString('fr-FR')+"."}</Text>
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
        fontSize: 20,
    },
    innerText: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25
    },
    author: {
        fontSize: 20,
        marginBottom: 4,
        marginRight: 20,
        fontSize: 15,
        fontStyle: 'italic',
        textAlign: 'right'
    },
});
