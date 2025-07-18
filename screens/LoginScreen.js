import React, { useState } from 'react';
import { Text, View, StatusBar, StyleSheet, TextInput, Pressable, Keyboard, Alert ,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import * as SQLite from 'expo-sqlite';

import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import SpacerLine from '../components/SpacerLine';


import {  signIn, getCurrentUser, resetPassword } from '../supabase/supabaseUtils';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setErrorMsg(result.error);
      setEmail('');
      setPassword('');
      Alert.alert('Login error', result.error);
    } else {
      const currUser = await getCurrentUser();
      console.log('Login result:', result, 'Current user:', currUser);
      setUser(currUser);
      setErrorMsg('');
      navigation.reset({
        index: 0,
        routes: [{ name: 'RootTabs' }],
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter email', 'Please enter your email address in the field.');
      return;
    }
    const result = await resetPassword(email.trim());
    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      Alert.alert('Check your email', 'We have sent you a password reset link.');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Image
          style={styles.imageStyle}
          source={require('../images/clean.png')}
          resizeMode="contain"
        />
        <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
          <View style={styles.loginContainer}>
            <View style={styles.loginInput}>
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#A0A0A0"
                style={{ color: '#333333' }}
                inputMode="email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.forgotPass}>
              <Text style={{ color: 'blue' }} onPress={handleForgotPassword}>Forgot password?</Text>
            </View>
            {errorMsg ? (
              <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>
            ) : null}
            <LoginButton onPress={handleLogin} disabled={loading} />
            <RegisterButton onPress={() => navigation.navigate('RegisterScreen')} />
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
  imageStyle:{
    alignSelf: 'center',
    position: 'absolute',
    aspectRatio: 0.4,
    height: 280,
    zIndex: -1,
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
    marginTop: 270,
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
