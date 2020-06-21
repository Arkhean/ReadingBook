import React, { Component, useState } from 'react';
import GlobalStyles from './styles';
import { TouchableOpacity, Image } from 'react-native';

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
