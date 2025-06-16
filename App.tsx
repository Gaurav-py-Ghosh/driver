import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './components/HomeScreen';
import BonusScreen from './components/BonusScreen';
import PlansScreen from './components/PlansScreen'; 
import './global.css';

export type RootStackParamList = {
  Home: undefined;
  Bonus: undefined;
  Plans: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Bonus" component={BonusScreen} />
        <Stack.Screen name="Plans" component={PlansScreen} />
        {/* <Tab.Screen name="Inbox" component="" /> */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
