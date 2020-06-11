import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/* textinput custom avec un titre au dessus */
class MyTextInput extends Component {
    constructor(props){
        super(props);
        this.state = { text: '' };
        this.setText = this.setText.bind(this);
    }

    setText(text){
        this.setState({text});
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>{this.props.title}</Text>
                <TextInput
                    style={styles.input}
                    value={this.state.text}
                    keyboardType={this.props.type}
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

export default class Add extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            author: '',
            genre: '',
            editor: '',
            price: 0,
            nPages: 0,
            date: null,
            readingdate: null,
            comment: '' };
            this.setTitle = this.setTitle.bind(this);
    }


    setTitle(title){
        this.setState({title});
    }

    render() {
        return (
            <ScrollView style={styles.view}>
                <MyTextInput title='Titre' type='default'/>
                <MyTextInput title='Auteur' type='default'/>
                <MyTextInput title='Genre' type='default'/>
                <MyTextInput title='Editeur' type='default'/>
                <MyTextInput title='Prix' type='numeric'/>
                <MyTextInput title='Nombres de pages' type='numeric'/>
                <MydateInput title='Date de sortie' />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 15,
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
    },
});
