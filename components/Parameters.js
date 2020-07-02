/*
 * author: Julien Miens
 * date: june 2020
 * description: onglet des paramètres : couleurs et crédits
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { Divider } from 'react-native-elements';
import ColorPicker from './ColorPicker';
import GlobalStyles from './styles';
import { ConnectedTextButton as TextButton } from './Buttons';
import { connect } from "react-redux";
import {
    setMainColor,
    setSecondaryColor,
    setReadColor,
    setUnreadColor
} from '../storage/colorActions';
import { removeAll } from '../storage/bookActions';

class Params extends Component {
    constructor(props){
        super(props);
        this.props.navigation.setOptions({
            title: 'Paramètres',
        });
    }

    reset = async () => {
        Alert.alert('Attention',
                    'Etes-vous sûr de vouloir supprimer tous vos livres ?',
                    [{text: 'Supprimer', onPress: this.props.removeAll},
                    {text: 'Annuler', onPress: () => {}}]
        );
    }

    render() {
        return (
            <ScrollView>
                <Text style={styles.title}>
                    {'Application de Carnet de Lecture permettant d\'enregistrer sa collection personnelle de livres.'}
                </Text>

                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {'Couleur principale'}
                </Text>
                <ColorPicker
                    color={this.props.colors.mainColor}
                    onChange={this.props.setMainColor} />
                <Text style={styles.text}>
                    {'Couleur secondaire'}
                </Text>
                <ColorPicker
                    color={this.props.colors.secondaryColor}
                    onChange={this.props.setSecondaryColor} />
                <Text style={styles.text}>
                    {'Couleur des livres lus'}
                </Text>
                <ColorPicker
                    color={this.props.colors.readColor}
                    onChange={this.props.setReadColor} />
                <Text style={styles.text}>
                    {'Couleur des livres non-lus'}
                </Text>
                <ColorPicker
                    color={this.props.colors.unreadColor}
                    onChange={this.props.setUnreadColor} />

                <Divider style={GlobalStyles.divider}/>
                <TextButton
                    onPress={this.reset}
                    text={'Réinitialiser l\'application'}/>

                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {'Version 1.0.1'}
                </Text>
                <Text style={styles.subtext}>
                    {'Développée par Julien Miens, Juin-Juillet 2020'}
                </Text>
                <View style={{marginVertical: 30}}>
                    <Text style={styles.text}>
                        {'Crédits:'}
                    </Text>
                    <Text style={styles.subtext}>
                        {'Icones de material.io'}
                    </Text>
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 30
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

/* pour donner accès au store redux pour ce composant */
const mapStateToProps = state => ({
	colors: state.colors,
});

const mapDispatchToProps = dispatch => {
	return {
		setMainColor: color => dispatch(setMainColor(color)),
        setSecondaryColor: color => dispatch(setSecondaryColor(color)),
        setReadColor: color => dispatch(setReadColor(color)),
        setUnreadColor: color => dispatch(setUnreadColor(color)),
		removeAll: () => dispatch(removeAll()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Params);
