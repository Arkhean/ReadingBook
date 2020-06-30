/*
 * author: Julien Miens
 * date: june 2020
 * description: statistiques sur la bibliothèque
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import GlobalStyles from './styles';
import { View, Text } from 'react-native-animatable';
import { Divider } from 'react-native-elements';
import { ConnectedHomeButton as HomeButton, ConnectedHeaderButton as HeaderButton } from './Buttons';
import { genres } from './book';
import { colors } from './ColorPicker';
import { connect } from "react-redux";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

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
    return (month < 10 ? '0'+month : month) + '/' + year.toString().slice(-2);
}

class Stats extends Component {
    constructor(props){
        super(props);
        this.state = { labels: [],
                        bought: [],
                        read: [],
                        expense: [],
                        genreCount: [],
                        initialized: false };

        this.props.navigation.setOptions({
            title: 'Statistiques sur 24 mois',
        });
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            this.setState({initialized: false}, () => {
                let data = this.generateData();
                this.setState(data);
            })
        });
    }

    generateData = () => {
        const N = 24;
        const lastMonths = getLastMonth(N);
        let bought = new Array(N).fill(0);
        let read = new Array(N).fill(0);
        let expense = new Array(N).fill(0);
        let genreCount = genres.map((name,i) => {return {name: name,
                                                            n: 0,
                                                            color: colors[i],
                                                            legendFontColor: colors[i]}
                                                });

        for(let book of this.props.books){
            /* récupération du nombre de livres achetés ainsi que du prix total */
            let p = new Date(book.purchaseDate);
            for(var i = 0; i < N; i++){
                if (lastMonths[i].month == p.getMonth()
                    && lastMonths[i].year == p.getFullYear()){
                    bought[i] += 1;
                    expense[i] += parseFloat(book.price);
                }
            }
            /* récupération des livres lus */
            for(let dates of book.readingDates){
                let start = new Date(dates.start);
                let end = new Date(dates.end);
                for(var i = 0; i < N; i++){
                    if (start.getMonth() == lastMonths[i].month
                        && start.getFullYear() == lastMonths[i].year){
                        read[i] += 1;
                    }
                    if (end.getMonth() == lastMonths[i].month
                        && end.getFullYear() == lastMonths[i].year){
                        read[i] += 1;
                    }
                }
            }
            /* comptage des genres */
            genreCount[genres.indexOf(book.genre)].n += 1;
        }
        const labels = lastMonths.map(item => displayDate(item));
        return { labels: labels, bought: bought, read: read,
                    expense: expense.map(e => parseFloat(e.toFixed(2))), genreCount: genreCount,
                initialized: true };
    }

    render() {
        const chartConfig = {
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: () => this.props.colors.secondaryColor,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        };

        if (!this.state.initialized){
            return (
                <ActivityIndicator
                    size={50}
                    color={this.props.colors.secondaryColor}
                    animating={true}
                    style={{flex: 1, alignSelf: 'center'}}/>
            );
        }
        /* else */
        return (
            <ScrollView style={styles.view}>
                <Text style={styles.title}>{'Nombre de Livres achetés par mois'}</Text>
                <ScrollView horizontal={true}>
                    <LineChart
                        data={{
                            labels: this.state.labels,
                            datasets: [ {
                                    data: this.state.bought,
                                    color: (opacity = 1) => this.props.colors.mainColor,
                                } ],
                        }}
                        width={3*screenWidth}
                        height={220}
                        chartConfig={chartConfig} />
                </ScrollView>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.title}>{'Argent dépensé par mois'}</Text>
                <ScrollView horizontal={true}>
                    <LineChart
                        data={{
                            labels: this.state.labels,
                            datasets: [ {
                                    data: this.state.expense,
                                    color: (opacity = 1) => this.props.colors.mainColor,
                                } ],
                        }}
                        width={3*screenWidth}
                        height={220}
                        chartConfig={chartConfig} />
                </ScrollView>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.title}>{'Nombre de Livres lus par mois'}</Text>
                <ScrollView horizontal={true}>
                    <LineChart
                        data={{
                            labels: this.state.labels,
                            datasets: [ {
                                    data: this.state.read,
                                    color: (opacity = 1) => this.props.colors.mainColor,
                                } ],
                        }}
                        width={3*screenWidth}
                        height={200}
                        chartConfig={chartConfig} />
                </ScrollView>
                <Divider style={GlobalStyles.divider}/>
                <Text style={styles.title}>{'Nombre de Livres par genre'}</Text>
                <PieChart
                    data={this.state.genreCount}
                    width={screenWidth}
                    height={250}
                    chartConfig={chartConfig}
                    accessor="n"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </ScrollView>
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
