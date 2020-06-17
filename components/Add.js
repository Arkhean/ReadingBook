import React, { Component, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StorageManager from './StorageManager';
import GlobalStyles from './styles';

// TODO : liste déroulantes pour genre/format
// TODO : mettre en ligne

/* textinput custom avec un titre au dessus */
class MyTextInput extends Component {
    constructor(props){
        super(props);
        this.state = { text: this.props.value === 'unknown' ? '' : this.props.value,
                        max: this.props.maxLength === undefined ? 40 : this.props.maxLength };
    }

    setText = (text) => {
        this.setState({text});
        this.props.onChange(text);
    }

    render() {
        return (
            <View style={styles.view}>
                <Text style={styles.text}>{this.props.title}</Text>
                <TextInput
                    style={GlobalStyles.input}
                    editable={this.props.editable}
                    placeholder={this.props.type == 'numeric' ? '0' : ''}
                    value={this.props.value == 0 ? '' : this.props.value.toString()}
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
        if (date != undefined){
            this.setState({date: date, show: false});
            this.props.onChange(date);
        }
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
                    style={GlobalStyles.input}
                    editable={this.props.editable}
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
    }

    render() {
        return (
            <ScrollView >
                <MyTextInput
                    title='Titre' value={this.props.book.title} type='default'
                    onChange={text => this.props.onChange('title', text)}/>
                <MyTextInput
                    title='Auteur' value={this.props.book.author} type='default'
                    onChange={text => this.props.onChange('author', text)}/>
                <MyTextInput
                    title='Saga' value={this.props.book.saga} type='default'
                    onChange={text => this.props.onChange('saga', text)}/>
                <MyTextInput
                    title='Tome' value={this.props.book.nTome} type='numeric'
                    editable={this.props.book.saga != ''}
                    onChange={text => this.props.onChange('nTome', text)}/>
                <MyTextInput
                    title='Genre' value={this.props.book.genre} type='default'
                    onChange={text => this.props.onChange('genre', text)}/>
                <MyTextInput
                    title='Editeur' value={this.props.book.editor} type='default'
                    onChange={text => this.props.onChange('editor', text)}/>
                <MyTextInput
                    title='Format' value={this.props.book.format} type='default'
                    onChange={text => this.props.onChange('format', text)}/>
                <MyTextInput
                    title='Prix' value={this.props.book.price} type='numeric'
                    onChange={text => this.props.onChange('price', text)}/>
                <MyTextInput
                    title='Nombres de pages' value={this.props.book.nPages} type='numeric'
                    onChange={text => this.props.onChange('nPages', text)}/>
                <MydateInput
                    title="Date d'achat" value={this.props.book.purchaseDate}
                    onChange={text => this.props.onChange('purchaseDate', text)}/>
                <MydateInput
                    title='Date de lecture' value={this.props.book.readingDate}
                    onChange={text => this.props.onChange('readingDate', text)}/>
                <MyTextInput
                    title='Commentaires' value={this.props.book.comment} type='default'
                    maxLength={200} onChange={text => this.props.onChange('comment', text)}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 10,
        //flexDirection: 'row'
    },
    text: {
        fontSize: 20,
    },
});
