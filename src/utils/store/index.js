import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import userReducer from './slices/userInfo/userInfoSlice';
import paymentCardReducer from './slices/paymentCards/paymentCardSlice';
import addressReducer from './slices/serviceAddressList/serviceAddressListSlice';
import groomersReducer from './slices/groomersList/groomersListSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cards', 'addresses', 'groomers'],
};

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cards: paymentCardReducer,
  groomers: groomersReducer,
  addresses: addressReducer,
});

// ✅ root reducer with reset logic
const rootReducer = (state, action) => {
  if (action.type === 'auth/logoutUser/fulfilled') {
    // clear everything from redux state
    state = undefined;
    // localStorage & sessionStorage cleanup (persist will re-init fresh)
    storage.removeItem('persist:root');
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

export const persistor = persistStore(store);
export default store;
