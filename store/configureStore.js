import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../modules';

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunkMiddleware),
      global.reduxNativeDevTools ?
        global.reduxNativeDevTools(/*options*/) :
        noop => noop
    )
  );

  if (global.reduxNativeDevTools) {
    global.reduxNativeDevTools.updateStore(store);
  }

  return store;
}
