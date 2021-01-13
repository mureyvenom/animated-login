import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainImage from './src/components/MainImage';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <MainImage />
      <StatusBar backgroundColor='#fff' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
