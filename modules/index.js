/* @flow */
import { combineReducers } from 'redux';
import { AppNavigator } from '../view/App';
import auth from './auth';

const rootReducer = combineReducers({
  auth,
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
});

export default rootReducer;
