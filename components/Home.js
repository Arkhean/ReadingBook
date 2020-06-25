/*
 * author: Julien Miens
 * date: june 2020
 * description: composant d'accueil affichant le nombre de livres dans la
 * biblothèque ainsi que les boutons vers les autres pages.
 */

import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import GlobalStyles from './styles';
import { View, Text } from 'react-native-animatable';
import { ConnectedHomeButton as HomeButton, ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";


class Home extends Component {
    constructor(props){
        super(props);
        this.state = { };

        /*this.props.navigation.addListener('focus', () => {
            // on importe la liste des clés pour avoir le nombre de livres
            this.loadKeys();
        });*/

        this.props.navigation.setOptions({
            // le menu permet de vider la bibliothèque
            headerRight: () => (
                <HeaderButton
                    onPress={() => this.props.navigation.navigate('params')}
                    icon={require('./icons/settings.png')}/>
            ),
        });
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.title}>
                    {'Bienvenue dans ton Carnet de Lecture !'}
                </Text>

                <Text style={styles.subTitle}>
                    {'Il y a '+this.props.books.length+' livres dans ta bibliothèque.'}
                </Text>

                <View style={{marginTop:30}}>
                    <HomeButton
                        delay={100}
                        onPress={() => this.props.navigation.navigate('BookScreen',
                                                {book: null, visualMode: false})}
                        icon={require('./icons/playlist_add.png')}
                        text={'Ajouter un Livre'} />
                    <HomeButton
                        delay={300}
                        onPress={() => this.props.navigation.navigate('Bibliothèque')}
                        icon={require('./icons/books.png')}
                        text={'Voir la Bibliothèque'} />
                    <HomeButton
                        delay={500}
                        onPress={() => this.props.navigation.navigate('Month')}
                        icon={require('./icons/calendar.png')}
                        text={'Livres du mois'} />
                    <HomeButton
                        delay={700}
                        onPress={() => this.props.navigation.navigate('stack')}
                        icon={require('./icons/list.png')}
                        text={'Pile à Lire'} />
                    <HomeButton
                        delay={900}
                        onPress={() => this.props.navigation.navigate('stats')}
                        icon={require('./icons/stats.png')}
                        text={'Statistiques'} />
                    <HomeButton
                        delay={1100}
                        onPress={() => this.props.navigation.navigate('Scan')}
                        icon={require('./icons/add_camera.png')}
                        text={'Scanner ISBN'} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        marginHorizontal: 40,
        marginBottom: 30,
        fontSize: 30
    },
    subTitle: {
        marginHorizontal: 40,
        fontSize: 15
    },
    OptionStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
});

const mapStateToProps = state => ({
	books: state.books,
});

export default connect(mapStateToProps)(Home);
