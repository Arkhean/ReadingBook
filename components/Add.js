import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StorageManager from './StorageManager';

/* textinput custom avec un titre au dessus */
class MyTextInput extends Component {
    constructor(props){
        super(props);
        this.state = { text: this.props.value === 'unknown' ? '' : this.props.value,
                        max: this.props.maxLength === undefined ? 40 : this.props.maxLength };
        this.setText = this.setText.bind(this);
    }

    setText(text){
        this.setState({text});
        this.props.onChange(text);
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>{this.props.title}</Text>
                <TextInput
                    style={styles.input}
                    value={this.state.text.toString()}
                    keyboardType={this.props.type}
                    maxLength={this.state.max}
                    onChangeText={text => this.setText(text)}/>
            </View>
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

function pad(n) {return n < 10 ? "0"+n : n;}

/* date custom avec un titre au dessus */
class MydateInput extends Component {
    constructor(props){
        super(props);
        this.state = { date: new Date(this.props.value),
                        show: false };
        this.setDate = this.setDate.bind(this);
    }

    setDate(date){
        this.setState({date: date, show: false});
        this.props.onChange(date);
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>{this.props.title}</Text>
                {this.state.show &&
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => this.setDate(selectedDate)} />
                }
                <TouchableOpacity
                    style={styles.input}
                    activeOpacity={0.5}
                    onPress={() => this.setState({show: true})}>
                    <Text style={styles.text}> {pad(this.state.date.getDate())+"/"+pad(this.state.date.getMonth()+1)+"/"+this.state.date.getFullYear()} </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

const defaultState = {  //id: StorageManager.newId(),
                        title: '',
                        author: '',
                        genre: 'unknown',
                        editor: 'unknown',
                        price: 0,
                        nPages: 0,
                        purchaseDate: new Date(Date.now()),
                        readingDate: new Date(Date.now()),
                        comment: '' };

export default class Add extends Component {
    constructor(props){
        super(props);
        this.state = defaultState;
        this.modificationMode = false;
        if (this.props.route.params.book != null){
            this.state = this.props.route.params.book;
            this.modificationMode = true;
        }
        this.setTitle = this.setTitle.bind(this);
        this.save = this.save.bind(this);
        this.listOfKeys = [];
        this.loadKeys();

        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={styles.ButtonStyle}
                    activeOpacity={0.5}
                    onPress={() => this.save()} >
                    <Image
                     source={require('./icons/done.png')}
                     style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
            ),
        });
    }

    async loadKeys(){
        this.listOfKeys = await StorageManager.loadKeys();
    }

    save(){
        let newK = this.state.title+this.state.author;
        if (this.state.title !== "" && this.state.author !== ""){
            if (!this.modificationMode){
                for(let k of this.listOfKeys){
                    if (k == newK){
                        Alert.alert('Erreur : '+this.state.title+' de '+this.state.author+' est déjà dans la bibliothèque !');
                        return;
                    }
                }
            }
            let array = this.props.navigation.dangerouslyGetState().routeNames;
            let previousScreen = array[array.length-1];
            if (previousScreen == 'Home'){
                StorageManager.store(newK, this.state).then(() => this.props.navigation.goBack());
            }
            else{
                /* retour sur VisualBook à mettre à jour */
                StorageManager.store(newK, this.state).then(() => this.props.navigation.navigate(previousScreen, {book: this.state}));
            }
        }
        else{
            Alert.alert('Il faut au minimum renseigner le titre et l\'auteur !');
        }
    }

    setTitle(title){
        this.setState({title});
    }

    render() {
        return (
            <ScrollView style={styles.view}>
                <MyTextInput title='Titre' value={this.state.title} type='default' onChange={text => this.setState({title: text})}/>
                <MyTextInput title='Auteur' value={this.state.author} type='default' onChange={text => this.setState({author: text})}/>
                <MyTextInput title='Genre' value={this.state.genre} type='default' onChange={text => this.setState({genre: text})}/>
                <MyTextInput title='Editeur' value={this.state.editor} type='default' onChange={text => this.setState({editor: text})}/>
                <MyTextInput title='Prix' value={this.state.price} type='numeric' onChange={text => this.setState({price: text})}/>
                <MyTextInput title='Nombres de pages' value={this.state.nPages} type='numeric' onChange={text => this.setState({nPages: text})}/>
                <MydateInput title="Date d'achat" value={this.state.purchaseDate} onChange={text => this.setState({purchaseDate: text})}/>
                <MydateInput title='Date de lecture' value={this.state.readingDate} onChange={text => this.setState({readingDate: text})}/>
                <MyTextInput title='Commentaires' value={this.state.comment} type='default' maxLength={200} onChange={text => this.setState({comment: text})}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 10,
    },
    text: {
        fontSize: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    ImageIconStyle: {
        padding: 10,
        marginRight: 15,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
});
