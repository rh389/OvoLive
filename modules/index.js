/* @flow */
import { combineReducers } from 'redux';
import { AppNavigator } from '../view/App';

const rootReducer = combineReducers({
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
});

export default rootReducer;
