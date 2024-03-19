import React, { useState } from 'react'
import { View, Image, Button, TextInput } from 'react-native'
import { getUserInfo } from '../library/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

// 화면이동 navigation.navigate('Main')


export default function UserInfo({ navigation }: { navigation: any }) {
  const img = require('../asset/logo/logo-full.png');
  const [id, setId] = useState('')

  AsyncStorage.getItem('loginId').then((res) => {
    console.log("res임 ㅋㅋ", res);
    setId(res);
  });



  const login = async () => {
    console.log("id임", id)
    await getUserInfo(id).then((res) => {
      console.log("??????????????????")
      console.log(res);
    });
  }

  return (
    <View>
      <Button title="Click me" onPress={() => { login(); }} />
    </View>
  )
}
