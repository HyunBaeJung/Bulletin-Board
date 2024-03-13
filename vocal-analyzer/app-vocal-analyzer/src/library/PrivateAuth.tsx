import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function PrivateAuth({ navigation }: { navigation: any }) {
  AsyncStorage.getItem('loginId').then((res) => {
    if (res === null) {
      navigation.navigate('Login')
    }
  })

  return (<></>);
}
