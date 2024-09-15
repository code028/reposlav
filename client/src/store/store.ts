import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import sessionReducer from './slices/sessionSlice';
import userReducer from './slices/userSlice';
import { apiSlice } from './api/apiSlice';
import { sessionApiSlice } from './api/sessionSlice';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['session', 'user'],
};

const rootReducer = combineReducers({
	session: sessionReducer,
	user: userReducer,
	[apiSlice.reducerPath]: apiSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
			  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		 }).concat(apiSlice.middleware, sessionApiSlice.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;