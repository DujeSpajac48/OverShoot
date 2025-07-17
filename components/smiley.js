import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Svg height="50" width="180" viewBox="0 0 180 20" style={styles.svg}>
        <Path
          d="M 50,15 Q 90,50 140,15"
          stroke="black"
          strokeWidth="0.5"
          fill="transparent"
          strokeDasharray="5,5"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0, 
    marginTop: -24,
  },
  svg: {
    margin: 0, 
  },
});
