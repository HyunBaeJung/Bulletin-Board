import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
import { postLogin } from '../library/api'
import { userStore } from '../store/userStore';

export default function Login({ navigation }: { navigation: any }) {

  const { userId, setId, password, setPassword } = userStore();

  const login = async () => {
    await postLogin(userId, password).then((res) => {
      if (res?.status === 'OK') {
        navigation.navigate('Start');
      } else if (res?.status === 'FAIL') {
        alert('아이디와 비밀번호를 확인해주세요');
      }
    });
  }

  return (
    <View>
      <TextInput placeholder="Enter your name" onChangeText={setId} />
      <TextInput placeholder="Enter your password" onChangeText={setPassword} />
      <Button title="Click me" onPress={() => { login(); }} />
      <Button title='log' onPress={() => { console.log('MUD : ', userId, password) }} />
    </View>
  )
}
