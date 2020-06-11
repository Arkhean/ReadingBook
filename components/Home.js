import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity } from 'react-native';

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = { books: [] };
        this.addBook = this.addBook.bind(this);

        this.props.navigation.addListener('focus', () => {
            if (this.props.route.params?.newBook){
                this.addBook(this.props.route.params.newBook);
            }
        });
    }

    addBook(book){
        const books = this.state.books;
        books.push(book);
        this.setState({books: books});
    }

    showToast(){
        ToastAndroid.show("toujours pas fait", ToastAndroid.SHORT);
    }

  render() {
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Bienvenue dans ton Carnet de Lecture !</Text>

            <Text style={styles.subTitle}>Il y a {this.state.books.length} livres dans ta bibliothèque.</Text>

            <View style={{marginTop:30}}>
                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Ajouter un Livre'/*, {addBook: this.addBook}*/)}>
                    <Image
                     source={require('./icons/books.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Ajouter un livre </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Search')}>
                    <Image
                     source={require('./icons/search.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Rechercher un livre </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.showToast()}>
                    <Image
                     source={require('./icons/books.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Voir la Bibliothèque </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate('Month')}>
                    <Image
                     source={require('./icons/calendar.png')}
                     style={styles.ImageIconStyle}
                    />
                    <Text style={styles.TextStyle}> Livres du mois </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    view: {
        margin: 20,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'center',
        margin: 20,
        fontSize: 30
    },
    subTitle: {
        margin: 20,
        fontSize: 15
    },
    ButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3399ff',
        borderWidth: 0.5,
        borderColor: '#fff',
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
        color: '#fff',
        marginBottom: 4,
        marginRight: 20,
        fontSize: 25
    },
});
