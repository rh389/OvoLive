/* @flow */
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Dimensions } from "react-native";
import { NavigationActions } from 'react-navigation';
import { fetchInstant, fetchAccount, fetchToday } from '../modules/ovo';
import type { LiveData, InstantReading } from '../modules/ovo';
import { StockLine } from 'react-native-pathjs-charts'


type Props = {
  instant: InstantReading,
  today: LiveData,
  dispatch: Function
}

class Home extends React.Component<void, Props, void> {
  timer: number;

  componentDidMount() {
    this.props.dispatch(fetchAccount()).then(() => this.props.dispatch(fetchToday())).then(() => this.props.dispatch(fetchInstant()));
    this.timer = setInterval(() => this.props.dispatch(fetchInstant()), 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { instant, today } = this.props;

    const dimensions = Dimensions.get('window');

    if (!instant || !today) {
      return <View/>;
    }

    const data = [today.power.map(point => ({
      startTime: point.startTime,
      instantPower: point.instantPower || 0
    }))];

    let lastHours;

    const tickSeparation = 3600000 * 4;

    const firstTick = data[0][0].startTime - (data[0][0].startTime % tickSeparation);
    const lastTick = data[0][data[0].length-1].startTime;
    const ticks = [];

    for (let tick = firstTick; tick<=lastTick; tick += tickSeparation) {
      ticks.push(tick);
    }

    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{instant.consumption.demand} kW/h {instant.consumption.consumptionPrice.amount.toFixed(2)} £/h</Text>
      <StockLine data={data} options={{
        width: dimensions.width - 50,
        height: dimensions.height - 100,
        color: '#2980B9',
        min: 0,
        margin: {
          top: 20,
          left: 45,
          bottom: 25,
          right: 20
        },
        animate: {
          type: 'delayed',
          duration: 200
        },
        axisX: {
          showAxis: true,
          showLines: true,
          showLabels: true,
          showTicks: false,
          zeroAxis: false,
          orient: 'bottom',
          tickValues: ticks.map(tickValue => ({value: tickValue})),
          label: {
            fontFamily: 'Arial',
            fontSize: 14,
            fontWeight: true,
            fill: '#34495E'
          },
          labelFunction: (v => {
            const d = new Date(v);
            return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
          }),
        },
        axisY: {
          showAxis: true,
          showLines: true,
          showLabels: true,
          showTicks: true,
          zeroAxis: false,
          orient: 'left',

          label: {
            fontFamily: 'Arial',
            fontSize: 14,
            fontWeight: true,
            fill: '#34495E'
          },
          labelFunction: ((v) => {
            return v.toFixed(1);
          }),
        }
      }} xKey='startTime' yKey='instantPower' />
    </View>
  }
}

export default connect(state => ({
  instant: state.instant.lastReading,
  today: state.instant.today
}))(Home);
