/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: éléments de base à la gestion des livres, notamment l'objet vide
 * ou encore l'affichage simplifié "en ligne d'une liste".
 */

import React, { PureComponent, Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import CheckBox from '@react-native-community/checkbox';
import GlobalStyles from './styles';
import { connect } from "react-redux";
import { translate } from '../translations/translator';

// permet d'obtenir l'image pour un libre en prenant celle par défaut ou par url
export const getImage = (book) => {
    if (book.imageUri === ''){
        return require('./icons/book.png');
    }
    return { uri: book.imageUri };
}

// on suppose que le couple title, author est unique
export const getKey = (book) => {
    return book.title + book.author;
}

export const defaultBook = {   title: '',
                        author: '',
                        saga: '',
                        nTome: 1, // si sage != ''
                        genre: translate('empty'),
                        editor: '',
                        format: translate('empty'), // poche, grand format
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDates: [], // liste de couple début/fin
                        imageUri: '',
                        comment: '', };

// on vérifie qu'un livre a été lu avec la longueur de sa liste de lectures
const isRead = (book) => {
    return book.readingDates.length > 0;
}

export const genres = ['empty', 'aventure', 'policier', 'sf', 'fantastique',
            'horreur', 'biographie', 'nouvelle', 'conte', 'fantasy', 'romance',
            'contemporain', 'classique', 'theatre', 'poesie'];

export const formats = ['empty', 'poche', 'semipoche', 'grandformat', 'manga',
            'bandedessinee' ];

////////////////////////////////////////////////////////////////////////////////
// affichage pour liste, cliquable pour plus de détails
class BookRow extends PureComponent {
    render(){
        return (
            <View
                style={{
                    flex: 1,
                    margin: 5,
                    borderRadius: 10,
                    backgroundColor: isRead(this.props.book)
                                        ? this.props.colors.readColor
                                        : this.props.colors.unreadColor,
                }}

                animation={'bounceIn'}
                delay={10}
                duration={1000}>
                <TouchableOpacity
                    style={styles.view}
                    activeOpacity={0.5}
                    onPress={() => this.props.onClick(this.props.index)}
                    onLongPress={() => this.props.onLongClick(this.props.index)}>
                    <Image source={getImage(this.props.book)}
                           style={GlobalStyles.ImageStyle}
                    />
                    <View style={styles.inner}>
                        <Text style={styles.title}>
                            {this.props.book.title}
                        </Text>
                        {this.props.book.saga != '' &&
                            <Text style={styles.subtitle}>
                                {this.props.book.saga+", tome "+this.props.book.nTome}
                            </Text>
                        }
                        <Text style={styles.author}>
                            {this.props.book.author}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

/* ajoute une checkbox lors d'un clic long (voir Lib.js) */
class BookSelector extends PureComponent {
    render() {
        return (
            <View
                style={styles.view}>
                {this.props.removeMode &&
                <CheckBox
                    style={styles.checkbox}
                    value={this.props.checkBox}
                    onValueChange={() => this.props.onCheckBoxChange(this.props.index)}/>
                }
                <BookRow
                    index={this.props.index}
                    colors={this.props.colors}
                    style={GlobalStyles.bookStyle}
                    book={this.props.book}
                    onLongClick={this.props.onLongClick}
                    onClick={this.props.onClick}/>
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
    },
    checkbox: {
        alignSelf: 'center',
        margin: 5,
    },
});

const mapStateToProps = state => ({
	colors: state.colors,
});

export default connect(mapStateToProps)(BookRow);

const ConnectedBookSelector = connect(mapStateToProps)(BookSelector);
export { ConnectedBookSelector as BookSelector };
