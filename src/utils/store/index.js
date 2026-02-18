import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboard/dashboardSlice';
import appointmentsReducer from './slices/appointments/appointmentsSlice';
import authReducer from './slices/auth/authSlice';
import userReducer from './slices/userInfo/userInfoSlice';
import paymentCardReducer from './slices/paymentCards/paymentCardSlice';
import addressReducer from './slices/serviceAddressList/serviceAddressListSlice';
import groomersReducer from './slices/groomersList/groomersListSlice';
import petsReducer from './slices/petList/petListSlice';
import inboxReducer from './slices/inbox/inboxSlice';
import bookingFlowReducer from './slices/booking-flow/bookingFlowSlice';
import reviewsReducer from './slices/reviews/reviewsSlice';
import packagesReducer from './slices/packages/packagesSlice';
import notificationsPreferencesReducer from './slices/notifications-preferences/notificationsPreferencesSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dashboard', 'appointments', 'inbox', 'auth', 'user', 'cards', 'addresses', 'groomers', 'pets', 'notifications_preferences', 'bookingFlow', 'reviews', 'packages'],
};

const appReducer = combineReducers({
  dashboard: dashboardReducer,
  appointments: appointmentsReducer,
  auth: authReducer,
  user: userReducer,
  cards: paymentCardReducer,
  groomers: groomersReducer,
  addresses: addressReducer,
  pets: petsReducer,
  inbox: inboxReducer,
  notifications_preferences: notificationsPreferencesReducer,
  bookingFlow: bookingFlowReducer,
  reviews: reviewsReducer,
  packages: packagesReducer,
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
