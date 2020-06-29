import 'react-native-gesture-handler';
import React, { Component } from 'react';
import Navigator from './components/Navigator';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./storage/configureStore";

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Navigator />
                </PersistGate>
            </Provider>
        );
    }
}
