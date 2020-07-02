/*
 * author: Julien Miens
 * date: juin-juillet 2020
 * description: composant de navigation entre les différentes vues
 */


import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Month from './Month';
import BookScreen from './BookScreen';
import Lib from './Lib';
import GlobalStyles from './styles';
import BarCodeScan from './BarCodeScan';
import StackToRead from './StackToRead';
import Stats from './Statistics';
import Params from './Parameters';
import { connect } from "react-redux";

/* pile d'écran de navigation */
const Stack = createStackNavigator();

class Navigator extends Component {
    render() {
        /* options pour chaque écran */
        const options = {
            headerStyle: {
                backgroundColor: this.props.colors.mainColor,
            },
            headerTintColor: GlobalStyles.colors.textColor,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
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
                    <Stack.Screen
                        name="params"
                        component={Params}
                        options={options}/>
                    <Stack.Screen
                        name="stats"
                        component={Stats}
                        options={options}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

const mapStateToProps = state => ({
	colors: state.colors,
});

export default connect(mapStateToProps)(Navigator);
