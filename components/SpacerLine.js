import { View, Text, StyleSheet } from 'react-native';

export default function SpacerLine() {
   return (
      <View style={styles.lineContainer}>
         <View style={styles.line} />
         <Text style={styles.text}>OR</Text>
         <View style={styles.line} />
      </View>
   );
}

const styles = StyleSheet.create({
   lineContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      marginHorizontal: '7%',
      gap: 16,
   },

   line: {
      flex: 1,
      height: 1,
      backgroundColor: '#A0A0A0',
      marginTop: 8,
   },

   text: {
      color: '#444444',
      fontWeight: '600',  
   }
});
