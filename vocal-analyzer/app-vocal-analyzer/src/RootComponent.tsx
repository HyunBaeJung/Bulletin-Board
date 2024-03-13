import React from 'react'

//화면 import
import Login from './components/Login';
import UserInfo from './components/UserInfo';
import MainPage from "./pages/MainPage";
import AsyncStorage from '@react-native-async-storage/async-storage';


//화면전환 라이브러리
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from 'react';



const Stack = createStackNavigator();

export default function RootComponent() {

  const [isLogin, setIsLogin] = useState(false);

  AsyncStorage.getItem('loginId').then((res) => {
    console.log(res);
    if (res !== null) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  })

  if (isLogin) {
    //로그인 O
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
          <Stack.Screen name="Start" component={MainPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );

  } else {
    //로그인 X
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
