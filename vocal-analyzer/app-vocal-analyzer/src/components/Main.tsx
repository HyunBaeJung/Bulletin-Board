import React from 'react'
import { View, Image, Button, TextInput } from 'react-native'

export default function Main({ navigation }: { navigation: any }) {
  const img = require('../asset/logo/logo-full.png');
  return (
    <View>
      <Image source={img} />
      <TextInput placeholder="Enter your name" />

      <Button title="Main" onPress={() => { navigation.navigate('Main') }} />
      <Button title="UserInfo" onPress={() => { navigation.navigate('UserInfo') }} />
      <Button title="Second" onPress={() => { navigation.navigate('Second') }} />
      <Button title="Click me" onPress={() => { }} />
    </View>
  )
}
