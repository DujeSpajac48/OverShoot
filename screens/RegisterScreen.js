import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,ScrollView,KeyboardAvoidingView,Platform,Alert,ActivityIndicator,Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenderButton from '../components/GenderButton';
import { useNavigation } from '@react-navigation/native';


import { supabase } from '../supabase/supabase';
import { signUp } from '../supabase/supabaseUtils';


function isValidEmail(email) {
  return /.+@.+\..+/.test(email.trim());
}


function isValidPassword(pw) {
  return pw.length >= 6; 
}

export default function RegisterScreen() {
  const navigation = useNavigation();


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const [gender, setGender] = useState(null); // zna se koji


  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emailCheckedRef = useRef('');


  async function checkEmailExists(email) {
    if (!isValidEmail(email)) return;
    if (emailCheckedRef.current === email) return; 
    emailCheckedRef.current = email;
    setErrorMsg('');
    try {

      const { data, error } = await supabase.auth.signUp({ email, password: 'randomPassword123!' });
      if (!data || !data.user) {
        setErrorMsg('This email is already in use.');
      }
    } catch (err) {
      setErrorMsg('This email is already in use.');
    }
  }

  const handleGenderChange = (newGender) => {
    setGender(newGender);
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    setErrorMsg('');
  
    const { firstName, lastName, username, email, password, confirmPassword } = formData;
  

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Invalid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
  
    setLoading(true);
    try {
      const result = await signUp(email.trim(), password);
      console.log('SignUp result:', result);
      setLoading(false);
      if (!result.data || !result.data.user) {
        setErrorMsg('This email is already in use.');
        return;
      }
      setErrorMsg('');
      Alert.alert('Registration successful!', 'Check your email to confirm your account.');
      navigation.navigate('LoginScreen');
    } catch (err) {
      setLoading(false);
      setErrorMsg('An unexpected error occurred. Please try again.');
    }
  };
  

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth event:', _event);
      if (session?.user) {


      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.username.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    !errorMsg;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 44}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
              <View style={styles.textConatiner}>
                <Image
                  source={require('../images/work.png')}
                  style={styles.image}
                  resizeMode="contain"

                />
                {/* <Text style={styles.headerText}>Slika</Text> */}
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.  motivationText}>Beyond the Goal – Overshoot!</Text>
                <View style={styles.doubleInputContainer}>
                  <View style={styles.doubleInput}>
                    <TextInput
                      placeholder="First Name"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({...formData, firstName: text})}
                    />
                  </View>
                  <View style={styles.doubleInput}>
                    <TextInput
                      placeholder="Last Name"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({...formData, lastName: text})}
                    />
                  </View>
                </View>

                <View style={styles.doubleInputContainer}>
                  <View style={styles.doubleInput}>
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      value={formData.username}
                      onChangeText={(text) => setFormData({...formData, username: text})}
                    />
                  </View>
                  <GenderButton onGenderChange={handleGenderChange} />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.singleInput}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={async (text) => {
                        setFormData({ ...formData, email: text });
                        if (isValidEmail(text)) {
                          await checkEmailExists(text);
                        } else {
                          setErrorMsg('');
                        }
                      }}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.singleInput}>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(text) => setFormData({...formData, password: text})}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.singleInput}>
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor="#A0A0A0"
                      style={styles.inputText}
                      secureTextEntry
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                    />
                  </View>
                </View>

                <Pressable 
                  style={[styles.registerButton, (loading || !isFormValid) && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                  )}
                </Pressable>
                {errorMsg ? (
                  <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>
                ) : null}

                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>TOS</Text>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  textConatiner: {
    // borderColor: '#E0E0E0',
    // borderTopLeftRadius: 100,
    // borderBottomLeftRadius: 100,
    // backgroundColor: '#F0F0F0',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 1,
    // marginTop: '15%',
    // marginLeft: '7%',
    // paddingLeft: '5%'

  },
  headerText: {
    textAlign: 'justify',
    fontSize: 52,
    color: 'grey',
  },
  image:{
    // borderWidth: 1,

    width: 300,
    height: 190,
    marginTop: 40,
  },
  loginContainer: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1.2,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // marginTop: '28%',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  motivationText:{
    width: 300,
    height: 30,
    fontSize: 20,
    textAlign: 'center',
    // backgroundColor: 'white',
    fontWeight: 'bold',


  },
  inputContainer: {
    width: '86%',
    marginTop: 12,
  },
  singleInput: {
    borderColor: '#D0D0D0',
    borderWidth: 1.2,
    backgroundColor: '#E8E8E8',
    height: 48,
    justifyContent: 'center',
    paddingLeft: 12,
    borderRadius: 4, 
  },
  doubleInputContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
    width: '86%',
  },
  doubleInput: {
    flex: 1,
    borderColor: '#D0D0D0',
    borderWidth: 1.2,
    backgroundColor: '#E8E8E8',
    height: 48,
    justifyContent: 'center',
    paddingLeft: 12,
    borderRadius: 4, 
  },
  inputText: {
    color: '#333333',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#FF715B',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    color: '#4c5b5c',
    marginVertical: 5,
  }
});