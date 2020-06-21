/*
 * author: Julien Miens
 * date: june 2020
 * description: éléments de base à la gestion des livres, notamment l'objet vide
 * ou encore l'affichage simplifié "en ligne d'une liste".
 */

import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import GlobalStyles from './styles';

// permet d'obtenir l'image pour un libre en prenant celle par défaut ou par url
export const getImage = (book) => {
    if (!('imageUrl' in book) || book.imageUrl === ''){
        return require('./icons/book.png');
    }
    else{
        return {uri: book.imageUrl};
    }
}

export const defaultBook = {   title: '',
                        author: '',
                        saga: '',
                        nTome: 1, // si sage != ''
                        genre: '<non rensigné>',
                        editor: '',
                        format: '<non rensigné>', // poche, grand format
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDates: [], // liste de couple début/fin
                        imageUrl: '',
                        comment: '', };

// affichage pour liste, cliquable pour plus de détails
export default class BookRow extends Component {
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
                    style={styles.view}
                    activeOpacity={0.5}
                    onPress={this.props.onClick}>
                    <Image source={getImage(this.props.book)}
                           style={GlobalStyles.ImageStyle}
                    />
                    <View style={styles.inner}>
                        <Text style={styles.title}>{this.props.book.title}</Text>
                        {this.props.book.saga != '' &&
                            <Text style={styles.subtitle}>
                                {this.props.book.saga+", tome "+this.props.book.nTome}
                            </Text>
                        }
                        <Text style={styles.author}>{this.props.book.author}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: GlobalStyles.colors.textColor
    },
    view: {
        flexDirection: 'row',
    },
    subtitle: {
        fontSize: 18,
        color: GlobalStyles.colors.textColor
    },
    author: {
        marginBottom: 4,
        marginRight: 20,
        fontSize: 15,
        fontStyle: 'italic',
        textAlign: 'right',
        color: GlobalStyles.colors.textColor
    },
    inner: {
        flex: 1
    }
});
