/*
 * author: Julien Miens
 * date: juin 2020
 * description: utilise l'appareil photo pour lire un code bar sur le dos d'un
 * livre, celui-ci correspondant souvent à l'ISBN de celui-ci
 * ensuite, une requête est envoyé à l'API google books pour obtenir des infos
 * sur le livre et remplir automatiquement la page d'ajout.
 * NB : google ne connait pas beacoup de livres...
 */

import React, { Component } from 'react';
import { View, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import GlobalStyles from './styles';
import { defaultBook } from './book';
import { ConnectedHeaderButton as HeaderButton } from './Buttons';
import { StackActions } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { translate } from '../translations/translator';

export default class BarcodeScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            torchOn: false,
            loading: false
        }
        this.stopPreview = false;

        this.props.navigation.setOptions({
            headerRight: () => (
                <HeaderButton
                    onPress={this.handleTourch}
                    icon={this.state.torchOn
                                ? require('./icons/flash_on.png')
                                : require('./icons/flash_off.png')}/>
            ),
        });

        this.props.navigation.addListener('focus', this.detectInternet);

    }

    // on a besoin d'une connexion internet pour faire les requêtes
    // on alert tant qu'il n'y en a pas
    detectInternet = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected){
                Alert.alert('Attention',
                    'Une connexion internet est requise pour utiliser cette option',
                    [ {text: 'retour', onPress: this.props.navigation.goBack},
                      {text: "c'est fait", onPress: this.detectInternet} ]);
            }
        });
    }


    onBarCodeRead = (e) => {
        if(!this.stopPreview) {
            // on bloque la caméra, sinon onBarCodeRead est rappelée plusieurs fois
            this.stopPreview = true;
            this.setState({loading: true});
            // faire la requête et retransmettre les données vers add
            const value = e.data;
            const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
            fetch(url+value)
                .then((response) => {
                    if (response.ok){
                        response.json().then((json) => {
                            if (json.totalItems == 0){
                                Alert.alert("Ce code ne fait pas partie de la base de données.", '',
                                    [{text: 'dommage', onPress: () => this.stopPreview = false}]);
                            }
                            else{
                                // pour avoir plus de détails
                                fetch(json.items[0].selfLink)
                                    .then((response) => {
                                        if (response.ok){
                                            response.json().then((json) => {
                                                // générer le book avec les infos
                                                const info = json.volumeInfo;
                                                let book = Object.assign({}, defaultBook);
                                                book.title = info.title;
                                                book.author = info.authors[0]; // TODO si plusieurs auteurs
                                                book.nPages = info.pageCount;
                                                book.editor = info.publisher;
                                                if ('imageLinks' in info){
                                                    book.imageUri = info.imageLinks.thumbnail;
                                                }
                                                // date publication : info.publishedDate
                                                // description : info.description

                                                // navigate to add
                                                this.stopPreview = false;
                                                this.props.navigation.dispatch(
                                                    StackActions.replace('BookScreen', {
                                                        // petit hack pour retirer un warning
                                                        book: JSON.stringify(book),
                                                        visualMode: false,
                                                        fromCamera: true
                                                    })
                                                );
                                            });
                                        }
                                        else{
                                            this.notFound();
                                        }
                                    });
                            }
                        });
                    }
                    else{
                        this.notFound();
                    }
                })
                .catch((e) => this.notFound());
        }
    }

    notFound = () => {
        Alert.alert('Erreur de connexion internet.', '',
            [{text: 'ok', onPress: () => this.stopPreview = false}]);
    }

    /* allumer la lampe peut aider à la prise de vue */
    handleTourch = () => {
        this.setState({ torchOn: !this.state.torchOn }, () => {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <HeaderButton
                        onPress={this.handleTourch}
                        icon={this.state.torchOn
                                ? require('./icons/flash_on.png')
                                : require('./icons/flash_off.png')}/>
                ),
            });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    flashMode={this.state.torchOn
                                    ? RNCamera.Constants.FlashMode.torch
                                    : RNCamera.Constants.FlashMode.off}
                    onBarCodeRead={!this.state.loading ? this.onBarCodeRead : () => {}}
                    ref={cam => this.RNCamera = cam}
                    captureAudio={false}>
                    <ActivityIndicator
                        size={100}
                        color={GlobalStyles.colors.buttonColor}
                        animating={this.state.loading}
                        style={{flex: 1, alignSelf: 'center'}}/>
                </RNCamera>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});
