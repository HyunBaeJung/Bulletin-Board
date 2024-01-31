import React from 'react'
import { View, Image, Button } from 'react-native'

export default function RootComponent() {
  const img = require('./asset/logo/logo-full.png');
  return (
    <View>
      <Image source={img} />
      <Button title="Click me" onPress={() => { }} />
      <Button title="Click me" onPress={() => { }} />
      <Button title="Click me" onPress={() => { }} />
      <Button title="Click me" onPress={() => { }} />
    </View>
  );
}
