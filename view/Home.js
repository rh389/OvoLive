/* @flow */
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { NavigationActions } from 'react-navigation';


type Props = {
  dispatch: (action:any) => ?Promise<any>,
  authLoaded: boolean;
  isLoggedIn: boolean;
  nav: any;
  navigation: any;
}

class Home extends React.Component {


  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1}}>
        <Text>Hello world!</Text>
      </View>
    );
  }
}

export default connect(state => ({
  nav: state.nav,
  authLoaded: state.auth.loaded,
  isLoggedIn: state.auth.isLoggedIn
}))(Home);
