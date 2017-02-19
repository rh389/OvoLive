/* @flow */

import { AsyncStorage } from 'react-native';

type Thunk = (dispatch: (action: any) => Promise<any>, getState: () => any) => Promise<any>;

export function attemptLogin(username: string, password: string): Thunk {
  return (dispatch, getState) => {
    return fetch('https://my.ovoenergy.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
        'Origin': 'https://my.ovoenergy.com'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(res => res.json().then(body => ({ body, status: res.status })))
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.body.message);
        }
        return response.body;
      })
      .then((authResponse) => dispatch(setAuth({ username, password, authResponse })))
  }
}

export function init(): Thunk {
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

export function setAuth({ username, password, authResponse }:{ username: string, password: string, authResponse: { token: string } }): Thunk {
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

  if (action.type === 'AUTH_SET') {
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
