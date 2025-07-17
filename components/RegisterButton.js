import { Text, Pressable, View, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
export default function RegisterButton({onPress}){
   return(
      
      < Pressable 
      onPress={onPress}>
      <View style={styles.buttonContainer}>
         <Text style={styles.buttonText}>Create new account</Text>
      </View>
      </Pressable>
   );
}


const styles = StyleSheet.create({
   buttonContainer:{
      // backgroundColor:"#1877F2",
      // borderWidth:1,
      // borderColor:'#0F4C9B',
      justifyContent:'center',
      width: Dimensions.get('window').width * 0.85,
      // borderRadius: 5,
      height: Dimensions.get('window').height* 0.052,
      marginBottom:30,
      marginTop: 12,
   },
   buttonText:{
      textAlign: 'center',
      color:'#444444',
      fontWeight: 'bold'
   }
})