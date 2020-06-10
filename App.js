import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Month from './components/Month';
import Add from './components/Add';
import Search from './components/Search';

const Stack = createStackNavigator();

const options = {
    headerStyle: {
        backgroundColor: '#3399ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

export default class App extends Component {
    render() {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={options}/>
            <Stack.Screen
                name="Month"
                component={Month}
                options={options}/>
            <Stack.Screen
                name="Add"
                component={Add}
                options={options}/>
            <Stack.Screen
                name="Search"
                component={Search}
                options={options}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
}
