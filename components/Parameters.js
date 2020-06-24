/*
 * author: Julien Miens
 * date: june 2020
 * description: onglet des paramètres : couleurs et crédits
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import StorageManager from './StorageManager';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';
import { TextButton } from './Buttons';


export default class Params extends Component {
    constructor(props){
        super(props);
        this.state = { };
        this.props.navigation.setOptions({
            title: 'Paramètres',
        });
    }

    reset = async () => {
        Alert.alert('Attention',
                    'Etes-vous sûr de vouloir supprimer tous vos livres ?',
                    [{text: 'Supprimer', onPress: () => StorageManager.prune()},
                    {text: 'Annuler', onPress: () => {}}]
        );
    }

    // TODO : choisir couleurs lu/non-lu (thèmes ?)

    render() {
        return (
            <View>
                <Text style={styles.title}>{'Application de Carnet de Lecture permettant d\'enregistrer sa collection personnelle de livres.'}</Text>
                <Text style={styles.text}>{'Version 1.0.0'}</Text>
                <Text style={styles.subtext}>{'Développée par Julien Miens, Juin 2020'}</Text>
                <Divider style={GlobalStyles.divider}/>
                <TextButton
                    onPress={this.reset}
                    text={'Réinitialiser l\'application'}/>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{'Crédits:'}</Text>
                <Text style={styles.subtext}>{'Icones de material.io'}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 50
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 15,
        textAlign: 'center',
    },
});
