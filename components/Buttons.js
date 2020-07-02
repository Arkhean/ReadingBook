/*
 * author: Julien Miens
 * date: juin 2020
 * description: les boutons
 */

import React, { Component } from 'react';
import GlobalStyles from './styles';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { connect } from "react-redux";


// boutons utilisés dans la HeaderBar à droite
class HeaderButton extends Component {
    render(){
        return (
            <TouchableOpacity
                style={{
                    alignSelf: 'center',
                    marginHorizontal: 10,
                    marginVertical: 10,
                    borderRadius: 15,
                    backgroundColor: this.props.colors.secondaryColor,
                }}
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

// bouton avec du texte
class TextButton extends Component {
    render(){
        return (
            <TouchableOpacity
                style={{
                    alignSelf: 'center',
                    marginHorizontal: 10,
                    marginVertical: 10,
                    borderRadius: 15,
                    backgroundColor: this.props.colors.secondaryColor,
                }}
                activeOpacity={0.5}
                onPress={this.props.onPress}>
                <Text style={{ color: GlobalStyles.colors.textColor,
                               fontSize: 20,
                               padding: 10 }}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }
}

// boutons utilisé uniquement dans Home
class HomeButton extends Component {
    render(){
        return (
            <View animation={'zoomIn'}
                  duration={1000}
                  delay={this.props.delay}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: this.props.colors.mainColor,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        borderRadius: 5,
                    }}
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
        );
    }
}

const styles = StyleSheet.create({
    TextStyle: {
        color: GlobalStyles.colors.textColor,
        marginBottom: 4,
        fontSize: 25,
    },
});

const mapStateToProps = state => ({
	colors: state.colors,
});

const ConnectedHeaderButton = connect(mapStateToProps)(HeaderButton);
const ConnectedHomeButton = connect(mapStateToProps)(HomeButton);
const ConnectedTextButton = connect(mapStateToProps)(TextButton);


export { ConnectedHomeButton, ConnectedHeaderButton, ConnectedTextButton };
