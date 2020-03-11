// Default redux createStore function.
import { createStore, applyMiddleware } from 'redux';

// Logger/debugger for Redux store:
// https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production.
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

// Persistent storage. Defaults to localStorage for web.
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all our reducers.
import reducers from './reducers';

// Create config for persistent storage.
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['lesson'],
}

// Connect persistent storage to reducers.
const persistedReducer = persistReducer(persistConfig, reducers);

// Build store.
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware()),
);

const persistor = persistStore(store)

export { store, persistor };
