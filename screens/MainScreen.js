import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import BlockButton from '../components/MainScreenComponents/BlockButton';
import Colors from '../constants/Colors';
import { useNavigation } from "@react-navigation/native";


import initDB from '../SQLite/database';
import { useIsFocused } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();


  const [db, setDb] = useState(null);
  const [workout, setWorkout] = useState([]);


  useEffect(() => {
    const loadDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
      } catch (error) {
        Alert.alert("Greška", "Greška pri otvaranju baze NewBlock");
      }
    };
    loadDB();
  }, []);


  const isFocused = useIsFocused();

  useEffect(() => {
    if (!db) return;

    const fetchData = async () => {
      try {
        const data = await db.getAllAsync('SELECT * FROM users ORDER BY createdAt DESC');
        setWorkout(data);
        console.log("baza ", data);
      } catch (error) {
        Alert.alert("Error", "Data wasn't fetched MainScreen");
      }
    };

    fetchData();
  }, [db, isFocused]);

  const sortedWorkouts = [...workout].reverse();

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.headerContainer}>
          <Text style={styles.textStyle}>OVER</Text>
          <Text style={styles.textStyleShot}>SHOOT</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <View style={styles.workoutButtonContainer}>
            <View style={styles.deleteButton}>
              <Pressable
                onPress={() => {
                  if (workout.length > 0) {
                    deleteWorkoutDay(workout[0].id);
                  }
                }}
              >
                <Text style={{ color: 'white' }}>Delete Workout</Text>
              </Pressable>
            </View>

            <View style={styles.newButton}>
              <Pressable onPress={() => navigation.navigate('NewWorkoutScreen')}>
                <Text style={{ color: 'white' }}>New Workout</Text>
              </Pressable>
            </View>
          </View>

          {sortedWorkouts.map(w => (
            <BlockButton
              key={w.id}
              id={w.id}
              title={w.split}
              difficulty={w.diff}
              duration={w.duration}
              programType={w.focus}
              date={w.createdAt || 'N/A'}
              imageSource={w.image}
              onPress={() => navigation.navigate('WeekScreen', {
                userId: w.id,
                blockId: w.id,
                workoutId: w.id,
                workoutData: w
              })}
              onDelete={() => {
                Alert.alert(
                  "Delete Workout",
                  "Are you sure you want to delete this workout?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      onPress: async () => {
                        await db.runAsync(`DELETE FROM users WHERE id = ?`, [w.id]);
                        const data = await db.getAllAsync('SELECT * FROM users ORDER BY createdAt DESC');
                        setWorkout(data);
                      }
                    }
                  ]
                );
              }}
            />
          ))}

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: Colors.mainBackground,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 4,
    fontSize: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 0.6,
    marginHorizontal: '7%',
    backgroundColor: Colors.mainBackground,
  },
  textStyle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'darkred',
  },
  textStyleShot: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'lightblue',
  },
  scrollContainer: {
    backgroundColor: Colors.mainBackground,
    flexGrow: 1,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  workoutButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '6%',
    maxHeight: '6%',
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '32%',
  },
  newButton: {
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '32%',
  },
});
