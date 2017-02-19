/* @flow */

import { AsyncStorage } from 'react-native';

export function init() {
  return (dispatch, getState) => {
    return Promise.all([
      AsyncStorage.getItem('app:username'),
      AsyncStorage.getItem('app:password'),
      AsyncStorage.getItem('app:token')
    ]).then(results => {
      dispatch({
        type: 'AUTH_INIT',
        payload: {
          username: results[0],
          password: results[1],
          token: results[2]
        }
      })
    });
  }
}

export function setAuth({ username, password, authResponse }) {
  return (dispatch, getState) => {
    return Promise.all([
      AsyncStorage.setItem('app:username', username),
      AsyncStorage.setItem('app:password', password),
      AsyncStorage.setItem('app:token', authResponse.token)
    ]).then(results =>
      dispatch({
        type: 'AUTH_SET',
        payload: {
          username: username,
          password: password,
          token: authResponse.token
        }
      }));
  }
}

export default function (state = { loaded: false }, action) {
  if (action.type === 'AUTH_INIT') {
    if (!action.payload.username) {
      return {
        loaded: true,
        isLoggedIn: false
      }
    }
    const { username, password, token } = action.payload;
    return {
      loaded: true,
      isLoggedIn: !!((username && password) || token),
      username,
      password,
      token
    }
  }
  return state;
};
