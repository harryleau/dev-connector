import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// as we named the rootReducer file as index.js, we dont need to specify its name
import rootReducer from './reducers';
import { WSAEINVALIDPROVIDER } from 'constants';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer, 
  initialState, 
  compose(
    applyMiddleware(...middleware), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;