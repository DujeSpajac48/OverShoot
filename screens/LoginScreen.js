import React, { useState } from 'react';
import { Text, View, StatusBar, StyleSheet, TextInput, Pressable, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import * as SQLite from 'expo-sqlite';

import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import SpacerLine from '../components/SpacerLine';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please enter both email and password');
  //     return;
  //   }

  //   try {
  //     const db = await SQLite.openDatabaseAsync('userLogin.db');
  //     await db.withTransactionAsync(async () => {
  //       const result = await db.getAllAsync(
  //         'SELECT * FROM Users WHERE email = ? AND password = ?',
  //         [email, password]
  //       );

  //       if (result.length > 0) {
  //         Alert.alert('Success', 'Login successful');
  //         navigation.replace('MainScreen'); 
  //       } else {
  //         Alert.alert('Error', 'Invalid email or password');
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     Alert.alert('Error', 'Login failed');
  //   }
  // };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>OverShoot</Text>
          </View>

          <View style={styles.loginContainer}>
            <View style={styles.loginInput}>
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#A0A0A0"
                style={{ color: '#333333' }}
                inputMode="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <View style={styles.loginInput}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                style={{ color: '#333333' }}
                textContentType="password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>

            <View style={styles.forgotPass}>
              <Text style={{ color: 'blue' }}>Forgot password?</Text>
            </View>


            <LoginButton onPress={handleLogin} />
            <RegisterButton onPress={() => navigation.navigate("RegisterScreen")} />

            <SpacerLine />

            <Text style={{ color: 'lightgrey', marginTop: 20 }}>
              Napraviti da se Google, Apple i Facebook mogu loginati
            </Text>
          </View>
        </Pressable>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  textContainer: {
    borderColor: '#E0E0E0',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    marginTop: '24%',
    marginLeft: '7%',
    paddingLeft: '5%',
  },
  headerText: {
    textAlign: 'justify',
    fontSize: 52,
    color: 'grey',
  },
  loginContainer: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1.2,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: '#E0E0E0',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    marginTop: '20%',
    paddingVertical: 24,
  },
  loginInput: {
    borderColor: '#D0D0D0',
    borderWidth: 1.2,
    backgroundColor: '#E8E8E8',
    width: Dimensions.get('window').width * 0.86,
    height: Dimensions.get('window').height * 0.052,
    justifyContent: 'center',
    paddingLeft: 12,
    marginTop: 24,
    marginBottom: -12,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginRight: '7%',
    marginTop: 24,
  },
});
