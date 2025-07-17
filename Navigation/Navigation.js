import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MainScreen from '../screens/MainScreen';
import ProgramScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewWorkoutScreen from '../screens/CreateNewBlockScreen';
import WeekScreen from '../screens/TrainingBlockScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MainScreen') {
            iconName = 'home';
          } else if (route.name === 'Program') {
            return <FontAwesome5 name="dumbbell" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: Colors.navColor,
          borderTopColor: Colors.mainBorderColor,
        },
      })}
    >
      <Tab.Screen name="Program" component={ProgramScreen} />
      <Tab.Screen name="MainScreen" component={MainScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainScreen">
        <Stack.Screen name="RootTabs" component={TabNavigator} />
        <Stack.Screen name="Program" component={ProgramScreen} />
        <Stack.Screen name="WeekScreen" component={WeekScreen} />
        <Stack.Screen name="NewWorkoutScreen" component={NewWorkoutScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'yellow',
  },
});
