import React, { useState } from 'react'
import { View, Image, Button, TextInput } from 'react-native'
import { postLogin } from '../library/api'

// 화면이동 navigation.navigate('Main')

export default function Login({ navigation }: { navigation: any }) {
  const img = require('../asset/logo/logo-full.png');
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    await postLogin(id, password).then((res) => {
      console.log("??????????????????")
      navigation.navigate('Start')
    });
  }

  return (
    <View>
      <TextInput placeholder="Enter your name" onChangeText={setId} />
      <TextInput placeholder="Enter your password" onChangeText={setPassword} />
      <Button title="Click me" onPress={() => { login(); }} />
    </View>
  )
}
