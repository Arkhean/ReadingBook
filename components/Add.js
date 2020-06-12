import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/* textinput custom avec un titre au dessus */
class MyTextInput extends Component {
    constructor(props){
        super(props);
        this.state = { text: '', max: this.props.maxLength === undefined ? 40 : this.props.maxLength };
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
                    value={this.state.text}
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
        this.state = { date: new Date(Date.now()),
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

const defaultState = {  title: '',
                        author: '',
                        genre: '',
                        editor: '',
                        price: 0,
                        nPages: 0,
                        date: null,
                        readingdate: null,
                        comment: '' };

export default class Add extends Component {
    constructor(props){
        super(props);
        this.state = defaultState;
            this.setTitle = this.setTitle.bind(this);
            this.save = this.save.bind(this);

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

        this.props.navigation.addListener('focus', () => {
            this.setState(defaultState);
        });
    }

    save(){
        if (this.state.title !== "" && this.state.author !== ""){
            this.props.navigation.navigate('Home', {newBook: this.state});
        }
        else{
            Alert.alert('Il faut au minimum renseigner le titre et l\'auteur !')
        }
    }

    setTitle(title){
        this.setState({title});
    }

    render() {
        return (
            <ScrollView style={styles.view}>
                <MyTextInput title='Titre' type='default' onChange={text => this.setState({title: text})}/>
                <MyTextInput title='Auteur' type='default' onChange={text => this.setState({author: text})}/>
                <MyTextInput title='Genre' type='default' onChange={text => this.setState({genre: text})}/>
                <MyTextInput title='Editeur' type='default' onChange={text => this.setState({editor: text})}/>
                <MyTextInput title='Prix' type='numeric' onChange={text => this.setState({price: text})}/>
                <MyTextInput title='Nombres de pages' type='numeric' onChange={text => this.setState({nPages: text})}/>
                <MydateInput title='Date de sortie' onChange={text => this.setState({date: text})}/>
                <MydateInput title='Date de lecture' onChange={text => this.setState({readingdate: text})}/>
                <MyTextInput title='Commentaires' type='default' maxLength={200} onChange={text => this.setState({comment: text})}/>
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
        marginBottom: 5,
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
