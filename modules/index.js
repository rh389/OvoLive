/* @flow */
import { combineReducers } from 'redux';
import { AppNavigator } from '../view/App';
import instant from './ovo';
import auth from './auth';

const rootReducer = combineReducers({
  auth,
  instant,
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
});

export default rootReducer;
