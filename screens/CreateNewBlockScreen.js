import { Text, View, StyleSheet, Pressable, Alert, StatusBar, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import SelectDificulty from "../components/SelectDificulty";
import BlockInfoInput from "../components/BlockInfoInput";

//sqlite
import initDB from '../SQLite/database';

export default function NewWorkoutScreen() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    split: '',
    duration: '',
    focus: '',
    diff: '',
    image: '',
  });

  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDB = async () => {
      try {
        const dbConn = await initDB();
        setDb(dbConn);
        setDbReady(true);
      } catch (e) {
        console.error('Didnt create DB:', e);
        Alert.alert('Error', 'Db not initialized');
      }
    };
    loadDB();

    return () => {
      isMounted = false;
      if (db) {
        db.closeAsync().catch(e => console.warn('DB close error:', e));
      }
    };
  }, []);

  const handleCreate = async () => {
    if (loading || !db) return;

    if (!formData.split || !formData.duration || !formData.focus || !formData.diff) {
      Alert.alert("Error!", "Please enter information in all fields.");
      return;
    }

    setLoading(true);

    try {
      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `INSERT INTO users (split, duration, focus, diff, image) VALUES (?, ?, ?, ?, ?)`,
          [
            formData.split,
            formData.duration,
            formData.focus,
            formData.diff,
            formData.image,
          ]
        );
        console.log("Blok kreiran: ", result);
        console.log("slika ", formData.image);
      });

      Alert.alert("Block Saved");
      navigation.navigate('MainScreen');
      setFormData({
        split: '',
        duration: 1,
        focus: '',
        diff: '',
        image: '',
      });
    } catch (error) {
      console.log("Block creation error", error);
      Alert.alert('Error', "Block wasn't saved");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow access to media library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setFormData(prev => ({
        ...prev,
        image: selectedImageUri,
      }));
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <View style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>New Training Block</Text>
        </View>


        <BlockInfoInput
          onChangeText={text => setFormData(prev => ({ ...prev, split: text }))}
          inputGuide="Weekly split"
          inputGuideSugestion="PPL, Upper/Lower, Chest/Back..."
          placeHolderText="Enter split"
        />

        <BlockInfoInput
          onChangeText={text => setFormData(prev => ({ ...prev, duration: text }))}
          inputGuide="Duration"
          inputGuideSugestion="5 weeks, 12 weeks..."
          placeHolderText="Enter Duration"
          keyboardType='numeric'
        />

        <BlockInfoInput
          onChangeText={text => setFormData(prev => ({ ...prev, focus: text }))}
          inputGuide="Main Focus"
          inputGuideSugestion="Powerlifting, BodyBuilding..."
          placeHolderText="Input"
        />

        <SelectDificulty
          onSelect={text => setFormData(prev => ({ ...prev, diff: text }))}
        />

        <Pressable onPress={pickImage}>
          <View style={styles.imageUploadContainer}>
            {formData.image ? (
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: formData.image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={[styles.imageBox, styles.emptyImageBox]}>
                <Text style={styles.emptyImageText}>No image selected</Text>
              </View>
            )}
          </View>
        </Pressable>

        <View style={styles.formButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCreate}
          >
            <Text style={[styles.buttonText, styles.confirmButtonText]}>Save</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  imageBox: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'lightgrey',
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImageBox: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  emptyImageText: {
    color: '#888',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: 'darkred',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
  },
});