// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Navigation from './Navigation/Navigation';
import store from './store/store';

import ProfileScreen from './screens/ProfileScreen';
export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='white' />
       {/* <Navigation /> */}

       <ProfileScreen></ProfileScreen>
       </>
  );
}
