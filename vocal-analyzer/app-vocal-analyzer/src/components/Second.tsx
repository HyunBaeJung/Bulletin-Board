import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import axios from 'axios'

export default function Second({ navigation }: { navigation: any }) {

  const [data, setData] = useState("zz")

  const login = async () => {
    await axios.post('http://localhost:8000/auth/login', {
      "userId": "gusqo104",
      "password": "1234"
    }).then((res) => {
      console.log(res.data)
      setData(res.data)
    }).catch((err) => {
      setData("error");
      console.log(err)
    })
  }
  return (
    <View>
      <Text>{data}</Text>
      <Button title="login" onPress={login} />
    </View>
  )
}
