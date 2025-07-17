import { Text, View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import initDB from '../SQLite/database';
import * as Animatable from 'react-native-animatable';

export default function DaysPreset({ dayNum, id: weekId }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutId, userId } = route.params;
  const [muscleGroup, setMuscleGroup] = useState('');
  const [db, setDb] = useState(null);

  useEffect(() => {
    const loadDbAndFetch = async () => {
      try {
        const dbConn = await initDB();
        setDb(dbConn);
        const results = await dbConn.getAllAsync(
          `SELECT muscleGroup FROM day WHERE dayNum = ? AND weekId = ?`,
          [dayNum, weekId]
        );
        if (results.length > 0) {
          setMuscleGroup(results[0].muscleGroup);
        }
      } catch (e) {
        console.error('DB Error:', e);
        Alert.alert('Error', "An issue occurred while trying to open the database.");
      }
    };
    loadDbAndFetch();
  }, []);

  const handleEnterProgram = async () => {
    if (!muscleGroup) {
      Alert.alert('Erorr', 'Enter Muscle Group');
      return;
    }

    try {
      await db.withTransactionAsync(async () => {
        const existing = await db.getFirstAsync(
          `SELECT id FROM day WHERE dayNum = ? AND weekId = ?`,
          [dayNum, weekId]
        );

        if (existing) {
          await db.runAsync(
            `UPDATE day SET muscleGroup = ? WHERE id = ?`,
            [muscleGroup, existing.id]
          );
        } else {
          await db.runAsync(
            `INSERT INTO day (dayNum, weekId, muscleGroup) VALUES (?, ?, ?)`,
            [dayNum, weekId, muscleGroup]
          );
        }
      });

      const dayResult = await db.getFirstAsync(
        `SELECT id FROM day WHERE dayNum = ? AND weekId = ?`,
        [dayNum, weekId]
      );

      if (dayResult?.id) {
        navigation.navigate('Program', {
          dayId: dayResult.id,
          dayNum,
          userId,
          id: weekId,
        });
      } else {
        Alert.alert("Error", "Cant find dayId");
      }

    } catch (e) {
      console.error('Insert/Update error:', e);
      Alert.alert('Error', 'Change was not saved.');
    }
  };

  return (
    <Animatable.View
      animation='slideInLeft'
      duration={500}
      style={styles.dayButton}
    >
      <Text style={styles.dayText}>Day {dayNum}</Text>

      <TextInput
        placeholder='Muscle Group'
        placeholderTextColor={'#888'}
        value={muscleGroup}
        onChangeText={setMuscleGroup}
      />

      <Animatable.View
        animation='swing'
        duration={3000}
        delay={600}
      >
        <Pressable onPress={handleEnterProgram}>
          <Icon name='enter-outline' size={24} />
        </Pressable>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  dayButton: {
    borderColor: '#555',
    borderWidth: 0.4,
    width: '92%',
    height: 62,
    justifyContent: 'center',
    marginVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    color: '#000',
  },
  dayText: {
    fontWeight: '500',
  },
});
