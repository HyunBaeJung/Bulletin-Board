import React from 'react'

//화면 import
import MainPage from "./pages/MainPage";
import OnePage from './pages/OnePage';
import SecondPage from "./pages/SecondPage";


//화면전환 라이브러리
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();


export default function RootComponent() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={MainPage} />
        <Stack.Screen name="One" component={OnePage} />
        <Stack.Screen name="Second" component={SecondPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
