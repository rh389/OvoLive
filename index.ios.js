/* @flow */

import React from 'react';
import { AppRegistry, View } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './view/App';

const store = configureStore();

function OvoLiveProvider(props: any) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

AppRegistry.registerComponent('OvoLive', () => OvoLiveProvider);
