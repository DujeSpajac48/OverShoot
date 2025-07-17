import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

//chart  test
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

export default function ProfileScreen() {
  return (
    <>
      <SafeAreaView style={styles.MainContainer} edges={['top','bottom']}>
        <LinearGradient
          colors={['#2C84F4', 'transparent']}  
          style={styles.topContainer}  
          start={{ x: 1, y: 1 }}  
          end={{ x: 0.2, y: 3 }}    
        >
          <View style={styles.profilePic}></View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Foo Bar</Text>
            <View style={styles.userTags}>
              <Text style={[styles.tagText,{backgroundColor: '#FFBC80'}]}>Random Tag</Text>
              <Text style={styles.tagText}>Coach</Text>
              <Text style={[styles.tagText,{backgroundColor: '#FFDD55'}]}>Tag</Text>

              

            </View>
          </View>
        </LinearGradient>

        <ScrollView 
        
        showsVerticalScrollIndicator={false}
        style={styles.graphContainer}>
          {/* make a component for this graph */}
          {/* <View style={styles.graphStyle}>
            <View style={styles.graphBorder}>
              
            </View>

          </View> */}

          <View style={styles.graphStyle}>
            <View style={styles.graphBorder}>
            <Text style={{fontSize: 24,}}>E1RM Squat</Text>
              <LineChart
                  data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
                    datasets: [
                      {
                        data: [100, 105, 110, 120,110,115],
                      },
                    ],
                  }}
                  width={350} 
                  height={180} 
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(44, 42, 244, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 32,
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "3",
                      stroke: "#2C84F4",
                      fill: 'white'
                    },
                  }}
                  bezier
                  style={{
                    marginLeft: -20,
                  }}
            />


            </View>

          </View>

          <View style={styles.graphStyle}>
            <View style={styles.graphBorder}>
            <Text style={{fontSize: 24,}}>E1RM Bench</Text>
              
            <LineChart
                  data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
                    datasets: [
                      {
                        data: [100, 105, 110, 120,110,115],
                      },
                    ],
                  }}
                  width={350} 
                  height={180} 
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(44, 42, 244, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 32,
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "3",
                      stroke: "#2C84F4",
                    },
                  }}
                  bezier={false}
                  style={{
                    marginLeft: -20,
                  }}
            />
            </View>

          </View>
          <View style={styles.graphStyle}>
            <View style={styles.graphBorder}>
            <Text style={{fontSize: 24,}}>E1RM Bench</Text>
              
            <LineChart
                  data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
                    datasets: [
                      {
                        data: [100, 105, 110, 120,110,115],
                      },
                    ],
                  }}
                  width={350} 
                  height={180} 
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(44, 42, 244, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 32,
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "3",
                      stroke: "#2C84F4",
                    },
                  }}
                  bezier={false}
                  style={{
                    marginLeft: -20,
                  }}
            />
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  MainContainer:{

    flex: 1,
  },
  topContainer:{
    borderWidth: 0.5,
    borderColor: '#1A65B9',
    flexDirection: 'row',
    zIndex: 1,
    width: '100%',
    height: '18%',
    borderBottomRightRadius: 26,
    alignItems: 'center',
  },
  profilePic:{
    borderWidth: 0.32,
    borderColor: '#333333',
    // borderBottomColor: 'yellow',
    // borderLeftColor: 'yellow',
    width: '26%',
    aspectRatio: 1,
    borderRadius: '100%',
    backgroundColor: 'red',
    alignSelf: 'flex-start',
    marginLeft: '8%',
    marginTop: '25%',
    zIndex: 3,
  },
  userInfo:{
    // borderWidth: 1,
    width: '54%',
    height: 40,
    marginTop: '28%',
    marginLeft: 18, 
  },
  userName:{
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontSize: 32,
  },
  userTags:{

    // borderWidth: 1,
    // borderColor: 'red',
    height: 20,
    marginTop: 6,
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
  },


  // siva  888888
  // zuta FFDD55
  // crvena F28B82
  // naranca FFBC80
  // skylbue 7EC8E3
  // menta A3D9A5
// lavanda C7B8EA
  tagText:{
    backgroundColor: '#C7B8EA',
    color: 'white',
    paddingHorizontal: 4,
  },
  infoContainer:{
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginTop: 40,
    zIndex: 2,
    width: '86%',
    height: '40%',
  },


  graphContainer:{
    // borderWidth: 1,
    // borderColor: 'red',

    flex:1,
    // marginTop: 50,
    paddingTop:20,
  },

  graphStyle:{
    // borderWidth: 1,
    height: 250,
    marginVertical: 12,
  },
  graphBorder:{
    // borderWidth: 1,
     // borderLeftWidth: 1,
    // borderBottomWidth: 1,

    margin: 36,

    height: 180,
    
  },
});
