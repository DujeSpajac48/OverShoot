import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState, useEffect } from "react";
import Selector from "./Selector";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from "react-native-vector-icons/Ionicons";
import { getSetsForWorkout, addSetToWorkout, updateSet, deleteSet } from '../SQLite/saveWorkoutData';

function Workout({ children, id, userId, dayId, toDelete, name, setNum, reps, load, rpe, onChange }) {
   const [sets, setSets] = useState([]);
   const [exerciseName, setExerciseName] = useState(name || "");

   useEffect(() => {
      if (!id) return;
      getSetsForWorkout(id).then(setovi => setSets(setovi));
   }, [id]);

   const handleAddSet = async () => {
      if (!id) return;
      await addSetToWorkout(id, 0, 0, 0); 
      const setovi = await getSetsForWorkout(id);
      setSets(setovi);
   };

   const handleUpdateSet = async (setId, newVals) => {
      const reps = newVals.reps === '' ? null : Number(newVals.reps);
      const load = newVals.load === '' ? null : Number(newVals.load);
      const rpe = newVals.rpe === '' ? null : Number(newVals.rpe);
      await updateSet(setId, { reps, load, rpe });
      const setovi = await getSetsForWorkout(id);
      setSets(setovi);
   };

   const handleDeleteSet = async (setId) => {
      await deleteSet(setId);
      const setovi = await getSetsForWorkout(id);
      setSets(setovi);
   };

   useEffect(() => {
      if (onChange) {
         onChange({
            name: exerciseName,
            setNum,
            reps,
            load,
            rpe,
         });
      }
   }, [exerciseName]);

   return (
      <>
         <View style={styles.workoutContainer}>
            <View style={styles.headerRowContainer}>
               <TextInput
                  style={styles.headerText}
                  placeholder="✎ Exercise"
                  value={exerciseName}
                  onChangeText={setExerciseName}
               />
               <Pressable onPress={() => toDelete(id)} style={styles.headerButtonStyle}>
                  <Ionicons name="trash-outline" size={26} color="#444444" />
               </Pressable>
            </View>

            <View style={styles.rowContainer}>
               <Text style={styles.rowHeader}>Set</Text>
               <Text style={styles.rowHeader}> Reps</Text>
               <View style={styles.inputHeader}>
                  <Text style={styles.rowHeader}>Load</Text>
                  <Text style={styles.rowHeader}>RPE </Text>
               </View>
            </View>

            {sets.map((set, index) => (
               <Selector
                  key={set.id}
                  setNum={index + 1}
                  id={set.id}
                  reps={set.reps}
                  load={set.load}
                  rpe={set.rpe}
                  onChange={vals => handleUpdateSet(set.id, vals)}
                  onDelete={handleDeleteSet}
               />
            ))}
            <View style={styles.buttonContainer}>
               <Pressable
                  onPress={handleAddSet}
                  style={styles.iconButton}
                  android_ripple={{ color: '#ccc', borderless: true }}
               >
                  <Icon name='add-circle' size={36} color="lightblue" />
               </Pressable>
            </View>
         </View>

         <View style={styles.lineContainer}>
            <View style={styles.line} />
         </View>
      </>
   );
}

export default Workout;

const styles = StyleSheet.create({
   workoutContainer: {
      alignItems: 'flex-start',
      paddingRight: 16
   },
   rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '86%',
      alignSelf: 'center',
      marginBottom: 8,
      marginRight: 20,
   },
   headerText: {
      marginLeft: 32,
      marginVertical: 4,
      color: 'lightblue',
      fontSize: 32,
      fontWeight: 'bold',
   },
   headerRowContainer: {
      flexDirection: 'row',
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'space-between'
   },
   headerButtonStyle: {
      paddingVertical: 12,
      paddingLeft: 12,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      marginRight: 16,
   },
   buttonContainer: {
      alignSelf: 'center',
      width: '86%',
      flexDirection: 'row',
      justifyContent: 'center',
      justifyContent: 'space-evenly'
   },
   iconButton: {
      paddingTop: 8,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
   },
   inputHeader: {
      width: '39%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: 10,
   },
   rowHeader: {
      width: 38,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#444444',
   },
   lineContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      marginHorizontal: '7%',
      marginVertical: 4,
   },
   line: {
      flex: 1,
      height: 1,
      backgroundColor: '#A0A0A0',
      marginTop: 4,
   },
   text: {
      color: '#444444',
      fontWeight: 'semibold'
   }
});
