import { View, Text, StyleSheet, TextInput, Platform, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import Icon from "react-native-vector-icons/Ionicons";

export default function Selector({ setNum, onDelete, id, reps = '', load = '', rpe = '', onChange }) {
  const [localReps, setLocalReps] = useState('');
  const [localLoad, setLocalLoad] = useState('');
  const [localRpe, setLocalRpe] = useState('');


  useEffect(() => {
    setLocalReps(reps && reps !== null && reps !== undefined ? String(reps) : '');
    setLocalLoad(load && load !== null && load !== undefined ? String(load) : '');
    setLocalRpe(rpe && rpe !== null && rpe !== undefined ? String(rpe) : '');
  }, [reps, load, rpe]);

  const handleBlur = () => {
    if (onChange) {
      onChange({ reps: localReps, load: localLoad, rpe: localRpe });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.textDisplay}>{setNum}.</Text>
        <TextInput 
          value={localReps}
          onChangeText={setLocalReps}
          onBlur={handleBlur}
          placeholderTextColor={'#A0A0A0'}
          placeholder='8' 
          style={[styles.textDisplay, {
            backgroundColor: '#F5F5F5', 
            height: '110%',
            borderRadius: 6,
            paddingVertical: 4,
          }]}
          keyboardType='numeric'
          maxLength={2}
        />
        <TextInput 
          value={localLoad}
          onChangeText={setLocalLoad}
          onBlur={handleBlur}
          placeholderTextColor={'#A0A0A0'}
          placeholder='0kg' 
          style={[styles.textDisplay, {
            backgroundColor: '#F5F5F5', 
            height: '110%',
            borderRadius: 6,
            paddingVertical: 4,
          }]}
          keyboardType='numeric'
          maxLength={5}
        />
        <TextInput 
          value={localRpe}
          onChangeText={setLocalRpe}
          onBlur={handleBlur}
          placeholderTextColor={'#A0A0A0'}
          placeholder='@5' 
          style={[styles.textDisplay, {
            backgroundColor: '#F5F5F5', 
            height: '110%',
            borderRadius: 6,
            paddingVertical: 4,
          }]}
          keyboardType='numeric'
          maxLength={2}
        />
      </View>
      <View style={styles.trashContainer}>
        <Pressable onPress={() => onDelete(id)} style={styles.deleteSetStyle}>
          <Icon name='close-outline' size={32} color='#444444'/>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: Platform.OS === 'ios' ? 0.25 : 0.5,
    borderColor: '#C0C0C0',
    width: '95%',
    marginLeft: '7%',
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    justifyContent: 'space-around',
    width: '87%',
  },
  trashContainer: {
    width: '10%',
    alignSelf: 'center',
    marginRight: 24,
    position: 'relative',
  },
  textDisplay: {
    textAlign: 'center',
    padding: 0,
    width: 48,
    fontWeight: 'bold',
    fontSize: 16,
  },

});
