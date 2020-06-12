import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';


export default class Book extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{this.props.book.title}</Text>
                <Text style={styles.author}>{this.props.book.author}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        borderWidth: 1,
        height: 60,
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
