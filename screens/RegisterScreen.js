import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SQLite from 'expo-sqlite';
import GenderButton from '../components/GenderButton';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Neutral'
  });
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);


  useEffect(() => {
    let isMounted = true;

    const initDB = async () => {
      try {

        const database = await SQLite.openDatabaseAsync('RegisterSQL.db');
        
        

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            username TEXT NOT NULL,
            gender TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        if (isMounted) {
          setDb(database);
          setDbReady(true);
        }
      } catch (error) {
        console.error('Database initialization failed:', error);
        if (isMounted) {
          Alert.alert('Error', 'Failed to initialize local storage');
        }
      }
    };

    initDB();

    return () => {
      isMounted = false;
      if (db) {
        db.closeAsync().catch(e => console.warn('DB close error:', e));
      }
    };
  }, []);

  const handleGenderChange = (gender) => {
    setFormData({...formData, gender});
  };

  const handleRegister = async () => {

    if (loading) return;


    if (!formData.firstName || !formData.lastName || !formData.username || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!dbReady || !db) {
      Alert.alert('Error', 'Database not ready');
      return;
    }

    setLoading(true);

    try {

      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `INSERT INTO users 
          (firstName, lastName, username, gender, email, password) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            formData.firstName,
            formData.lastName,
            formData.username,
            formData.gender,
            formData.email,
            formData.password
          ]
        );
        console.log('Registration successful:', result);
      });

      Alert.alert('Success', 'Registration completed!');
      navigation.navigate('LoginScreen');

      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'Neutral'
      });
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error', 
        error.message.includes('UNIQUE') 
          ? 'Email already exists' 
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 74 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
              <View style={styles.textConatiner}>
                <Text style={styles.headerText}>Slika</Text>
              </View>
              
              <View style={styles.loginContainer}>
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
                      onChangeText={(text) => setFormData({...formData, email: text})}
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
                  style={[styles.registerButton, loading && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                  )}
                </Pressable>

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
    borderColor: '#E0E0E0',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    marginTop: '15%',
    marginLeft: '7%',
    paddingLeft: '5%'
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
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '10%',
    paddingVertical: 24,
    paddingBottom: 40,
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
