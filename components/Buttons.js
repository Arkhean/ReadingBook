/*
 * author: Julien Miens
 * date: june 2020
 * description: les boutons 
 */

import React, { Component, useState } from 'react';
import GlobalStyles from './styles';
import { TouchableOpacity, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';

export class HeaderButton extends Component {
    render(){
        return (
            <TouchableOpacity
                style={GlobalStyles.HeaderButton}
                activeOpacity={0.5}
                onPress={this.props.onPress}>
                <Image
                 source={this.props.icon}
                 style={GlobalStyles.ImageIconStyle}
                />
            </TouchableOpacity>
        );
    }
}

export class HomeButton extends Component {
    render(){
        <View animation={'zoomIn'}
              duration={1000}
              delay={this.props.delay}>
            <TouchableOpacity
                style={styles.ButtonStyle}
                activeOpacity={0.5}
                onPress={this.props.onPress}>
                <Image
                    source={this.props.icon}
                    style={GlobalStyles.ImageIconStyle}
                />
            <Text style={styles.TextStyle}>
                {this.props.text}
            </Text>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
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
});