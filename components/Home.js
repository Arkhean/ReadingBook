import React, { Component } from 'react';
import { StyleSheet, Button, ToastAndroid, Image, TouchableOpacity, Alert } from 'react-native';
import StorageManager from './StorageManager';
import { CommonActions } from '@react-navigation/native';
import GlobalStyles from './styles';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

const AnimatableButton = createAnimatableComponent(TouchableOpacity);

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = { listOfKeys: [] };
        //StorageManager.prune();

        this.loadKeys();

        this.props.navigation.addListener('focus', () => {
            this.loadKeys();
        });
    }

    async loadKeys(){
        let listOfKeys = await StorageManager.loadKeys();
        this.setState({listOfKeys: listOfKeys});
    }

    showToast(){
        ToastAndroid.show("toujours pas fait", ToastAndroid.SHORT);
    }

  render() {
    const animation = 'zoomIn';
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Bienvenue dans ton Carnet de Lecture !</Text>

            <Text style={styles.subTitle}>Il y a {this.state.listOfKeys.length} livres dans ta bibliothèque.</Text>

            <View style={{marginTop:30}}>
                <AnimatableButton
                    animation={animation}
                    duration={1000}
                    delay={100}
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('BookScreen', {book: null, visualMode: false})}>
                    <Image
                     source={require('./icons/books.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Ajouter un livre </Text>
                </AnimatableButton>

                <AnimatableButton
                    animation={animation}
                    duration={1000}
                    delay={300}
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Bibliothèque', {books: this.state.books})}>
                    <Image
                     source={require('./icons/books.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Voir la Bibliothèque </Text>
                </AnimatableButton>

                <AnimatableButton
                    animation={animation}
                    duration={1000}
                    delay={500}
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Month')}>
                    <Image
                     source={require('./icons/calendar.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Livres du mois </Text>
                </AnimatableButton>
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
        marginBottom: 60,
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
        borderWidth: 0.5,
        borderColor: GlobalStyles.colors.mainColor,
        height: 50,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
    TextStyle: {
        color: GlobalStyles.colors.textColor,
        marginBottom: 4,
        marginRight: 20,
        fontSize: 25
    },
});
