/*
 * author: Julien Miens
 * date: juin 2020
 * description: composant affichant le détails d'un livre,
 * utilisé dans BookScreen
 */

import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Book, { getImage } from './book';
import { Divider } from 'react-native-elements';
import GlobalStyles from './styles';
import { translate } from '../translations/translator';

function pad(n) {return n < 10 ? "0"+n : n;}

function displayDate(date){
    return pad(date.getDate())+"/"+pad(date.getMonth()+1)+"/"+date.getFullYear();
}

export default class VisualBook extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const book = this.props.book;
        const date1 = new Date(book.purchaseDate);
        return (
            <View style={styles.view}>
                <View style={{flexDirection: 'row'}}>
                    <Image source={getImage(this.props.book)}
                           style={GlobalStyles.BigImageStyle}/>
                    <View style={{flex:1}}>
                        <Text style={styles.title}>
                            {book.title}
                        </Text>
                        {book.saga != '' &&
                            <Text style={styles.subtitle}>
                                {book.saga+", tome "+book.nTome}
                            </Text>
                        }
                        <Text style={styles.author}>
                            {translate('visual1')+book.author}
                        </Text>
                    </View>
                </View>

                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>{translate('visual2')}
                    <Text style={styles.innerText}>
                        {translate(book.genre)}
                    </Text>
                </Text>
                <Text style={styles.text}>
                    {translate('visual3')}
                    <Text style={styles.innerText}>
                        {book.editor}
                    </Text>
                </Text>
                <Text style={styles.text}>
                    {translate('visual4')}
                    <Text style={styles.innerText}>
                        {translate(book.format)}
                    </Text>
                </Text>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {translate('visual5')+displayDate(date1)+translate('visual6')+book.price+translate('visual7')}
                </Text>
                <Text style={styles.text}>
                    {translate('visual8')+book.nPages+translate('visual9')}
                </Text>
                {book.readingDates.length == 0 &&
                    <Text style={styles.text}>
                        {translate('visual10')}
                    </Text>
                }
                {book.readingDates.map((item, i) =>
                    <Text key={i} style={styles.innerText}>
                        {translate('visual11')+displayDate(new Date(item.start))+translate('visual12')+displayDate(new Date(item.end))}
                    </Text>)
                }
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {translate('visual13')}
                    <Text style={styles.innerText}>
                        {book.comment}
                    </Text>
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 10,
    },
    text: {
        fontSize: 18,
    },
    innerText: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    title: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 25,
        fontWeight: 'bold'
    },
    subtitle: {
        marginBottom: 4,
        marginLeft: 20,
        fontSize: 20
    },
    author: {
        fontSize: 20,
        marginBottom: 4,
        marginRight: 20,
        fontStyle: 'italic',
        textAlign: 'right'
    },
});
