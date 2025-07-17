import { Text, Pressable, View, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function LoginButton({onPress}){
   const navigation = useNavigation();



   return(
      < Pressable  
      onPress={() => navigation.replace('MainScreen')}
      style={({ pressed })=>[
         styles.buttonContainer ,
         pressed && styles.buttonPressed
      ]}
      >
      <View >
         <Text style={styles.buttonText}>Login</Text>
      </View>
      </Pressable >
   );
}  



const styles = StyleSheet.create({
   buttonContainer:{
      backgroundColor:"#1877F2",
      borderWidth:1,
      borderColor:'#0F4C9B',
      justifyContent:'center',
      width: Dimensions.get('window').width* 0.85,
      borderRadius: 4, 
      height: Dimensions.get('window').height*0.052,
      marginBottom:32 ,
      marginTop: 28,
   },
   buttonText:{
      textAlign: 'center',
      color:'white',
      fontWeight: 'bold'
   },
   buttonPressed:{
      transform: [{scale : 0.98}]
   },
})