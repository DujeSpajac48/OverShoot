import { Text, Pressable, View, StyleSheet } from "react-native";
import { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function GenderButton({ onGenderChange }) {
  const [gender, setGender] = useState('Neutral'); 
  
  const genderConfig = [
    {
      value: 'Neutral',
      label: 'Gender',
      icon: <Icon name="genderless" size={20} color="white" />,
      color: '#6C757D'
    },
    {
      value: 'Male',
      label: 'Male',
      icon: <Icon name="mars" size={20} color="white" />,
      color: '#3A86FF'
    },
    {
      value: 'Female',
      label: 'Female',
      icon: <Icon name="venus" size={20} color="white" />,
      color: '#FF006E'
    }
  ];

  const handlePress = () => {
    const nextIndex = (genderConfig.findIndex(g => g.value === gender) + 1) % 3;
    const newGender = genderConfig[nextIndex].value;
    setGender(newGender);
    if (onGenderChange) {
      onGenderChange(newGender); 
    }
  };

  const currentGender = genderConfig.find(g => g.value === gender);

  return (
    <Pressable 
      onPress={handlePress}
      style={[styles.buttonContainer, { backgroundColor: currentGender.color }]}
    >
      <View style={styles.buttonContent}>
        {currentGender.icon}
        <Text style={styles.buttonText}>{currentGender.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    width: "30%",
    borderRadius: 14,
    height: 48, 
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
});
