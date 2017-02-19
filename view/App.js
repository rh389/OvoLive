/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import { addNavigationHelpers, NavigationActions, StackNavigator } from 'react-navigation';
import Home from './Home';
import Login from './Login';
import { init as initAuth } from '../modules/auth';

export const AppNavigator = StackNavigator({
  Home: { screen: Home },
  Login: { screen: Login }
}, {
  headerMode: 'none',
  mode: 'modal'
});
AppNavigator.defaultProps = {
  gesturesEnabled: false
};

type Props = {
  dispatch: (action: any) => ?Promise<any>,
  authLoaded: boolean;
  isLoggedIn: boolean;
  nav: any;
  navigation: any;
}

class AppWithNavigationState extends React.Component<void, Props, void> {

  componentDidMount() {
    this.props.dispatch(initAuth());
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.authLoaded && nextProps.authLoaded && !nextProps.isLoggedIn) {
      nextProps.dispatch(NavigationActions.navigate({ routeName: 'Login' }));
    }
  }

  render() {
    const { authLoaded, nav, dispatch } = this.props;

    if (!authLoaded) {
      return <View />;
    }

    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch,
        state: nav,
      })}/>
    );
  }
}

export default connect(state => ({
  nav: state.nav,
  authLoaded: state.auth.loaded,
  isLoggedIn: state.auth.isLoggedIn
}))(AppWithNavigationState);
