import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import PropTypes from 'prop-types';
import rootReducer from '@/reducers/index.js';

let reduxStore;

const configureStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};

reduxStore = configureStore();

const Store = ({children}) => <Provider store={reduxStore}>{children}</Provider>;
Store.propTypes = {
  children: PropTypes.node,
};

export default Store;
