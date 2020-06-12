import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, ToastAndroid, Image, TouchableOpacity } from 'react-native';

export default class Month extends Component {
    showToast(){
        ToastAndroid.show("toujours pas fait", ToastAndroid.SHORT);
    }

  render() {
    return (
        <View style={styles.view}>
            <Text>Work in progress...</Text>

        </View>
    );
  }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    }
});
