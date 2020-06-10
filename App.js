import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class HelloWorldApp extends Component {
  render() {
    return (
      <View style={styles.test}>
        <Text>Hello, world!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    test: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});
