/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: permet l'ajout de nouveau livre dans la bibliothèque,
 * possibilité d'importer une photo depuis l'appareil photo / la gallerie
 */

import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-community/picker';
import { Divider } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import GlobalStyles from './styles';
import { genres, formats } from './book';
import { translate } from '../translations/translator';


/* textinput custom avec un titre au dessus */
class MyTextInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            max: this.props.maxLength === undefined ? 40 : this.props.maxLength
        };
    }

    onChangeText = (text) => {
        this.props.onChange(text);
    }

    // pour assurer la gestion du multiline, fournir la prop multiline={true}
    render() {
        return (
            <View style={this.props.style}>
                <Text style={styles.title}>{this.props.title}</Text>
                <TextInput
                    style={this.props.multiline ? GlobalStyles.multilineInput : GlobalStyles.input}
                    editable={this.props.editable}
                    placeholder={this.props.type == 'numeric' ? '0' : ''}
                    value={this.props.value == 0 ? '' : this.props.value.toString()}
                    keyboardType={this.props.type}
                    maxLength={this.state.max}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.multiline ? 4 : 1}
                    onChangeText={this.props.onChange}/>
            </View>
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

// permet d'avoir un date à deux chiffres, e.g. 1/2 -> 01/02
function pad(n) {return n < 10 ? "0"+n : n;}

// affiche une date au format 02/06/2020 pour le 2 juin 2020
function displayDate(date){
    date = new Date(date);
    return pad(date.getDate())+"/"+pad(date.getMonth()+1)+"/"+date.getFullYear();
}

/* date custom avec un titre au dessus */
class MydateInput extends Component {
    constructor(props){
        super(props);
        this.state = { date: new Date(this.props.value),
                        show: false };
        this.setDate = this.setDate.bind(this);
    }

    setDate = (event, date) => {
        if (date != undefined){
            this.setState({date: date, show: false});
            this.props.onChange(date);
        }
    }

    activateSelection = () => {
        this.setState({show: true});
    }

    render() {
        return (
            <View style={this.props.style}>
                <Text style={styles.title}>{this.props.title}</Text>
                {this.state.show &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
                }
                <TouchableOpacity
                    style={GlobalStyles.input}
                    editable={this.props.editable}
                    activeOpacity={0.5}
                    onPress={this.activateSelection}>
                    <Text style={{fontSize: 18, marginTop: 5}}>
                        {displayDate(this.state.date)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

/* permet l'ajout d'une liste de dates de lectures */
class MultiDateInput extends Component {
    constructor(props){
        super(props);
        this.state = { dates: this.props.value,
                       show: false,
                       inputNum: 0 }; // 0 pour date début, 1 date de fin
        // indique le numéro de la ligne de selection de dates
        // (chaque ligne est constitué de start+end)
        this.cursor = 0;
    }

    setDate = (event, date) => {
        if (date != undefined){
            let dates = this.state.dates;
            if (this.state.inputNum === 0){
                if (date > dates[this.cursor].end){
                    Alert.alert(translate('addalert1'));
                    return;
                }
                else{
                    dates[this.cursor].start = date;
                }
            }
            else{
                if (date < dates[this.cursor].start){
                    Alert.alert(translate('addalert2'));
                    return;
                }
                dates[this.cursor].end = date;
            }
            this.setState({dates: dates, show: false});
            this.props.onChange(this.state.dates);
        }
    }

    // ajouter une ligne
    newDates = () => {
        let dates = this.state.dates;
        dates.push({start: new Date(Date.now()), end: new Date(Date.now())});
        this.setState({dates: dates});
    }

    // supprimer une ligne
    removeDate = (i) => {
        let dates = this.state.dates;
        dates.splice(i, 1);
        this.setState({dates: dates});
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity
                        style={GlobalStyles.GreenButton}
                        activeOpacity={0.5}
                        onPress={this.newDates}>
                        <Image source={require('./icons/add.png')}
                               style={GlobalStyles.LittleImageIconStyle} />
                    </TouchableOpacity>
                </View>
                {this.state.show &&
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.inputNum === 0
                            ? this.state.dates[this.cursor].start
                            : this.state.dates[this.cursor].end}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
                }
                {this.state.dates.map((item, i) =>
                    <View key={i} style={{flexDirection: 'row', marginBottom: 5}}>
                        <Text style={{fontSize: 18, marginRight: 5, alignSelf: 'center'}}>
                            {'du'}
                        </Text>
                        <TouchableOpacity
                            style={GlobalStyles.input}
                            editable={this.props.editable}
                            activeOpacity={0.5}
                            onPress={() => { this.setState({show: true, inputNum: 0}); this.cursor = i; }}>
                            <Text style={{fontSize: 18, marginTop: 5}}>
                                {displayDate(this.state.dates[i].start)}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{marginHorizontal: 5, fontSize: 18, alignSelf: 'center'}}>
                            {'au'}
                        </Text>
                        <TouchableOpacity
                            style={GlobalStyles.input}
                            editable={this.props.editable}
                            activeOpacity={0.5}
                            onPress={() => { this.setState({show: true, inputNum: 1}); this.cursor = i; }}>
                            <Text style={{fontSize: 18, marginTop: 5}}>
                                {displayDate(this.state.dates[i].end)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={GlobalStyles.RedButton}
                            activeOpacity={0.5}
                            onPress={() => this.removeDate(i)}>
                            <Image source={require('./icons/clear.png')}
                                   style={GlobalStyles.LittleImageIconStyle} />
                        </TouchableOpacity>
                    </View>)
                }
            </View>
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

/* picker de liste custom avec un titre au dessus */
class MyPicker extends Component {
    constructor(props){
        super(props);
    }

    // la liste est à fournir dans props.data
    render() {
        return (
            <View style={{margin: 10, flexDirection: 'row'}}>
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
                <View style={{ flex: 1,
                               borderWidth: 1,
                               borderColor: 'gray',
                               borderRadius: 10}}>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={this.props.value}
                        onValueChange={(itemValue, itemIndex) => this.props.onChange(itemValue)}>
                        {this.props.data.map((item, i) =>
                            <Picker.Item key={i} label={item} value={item} />)}
                    </Picker>
                </View>
            </View>
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

/* permet d'importer une image depuis l'appareil photo ou la bibliothèque */
class MyImageInput extends Component {
    constructor(props){
        super(props);
        this.state = { image: this.props.value === '' ? null : this.props.value };
    }

    onPress = () => ImagePicker.showImagePicker({
            title: translate('addimport'),
            takePhotoButtonTitle: translate('addimport1'),
            chooseFromLibraryButtonTitle: translate('addimport2'),
            cancelButtonTitle: translate('cancel')
        }, (response) => {
            if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                const source = response.uri;
                this.setState({ image: source });
                this.props.onChange(source);
            }
        });

    render(){
        return (
            <TouchableOpacity
                style={styles.image}
                onPress={this.onPress}>
                {this.state.image != null &&
                    <Image
                        source={{uri: this.state.image}}
                        style={{width: 98, height: 148, borderRadius: 9}}/>
                }
            </TouchableOpacity>
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
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <MyTextInput
                            title={translate('title')}
                            value={this.props.book.title}
                            type='default'
                            style={styles.viewVertical}
                            onChange={text => this.props.onChange('title', text)}/>
                        <MyTextInput
                            style={styles.viewVertical}
                            title={translate('author')}
                            value={this.props.book.author}
                            type='default'
                            onChange={text => this.props.onChange('author', text)}/>
                    </View>
                    <MyImageInput
                        value={this.props.book.imageUri}
                        onChange={text => this.props.onChange('imageUri', text)}/>
                </View>

                <Divider style={GlobalStyles.divider}/>

                <MyTextInput
                    style={styles.viewHorizontal}
                    title={translate('saga')}
                    value={this.props.book.saga}
                    type='default'
                    onChange={text => this.props.onChange('saga', text)}/>
                <MyTextInput
                    style={styles.viewHorizontal}
                    title={translate('tome')}
                    value={this.props.book.nTome}
                    type='numeric'
                    editable={this.props.book.saga != ''}
                    onChange={text => this.props.onChange('nTome', text)}/>

                <Divider style={GlobalStyles.divider}/>

                <MyPicker
                    style={styles.viewHorizontal}
                    title={translate('genre')}
                    value={this.props.book.genre}
                    data={genres}
                    onChange={value => this.props.onChange('genre', value)}/>
                <MyTextInput
                    style={styles.viewHorizontal}
                    title={translate('editor')}
                    value={this.props.book.editor}
                    type='default'
                    onChange={text => this.props.onChange('editor', text)}/>
                <MyPicker
                    title={translate('format')}
                    value={this.props.book.format}
                    data={formats}
                    onChange={value => this.props.onChange('format', value)}/>
                <MyTextInput
                    style={styles.viewHorizontal}
                    title={translate('price')}
                    value={this.props.book.price}
                    type='numeric'
                    onChange={text => this.props.onChange('price', text)}/>
                <MyTextInput
                    style={styles.viewHorizontal}
                    title={translate('nbpages')}
                    value={this.props.book.nPages}
                    type='numeric'
                    onChange={text => this.props.onChange('nPages', text)}/>

                <Divider style={GlobalStyles.divider}/>

                <MydateInput
                    style={styles.viewHorizontal}
                    title={translate('purchase')}
                    value={this.props.book.purchaseDate}
                    onChange={text => this.props.onChange('purchaseDate', text)}/>
                <MultiDateInput
                    style={styles.viewVertical}
                    title={translate('read')}
                    value={this.props.book.readingDates}
                    onChange={text => this.props.onChange('readingDates', text)}/>
                <MyTextInput
                    style={styles.viewVertical}
                    title={translate('comment')}
                    value={this.props.book.comment}
                    type='default'
                    multiline={true}
                    maxLength={200}
                    onChange={text => this.props.onChange('comment', text)}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    viewHorizontal: {
        margin: 10,
        flexDirection: 'row'
    },
    viewVertical: {
        margin: 10,
    },
    text: {
        fontSize: 18,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingRight: 10,
        alignSelf: 'center'
    },
    image: {
        borderWidth: 1,
        width: 100,
        height: 150,
        margin: 10,
        borderColor: 'gray',
        borderRadius: 10
    }
});
