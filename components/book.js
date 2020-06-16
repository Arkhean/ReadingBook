import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

// TODO : ajouter un indicateur si le livre est lu ou non
// TODO : afficher saga ?


export default class Book extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View
                style={this.props.style}
                animation={this.props.animation}
                delay={100}
                duration={1500}>
                <TouchableOpacity
                    //style={this.props.style}
                    activeOpacity={0.5}
                    onPress={this.props.onClick}>
                    <Text style={styles.title}>{this.props.book.title}</Text>
                    <Text style={styles.author}>{this.props.book.author}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
