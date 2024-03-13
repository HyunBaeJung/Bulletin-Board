import React from 'react'
import Login from '../components/Login'
import PrivateAuth from '../library/PrivateAuth'

export default function LoginPage({ navigation }: { navigation: any }) {
  return (
    <Login navigation={navigation} />
  )
}
