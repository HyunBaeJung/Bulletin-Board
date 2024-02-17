
import React from 'react'

export default function Record() {
  return (
    <div>Record</div>
  )
}



/*
import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { NativeBaseProvider, Box, HStack, VStack, Pressable, Image } from "native-base";

export default function Record() {
  const [recording, setRecording] = React.useState();
  const [recordURI, setRecordURI] = React.useState();

  //녹음 시작
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  //녹음 종료
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordURI(uri);
    console.log('Recording stopped and stored at', uri);
  }

  const playAudio = async () => {
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: recordURI });
    console.log('Playing Sound');
    await sound.replayAsync();
  }

  //녹음파일 삭제
  async function deleteRecordingFile() {
    console.log('Deleting recording..');
    try {
      const info = await FileSystem.getInfoAsync(recordURI);
      await FileSystem.deleteAsync(info.uri)
    } catch (error) {
      console.error('There was an error deleting recording file', error);
    }
  }


  return (
    <NativeBaseProvider>

      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title={'Play Audio'}
        onPress={playAudio}
      />
      <Button
        title={'Delete Recording'}
        onPress={deleteRecordingFile}
      />
    </NativeBaseProvider>
  );
}
*/
