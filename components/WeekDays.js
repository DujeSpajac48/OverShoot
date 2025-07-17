import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import SmileBorder from './smiley';
import { useState, useEffect, useCallback, useRef } from 'react';
import DayPreset from './DayPreset';
import { useIsFocused, useRoute, useNavigation } from '@react-navigation/native';
import initDB from '../SQLite/database';


import * as Animatable from 'react-native-animatable';

export default function WeekDays({ id, userId, blockId }) {
  const [weekId, setWeekId] = useState(null);
  const [days, setDays] = useState([]); 
  const [db, setDb] = useState(null);
  const [Program, setProgram] = useState([]);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const dbRef = useRef(null);


  const getOrCreateWeekId = useCallback(async (dbConn, weekNum) => {
    try {
      const existing = await dbConn.getFirstAsync(
        `SELECT id FROM weeks WHERE blockId = ? AND weekNum = ? AND userId = ?`,
        [blockId, weekNum, userId]
      );
      if (existing?.id) return existing.id;

      const { lastInsertRowId } = await dbConn.runAsync(
        `INSERT INTO weeks (blockId, weekNum, userId) VALUES (?, ?, ?)`,
        [blockId, weekNum, userId]
      );

      return lastInsertRowId;
    } catch (e) {
      console.error('Error in get or create week:', e);
      return null;
    }
  }, [blockId, userId]);

  
  const fetchDays = useCallback(async (weekId) => {
    try {
      const db = await initDB();
      const result = await db.getAllAsync(
        `SELECT * FROM day WHERE weekId = ? ORDER BY dayNum ASC`,
        [weekId]
      );
      setDays(result); 
    } catch (e) {
      console.error('Error fetching days:', e);
    }
  }, []);

  useEffect(() => {
    const loadWeekData = async () => {
      try {
        const dbConn = await initDB();
        const actualWeekId = await getOrCreateWeekId(dbConn, id);

        if (actualWeekId) {
          setWeekId(actualWeekId);
          await fetchDays(actualWeekId);
        }
      } catch (e) {
        console.error('Error loading week data:', e);
      }
    };

    if (userId) loadWeekData();
  }, [id, userId, getOrCreateWeekId, fetchDays]);


  const handleAddDay = async () => {
    if (!weekId) {
      Alert.alert("Error", "Week has not been created");
      return;
    }

    try {
      const dbConn = await initDB();
      const nextDayNum = await getNextDayNum(dbConn, weekId);
      

      const dayId = await dbConn.runAsync(
        `INSERT INTO day (weekId, dayNum, muscleGroup) VALUES (?, ?, ?)`,
        [weekId, nextDayNum, "Muscle Group"] 
      );

      setJustAddedDayId(dayId); 
      await fetchDays(weekId);
    } catch (e) {
      console.error('Failed to add day:', e);
      Alert.alert("Error", "Day could not be added");
    }
  };


  const getNextDayNum = async (dbConn, weekId) => {
    const daysResult = await dbConn.getFirstAsync(
      `SELECT COUNT(*) AS count FROM day WHERE weekId = ?`,
      [weekId]
    );
    return (daysResult?.count || 0) + 1;
  };

  //  removing the last day
  const handleRemoveDay = async () => {
    if (!weekId || days.length <= 1) {
      Alert.alert("Warning", "There must be at least one day");
      return;
    }

    try {
      const db = await initDB();
      const result = await db.getFirstAsync(
        `SELECT id FROM day WHERE weekId = ? ORDER BY dayNum DESC LIMIT 1`,
        [weekId]
      );
      if (result?.id) {
        await db.runAsync(`DELETE FROM day WHERE id = ?`, [result.id]);
        await fetchDays(weekId);
      }
    } catch (e) {
      console.error('Error deleting day:', e);
    }
  };


  useEffect(() => {
    if (!db) return;

    const fetchData = async () => {
      try {
        const data = await db.getAllAsync('SELECT * FROM workouts ORDER BY createdAt ASC');
        setProgram(data);
        console.log('Workouts data: ', data);
      } catch (e) {
        Alert.alert("Error", "Workouts data could not be loaded");
        console.log('Error fetching workouts:', e);
      }
    };

    fetchData();
  }, [db, isFocused]);

  const [justAddedDayId, setJustAddedDayId] = useState(null);

  return (
    <>
      <Animatable.View
        style={styles.headerTextContainer}
        animation='slideInLeft'
        duration={500}
      >
        <Text style={{ fontSize: 40 }}>Week {id}</Text>
      </Animatable.View>

      <View style={styles.mainContainer}>
        <View style={styles.daysContainer}>
          {days.map((day, index) => (
            <DayPreset
              key={day.id}  
              dayNum={day.dayNum}
              muscleGroup={day.muscleGroup}
              id={id}
              userId={userId}
              onPress={() => {
                navigation.navigate('Program', {
                  userId: userId,
                  dayId: day.id,
                  dayNum: day.dayNum
                });
              }}
            />
          ))}

          <View style={styles.butttonContainer}>
            <Pressable style={styles.addDay} onPress={handleRemoveDay}>
              <Icon name="close-circle-outline" size={36} color={'red'} />
            </Pressable>
            <Pressable
              style={styles.addDay}
              onPress={weekId ? handleAddDay : null}
            >
              <Icon name="add-circle-outline" size={36} color={weekId ? 'green' : 'gray'} />
            </Pressable>
          </View>

          <SmileBorder />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerTextContainer: {
    marginTop: 12,
    paddingLeft: 20,
  },
  daysContainer: {
    height: '100%',
    alignItems: 'center',
  },
  addDay: {},
  butttonContainer: {
    flexDirection: 'row',
    width: '48%',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
