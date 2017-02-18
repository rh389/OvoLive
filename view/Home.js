/* @flow */
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

class Home extends React.Component {
  render() {
    return (
      <View>
        <Text>Hello world!</Text>
      </View>
    );
  }
}

export default connect(state => ({
  nav: state.nav,
}))(Home);
