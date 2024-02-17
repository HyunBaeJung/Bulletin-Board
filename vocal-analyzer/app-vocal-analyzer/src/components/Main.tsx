import React from 'react'
import { View, Image, Button } from 'react-native'

export default function Main({ navigation }: { navigation: any }) {
  const img = require('../asset/logo/logo-full.png');
  return (
    <View>
      <Image source={img} />
      <Button title="Main" onPress={() => { navigation.navigate('Main') }} />
      <Button title="One" onPress={() => { navigation.navigate('One') }} />
      <Button title="Second" onPress={() => { navigation.navigate('Second') }} />
      <Button title="Click me" onPress={() => { }} />
    </View>
  )
}
