/*
 * author: Julien Miens
 * date: june 2020
 * description: composant d'accueil affichant le nombre de livres dans la
 * biblothèque ainsi que les boutons vers les autres pages.
 */

import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import GlobalStyles from './styles';
import { View, Text } from 'react-native-animatable';
import { ConnectedHomeButton as HomeButton, ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";


class Home extends Component {
    constructor(props){
        super(props);

        this.props.navigation.setOptions({
            // le menu permet de vider la bibliothèque
            headerRight: () => (
                <HeaderButton
                    onPress={this.navigateToParams}
                    icon={require('./icons/settings.png')}/>
            ),
        });
    }

    componentDidMount() {
        Orientation.lockToPortrait(); //this will lock the view to Portrait
    }


    /* on stock ici les fonctions de navigation pour ne pas re-render les
       boutons pour rien */
    navigateToParams = () => {
        this.props.navigation.navigate('params');
    }

    navigateToBookScreen = () => {
        this.props.navigation.navigate('BookScreen',
                                            {book: null, visualMode: false});
    }

    navigateToMonth = () => {
        this.props.navigation.navigate('Month');
    }

    navigateToLib = () => {
        this.props.navigation.navigate('Bibliothèque');
    }

    navigateToStack = () => {
        this.props.navigation.navigate('stack');
    }

    navigateToStats = () => {
        this.props.navigation.navigate('stats');
    }

    navigateToScan = () => {
        this.props.navigation.navigate('Scan');
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
                        onPress={this.navigateToBookScreen}
                        icon={require('./icons/playlist_add.png')}
                        text={'Ajouter un Livre'} />
                    <HomeButton
                        delay={300}
                        onPress={this.navigateToLib}
                        icon={require('./icons/books.png')}
                        text={'Voir la Bibliothèque'} />
                    <HomeButton
                        delay={500}
                        onPress={this.navigateToMonth}
                        icon={require('./icons/calendar.png')}
                        text={'Livres du mois'} />
                    <HomeButton
                        delay={700}
                        onPress={this.navigateToStack}
                        icon={require('./icons/list.png')}
                        text={'Pile à Lire'} />
                    <HomeButton
                        delay={900}
                        onPress={this.navigateToStats}
                        icon={require('./icons/stats.png')}
                        text={'Statistiques'} />
                    <HomeButton
                        delay={1100}
                        onPress={this.navigateToScan}
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
