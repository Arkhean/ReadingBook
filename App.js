import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Month from './components/Month';
import BookScreen from './components/BookScreen';
import Lib from './components/Lib';
import AsyncStorage from '@react-native-community/async-storage';
import GlobalStyles from './components/styles';
import { MenuProvider } from 'react-native-popup-menu';
import BarCodeScan from './components/BarCodeScan';
import StackToRead from './components/StackToRead';

/* pile d'écran de navigation */
const Stack = createStackNavigator();

/* options pour chaque écran */
const options = {
    headerStyle: {
        backgroundColor: GlobalStyles.colors.mainColor,
    },
    headerTintColor: GlobalStyles.colors.textColor,
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

export default class App extends Component {
    render() {
      return (
        <MenuProvider>
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
                    name="BookScreen"
                    component={BookScreen}
                    options={options}/>
                <Stack.Screen
                    name="Bibliothèque"
                    component={Lib}
                    options={options}/>
                <Stack.Screen
                    name="Scan"
                    component={BarCodeScan}
                    options={options}/>
                <Stack.Screen
                    name="stack"
                    component={StackToRead}
                    options={options}/>
              </Stack.Navigator>
            </NavigationContainer>
        </MenuProvider>
      );
    }
}
