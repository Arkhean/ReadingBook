import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Button, Image } from 'react-native';
import Book from './book';
import { Divider } from 'react-native-elements';

export default class VisualBook extends Component {
    constructor(props){
        super(props);
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Add', {book: this.props.route.params.book})}>
                    <Text style={styles.TextStyle}>Modifier</Text>
                </TouchableOpacity>
            ),
        });
    }

    render() {
        const book = this.props.route.params.book;
        const date1 = new Date(book.purchaseDate);
        const date2 = new Date(book.readingDate);
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{"de "+book.author}</Text>
                <Divider style={styles.divider}/>
                <Text style={styles.text}>{"Genre: "}
                    <Text style={styles.innerText}>{book.genre}</Text>
                </Text>
                <Text style={styles.text}>{"Publié par: "}
                    <Text style={styles.innerText}>{book.editor}</Text>
                </Text>
                <Divider style={styles.divider}/>
                <Text style={styles.text}>{"Acheté le "+date1.toLocaleDateString('fr-FR')+" pour "+book.price+" €."}</Text>
                <Text style={styles.text}>{"Le livre contient "+book.nPages+" pages."}</Text>
                <Text style={styles.text}>{"Lecture terminée le "+date2.toLocaleDateString('fr-FR')+"."}</Text>
                <Divider style={styles.divider}/>
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
    divider: {
        backgroundColor: 'gray',
        height: 2,
        marginVertical: 15,
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
    ButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#33bbff',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
    TextStyle: {
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    ImageIconStyle: {
        padding: 10,
        marginRight: 15,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
});
