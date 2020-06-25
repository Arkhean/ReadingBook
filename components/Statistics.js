/*
 * author: Julien Miens
 * date: june 2020
 * description: statistiques sur la bibliothèque
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import GlobalStyles from './styles';
import { View, Text } from 'react-native-animatable';
import { Divider } from 'react-native-elements';
import { ConnectedHomeButton as HomeButton, ConnectedHeaderButton as HeaderButton } from './Buttons';
import { connect } from "react-redux";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

// TODO : nombre achetés / mois
// TODO : dépense / mois
// TODO : nombre lus / mois
// TODO : rond genre

// NB : avec picker puis on set le graphe ! ou pas ...

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                        'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const getLastMonth = (n) => {
    const now = new Date(Date.now());
    let m = now.getMonth() + 1;
    let y = now.getFullYear();
    let res = [];
    for(var i = 0; i < n; i++){
        m -= 1;
        if (m == -1){
            m = 11;
            y -= 1;
        }
        res.push({ month: m, year: y });
    }
    return res.reverse();
}

const displayDate = (date) => {
    let { month, year } = date;
    month += 1;
    return res = (month < 10 ? '0'+month : month) + '/' + year.toString().slice(-2);
}


class Stats extends Component {
    render() {
        const chartConfig = {
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: () => this.props.colors.secondaryColor,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        };

        const N = 24;
        const lastMonths = getLastMonth(N); // mois sous forme de numéro [0-11]
        let data = new Array(N).fill(0);
        for(let book of this.props.books){
            let p = new Date(book.purchaseDate);
            for(let i in data){
                if (lastMonths[i].month == p.getMonth() && lastMonths[i].year == p.getFullYear()){
                    data[i] += 1;
                }
            }
        }
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{'Nombre de Livres achetés par mois'}</Text>
                <ScrollView horizontal={true}>
                    <LineChart
                        data={{
                            labels: lastMonths.map(item => displayDate(item)),
                            datasets: [ {
                                    data: data,
                                    color: (opacity = 1) => this.props.colors.mainColor,
                                } ],
                        }}
                        width={3*screenWidth}
                        height={220}
                        chartConfig={chartConfig} />
                </ScrollView>
                <Divider style={GlobalStyles.divider}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    }
});

const mapStateToProps = state => ({
	books: state.books,
    colors: state.colors
});

export default connect(mapStateToProps)(Stats);
