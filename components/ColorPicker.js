/*
 * author: Julien Miens
 * date: june 2020
 * description: color picker
 */

import React, { Component } from 'react';
import GlobalStyles from './styles';
import { ScrollView, TouchableOpacity } from 'react-native';

const colors = ['cyan', 'blue', 'lime', 'green', 'red', 'orange', 'yellow', 'purple', 'pink'];

export default class ColorPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedColor: colors.indexOf(this.props.color)
        };
    }

    render(){
        return (
            <ScrollView horizontal={true}>
                {colors.map((item,i) =>
                    <TouchableOpacity
                        key={i}
                        style={{
                            height: 30,
                            width: 50,
                            margin: 5,
                            backgroundColor: item,
                            borderWidth: (i==this.state.selectedColor) ? 3 : 0,
                            borderColor: 'black',
                            borderRadius: 10
                        }}
                        onPress={() => {
                            this.setState({selectedColor: i});
                            this.props.onChange(colors[i]);
                        }}>
                    </TouchableOpacity>)}
            </ScrollView>
        );
    }
}
