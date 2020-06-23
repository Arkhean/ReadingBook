/*
 * author: Julien Miens
 * date: june 2020
 * description: onglet des paramètres : couleurs et crédits
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import StorageManager from './StorageManager';
import Book from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';


export default class Params extends Component {
    constructor(props){
        super(props);
        this.state = { };
        this.props.navigation.setOptions({
            title: 'Paramètres',
        });
    }

    // TODO : choisir couleurs lu/non-lu (thèmes ?)
    // TODO : show nom et version
    // TODO : crédits...
    // TODO : déplacer vider bibliothèque
    // plus besoin de menu : icone param (roue)

    render() {
        return (
            <View>
            </View>
        );
    }
}
