import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Month from './components/Month';
import Add from './components/Add';
import Search from './components/Search';
import AsyncStorage from '@react-native-community/async-storage';


/* pour sauvegarder la base de données */
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    // saving error
  }
}

/* pile d'écran de navigation */
const Stack = createStackNavigator();

/* options pour chaque écran */
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
                options={options}
                /*initialParams={{newBook: undefined}}*//>
            <Stack.Screen
                name="Month"
                component={Month}
                options={options}/>
            <Stack.Screen
                name="Ajouter un Livre"
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
