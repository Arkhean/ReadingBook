import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';


export default class Book extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={styles.view}>
                <Text style={styles.TextStyle}>{this.props.book.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        borderWidth: 1,
        height: 50,
    },
    TextStyle: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25
    },
});
