import React, { Component } from 'react';
import { StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';
import StorageManager from './StorageManager';
import { CommonActions } from '@react-navigation/native';
import GlobalStyles from './styles';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

// TODO : bouton pile à lire

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = { listOfKeys: [] };

        this.props.navigation.addListener('focus', () => {
            this.loadKeys();
        });

        this.props.navigation.setOptions({
            headerRight: () => (
                    <Menu>
                        <MenuTrigger style={styles.OptionStyle}>
                            <Image source={require('./icons/menu.png')}
                                   style={GlobalStyles.ImageIconStyle}/>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => StorageManager.export()}>
                                <Text style={{fontSize: 16}}>Exporter la bibliothèque</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => {
                                StorageManager.import().then(() => this.loadKeys());
                            }}>
                                <Text style={{fontSize: 16}}>Importer une bibliothèque</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
            ),
        });
    }

    async loadKeys(){
        let listOfKeys = await StorageManager.loadKeys();
        if (listOfKeys != null){
            this.setState({listOfKeys: listOfKeys});
        }
    }

  render() {
    const animation = 'zoomIn';
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Bienvenue dans ton Carnet de Lecture !</Text>

            <Text style={styles.subTitle}>Il y a {this.state.listOfKeys.length} livres dans ta bibliothèque.</Text>

            <View style={{marginTop:30}}>
                <View animation={animation}
                      duration={1000}
                      delay={100}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate('BookScreen', {book: null, visualMode: false})}>
                        <Image
                         source={require('./icons/books.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                        <Text style={styles.TextStyle}> Ajouter un livre </Text>
                    </TouchableOpacity>
                </View>

                <View animation={animation}
                      duration={1000}
                      delay={300}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate('Bibliothèque', {books: this.state.books})}>
                        <Image
                         source={require('./icons/books.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                        <Text style={styles.TextStyle}> Voir la Bibliothèque </Text>
                    </TouchableOpacity>
                </View>

                <View animation={animation}
                      duration={1000}
                      delay={500}>
                    <TouchableOpacity
                        style={styles.ButtonStyle}
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate('Month')}>
                        <Image
                         source={require('./icons/calendar.png')}
                         style={GlobalStyles.ImageIconStyle}
                        />
                        <Text style={styles.TextStyle}> Livres du mois </Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 100,
        fontSize: 30
    },
    subTitle: {
        marginHorizontal: 40,
        fontSize: 15
    },
    ButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GlobalStyles.colors.mainColor,
        borderColor: GlobalStyles.colors.mainColor,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
    },
    TextStyle: {
        color: GlobalStyles.colors.textColor,
        marginBottom: 4,
        marginRight: 20,
        fontSize: 25
    },
    OptionStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 20,
    },
});
