import { Text, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

import WeekDays from '../components/WeekDays';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import initDB from '../SQLite/database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function WeekScreen() {
  const route = useRoute();
  const userId = route.params?.userId;  
  const blockId = route.params?.blockId;
  const [weeks, setWeeks] = useState([]);
  
  console.log('UserId:', userId);

  const fetchData = async (userId) => {
    try {
      const dbConn = await initDB();

      const data = await dbConn.getAllAsync(
        `SELECT duration FROM users WHERE id = ?`, 
        [userId]
      );
      console.log("Data:", data);
      const brojTjedana = data[0]?.duration || 1;
      console.log('Broj tjedana:', brojTjedana);
  

      
      const weeksArray = Array.from({ length: brojTjedana }, (_, i) => ({ id: i + 1 }));
  
      setWeeks(weeksArray);
      console.log('Rezultat:', weeksArray);
    } catch (e) {
      console.error('Datbase info error', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const refreshWeeks = async () => {
        if (userId) {
          await fetchData(userId); 
        } else {
          Alert.alert('Greška', 'ID korisnika nije pronađen');
        }
      };

      refreshWeeks();

      return () => {
        setWeeks([]);
      };
    }, [userId])
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {weeks.map((w) => (
          <WeekDays 
            key={w.id} 
            id={w.id} 
            userId={userId}
            blockId={blockId}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
