import 'react-native-gesture-handler';
import React, { Component } from 'react';
import * as RNLocalize from "react-native-localize";
import { setI18nConfig } from './translations/translator';
import Navigator from './components/Navigator';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./storage/configureStore";


export default class App extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(); // set initial config
    }

    componentDidMount() {
        RNLocalize.addEventListener("change", this.handleLocalizationChange);
    }

    componentWillUnmount() {
        RNLocalize.removeEventListener("change", this.handleLocalizationChange);
    }

    handleLocalizationChange = () => {
        setI18nConfig();
        this.forceUpdate();
    };

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
