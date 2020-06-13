import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';


export default class Book extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <TouchableOpacity
                style={styles.input}
                activeOpacity={0.5}
                onPress={this.props.onClick}>
                <Text style={styles.title}>{this.props.book.title}</Text>
                <Text style={styles.author}>{this.props.book.author}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        borderWidth: 1,
    },
    input: {
        borderWidth: 1,
        justifyContent: 'center',
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
        textAlign: 'right'
    },
});
