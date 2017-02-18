/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import Home from './Home';

export const AppNavigator = StackNavigator({
  Home: { screen: Home }
});

class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })}/>
    );
  }
}

export default connect(state => ({
  nav: state.nav,
}))(AppWithNavigationState);
