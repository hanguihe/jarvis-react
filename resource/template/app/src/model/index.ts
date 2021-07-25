import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({});

const store = configureStore({ reducer });

export default store;

export type ReduxState = ReturnType<typeof reducer>;
