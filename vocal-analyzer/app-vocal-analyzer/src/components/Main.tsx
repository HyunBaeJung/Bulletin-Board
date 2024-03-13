import React from 'react'
import { View, Image, Button, TextInput } from 'react-native'
import { postLogout } from '../library/api'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Main({ navigation }: { navigation: any }) {
  const id = AsyncStorage.getItem('loginId');
  const logout = async () => {
    await postLogout(id).then((res) => {
      console.log("??????????????????")
      navigation.navigate('Login')
    });
  }

  const img = require('../asset/logo/logo-full.png');
  return (
    <View>
      <Image source={img} />
      <TextInput placeholder="Enter your name" />

      <Button title="Main" onPress={() => { navigation.navigate('Main') }} />
      <Button title="UserInfo" onPress={() => { navigation.navigate('UserInfo') }} />
      <Button title="Second" onPress={() => { navigation.navigate('Second') }} />
      <Button title="Click me" onPress={() => { logout() }} />
    </View>
  )
}
