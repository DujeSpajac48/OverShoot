
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import Colors from '../constants/Colors';
import Workout from '../components/Workout';

import { useRoute } from '@react-navigation/native';


import { getWorkoutsForDay, addWorkoutForDay, updateWorkout, deleteWorkout } from '../SQLite/saveWorkoutData';

export default function ProgramScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);


  const [workouts, setWorkouts] = useState([]);
  const { dayNum, userId, workoutId, dayId } = useRoute().params;


  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getWorkoutsForDay(dayId);
      setWorkouts(data);
    };
    fetchWorkouts();
  }, [dayId]);


  const handleAddWorkout = async () => {
    await addWorkoutForDay(dayId, userId, '', 1, 0, 0, 0); //name  setNum  reps  load  rpe
    const data = await getWorkoutsForDay(dayId);
    setWorkouts(data);
  };


  const handleUpdateWorkout = async (workoutId, fields) => {
    await updateWorkout(workoutId, fields);

    setWorkouts(prev => prev.map(w => w.id === workoutId ? { ...w, ...fields } : w));
  };


  const handleDeleteWorkout = async (workoutId) => {
    await deleteWorkout(workoutId);
    const data = await getWorkoutsForDay(dayId);
    setWorkouts(data);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')} : ${minutes
      .toString()
      .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.headerContainer}>
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>Day {dayNum}</Text>
          </View>
          <Pressable
            onPress={handleStartStop}
            style={({ pressed }) => [
              styles.stopericaContainer,
              pressed && styles.pressedStyle,
            ]}
          >
            <View>
              <Text style={styles.startStopText}>
                {!isRunning ? 'Start' : 'Stop'}
              </Text>
              <Text> {formatTime(time)}</Text>
            </View>
          </Pressable>
          <View style={styles.SaveContainer}>
            <Text style={styles.dayText}> Save</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            >
              {workouts.map((item) => (
                <Workout
                  key={item.id}
                  id={item.id}
                  userId={userId}
                  dayId={dayId}
                  name={item.name}
                  setNum={item.setNum}
                  reps={item.reps}
                  load={item.load}
                  rpe={item.rpe}
                  toDelete={() => handleDeleteWorkout(item.id)}
                  onChange={fields => handleUpdateWorkout(item.id, fields)}
                />
              ))}
            </ScrollView>
          </TouchableWithoutFeedback>
          <Button onPress={handleAddWorkout} title="Add exercise" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  headerContainer: {
    borderBottomWidth: 0.2,
    borderColor: '#555555',
    height: '8%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayContainer: {},
  dayText: {
    fontWeight: 'semibold',
    fontSize: 20,
  },
  stopericaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  SaveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  startStopText: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  pressedStyle: {
    transform: [{ scale: 1.1 }],
  },
  container: {},
  contentContainer: {
    paddingBottom: 24,
  },
});
