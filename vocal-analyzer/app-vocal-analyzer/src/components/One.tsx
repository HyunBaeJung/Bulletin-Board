import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'
import { styles } from './styles/common'

export default function One({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container} >
      <View style={styles.topSection}>
      </View>
      <View style={styles.middleSection}>
        <TextInput style={styles.commonTextInput} placeholder='Your course goal!' />
        <Button title='Add Goal' />
      </View>
      <View style={styles.bottomSection}>
        <Text>List of goals</Text>
      </View>
    </View>
  )
}

