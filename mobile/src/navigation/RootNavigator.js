import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import LoadingState from '../components/LoadingState';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AddScreen from '../screens/AddScreen';
import CompetitionsScreen from '../screens/CompetitionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CompetitionDetailsScreen from '../screens/CompetitionDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const activeKey = props.state.routes[props.state.index].name;
        return <BottomNavigation activeKey={activeKey} onPress={(key) => props.navigation.navigate(key)} />;
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Competitions" component={CompetitionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { initializing } = useAuth();

  if (initializing) return <LoadingState />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="CompetitionDetails"
          component={CompetitionDetailsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
