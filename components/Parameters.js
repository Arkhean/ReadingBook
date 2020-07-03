/*
 * author: Julien Miens
 * date: june 2020
 * description: onglet des paramètres : couleurs et crédits
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import { Divider } from 'react-native-elements';
import ColorPicker from './ColorPicker';
import GlobalStyles from './styles';
import { ConnectedTextButton as TextButton } from './Buttons';
import { connect } from "react-redux";
import {
    setMainColor,
    setSecondaryColor,
    setReadColor,
    setUnreadColor
} from '../storage/colorActions';
import { removeAll } from '../storage/bookActions';
import { translate } from '../translations/translator';

class Params extends Component {
    constructor(props){
        super(props);
        this.props.navigation.setOptions({
            title: translate('parameters'),
        });
    }

    reset = async () => {
        Alert.alert(translate('attention'),
                    translate('paramalert'),
                    [{text: translate('deleteconfirm'), onPress: this.props.removeAll},
                    {text: translate('cancel'), onPress: () => {}}]
        );
    }

    render() {
        return (
            <ScrollView>
                <Text style={styles.title}>
                    {translate('paraminfo1')}
                </Text>

                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {translate('paraminfo2')}
                </Text>
                <ColorPicker
                    color={this.props.colors.mainColor}
                    onChange={this.props.setMainColor} />
                <Text style={styles.text}>
                    {translate('paraminfo3')}
                </Text>
                <ColorPicker
                    color={this.props.colors.secondaryColor}
                    onChange={this.props.setSecondaryColor} />
                <Text style={styles.text}>
                    {translate('paraminfo4')}
                </Text>
                <ColorPicker
                    color={this.props.colors.readColor}
                    onChange={this.props.setReadColor} />
                <Text style={styles.text}>
                    {translate('paraminfo5')}
                </Text>
                <ColorPicker
                    color={this.props.colors.unreadColor}
                    onChange={this.props.setUnreadColor} />

                <Divider style={GlobalStyles.divider}/>
                <TextButton
                    onPress={this.reset}
                    text={translate('paraminfo6')}/>

                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.text}>
                    {'Version 1.0.1'}
                </Text>
                <Text style={styles.subtext}>
                    {translate('paraminfo7')}
                </Text>
                <View style={{marginVertical: 30}}>
                    <Text style={styles.text}>
                        {translate('paraminfo8')}
                    </Text>
                    <Text style={styles.subtext}>
                        {translate('paraminfo9')}
                    </Text>
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        marginVertical: 30
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 15,
        textAlign: 'center',
    },
});

/* pour donner accès au store redux pour ce composant */
const mapStateToProps = state => ({
	colors: state.colors,
});

const mapDispatchToProps = dispatch => {
	return {
		setMainColor: color => dispatch(setMainColor(color)),
        setSecondaryColor: color => dispatch(setSecondaryColor(color)),
        setReadColor: color => dispatch(setReadColor(color)),
        setUnreadColor: color => dispatch(setUnreadColor(color)),
		removeAll: () => dispatch(removeAll()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Params);
