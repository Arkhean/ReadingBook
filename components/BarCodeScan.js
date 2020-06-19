import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

// TODO : ajouter la lampe si besoin... ?


export default class BarcodeScan extends Component {
    constructor(props) {
        super(props);
    }

    onBarCodeRead = (e) => {
        // TODO retransmettre les données vers add et faire la requête
        Alert.alert("Barcode value is" + e.data, "Barcode type is" + e.type);
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}
                    ref={cam => this.RNCamera = cam}
                    captureAudio={false}>
                </RNCamera>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});
