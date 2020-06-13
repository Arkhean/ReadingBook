import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';


export default class Book extends Component {
    constructor(props){
        super(props);
    }

    render(){
        /* mode pour afficher dans une liste */
        if (this.props.simpleMode){
            return (
                <TouchableOpacity
                    style={styles.input}
                    activeOpacity={0.5}
                    onPress={() => this.props.nav.navigate('Home')}>
                    <Text style={styles.simpleModeTitle}>{this.props.book.title}</Text>
                    <Text style={styles.simpleModeAuthor}>{this.props.book.author}</Text>
                </TouchableOpacity>
            );
        }
        /* mode complet */
        else{
            return (
                <View style={styles.view}>
                    <Text style={styles.title}>{this.props.book.title}</Text>
                    <Text style={styles.author}>{"de "+this.props.book.author}</Text>
                    <Text style={styles.author}>{"Genre: "+this.props.book.genre}</Text>
                    <Text style={styles.author}>{"Publié par "+this.props.book.author}</Text>
                    <Text style={styles.author}>{"Acheté le "+this.props.book.purchaseDate+" pour "+this.props.book.price+" €"}</Text>
                    <Text style={styles.author}>{"Le livre contient "+this.props.book.nPages+" et a été fini d'être lu le "+this.props.book.readingDate}</Text>
                    <Text style={styles.author}>{"Commentaires: "+this.props.book.comment}</Text>
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        borderWidth: 1,
    },
    input: {
        //height: 40,
        //borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        //paddingHorizontal: 10,
        //alignItems: 'center',
    },
    simpleModeTitle: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25
    },
    simpleModeAuthor: {
        marginBottom: 4,
        marginRight: 20,
        fontSize: 15,
        fontStyle: 'italic',
        textAlign: 'right'
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25
    },
    author: {
        marginBottom: 4,
        marginRight: 20,
        fontSize: 15,
        fontStyle: 'italic',
    },
});
