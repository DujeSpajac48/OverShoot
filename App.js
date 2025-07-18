import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation/Navigation';
import store from './store/store';



export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Navigation />
    </Provider>
  );
}
