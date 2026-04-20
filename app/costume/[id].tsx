import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function CostumeDetails() {
  const { id } = useLocalSearchParams();
  const { costumesData, updateCostumeImage, isDarkMode } = useStore();

  const costume = costumesData.find(c => c.id === id);
  const styles = getStyles(isDarkMode);

  if (!costume) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Костюм не знайдено</Text>
      </View>
    );
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Вибачте, потрібен дозвіл на доступ до галереї!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateCostumeImage(costume.id, result.assets[0].uri);
    }
  };

  const removeImage = () => {
    updateCostumeImage(costume.id, null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: costume.name, headerStyle: { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }, headerTintColor: isDarkMode ? '#FFFFFF' : '#000000' }} />

      {costume.imageUri ? (
        <Image source={{ uri: costume.imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Немає фото</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={pickImage} style={styles.button} buttonColor="#007AFF">
          Прикріпити фото з галереї
        </Button>
        {costume.imageUri && (
          <Button mode="outlined" onPress={removeImage} style={[styles.button, { borderColor: '#FF3B30' }]} textColor="#FF3B30">
            Відкріпити фото
          </Button>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.title}>{costume.name}</Text>
        <Text style={styles.category}>Категорія: {costume.category}</Text>
        <Text style={styles.price}>{costume.price}</Text>
        <Text style={styles.description}>{costume.description}</Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  content: { padding: 16 },
  errorText: { color: isDarkMode ? '#FFF' : '#000', textAlign: 'center', marginTop: 50 },
  image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 16 },
  imagePlaceholder: { width: '100%', height: 250, backgroundColor: isDarkMode ? '#333333' : '#E5E5EA', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  placeholderText: { color: isDarkMode ? '#AAAAAA' : '#8E8E93', fontSize: 16 },
  buttonContainer: { gap: 12, marginBottom: 24 },
  button: { paddingVertical: 6 },
  infoCard: { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDarkMode ? 0.3 : 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 8 },
  category: { fontSize: 16, color: isDarkMode ? '#AAAAAA' : '#8E8E93', marginBottom: 12 },
  price: { fontSize: 20, fontWeight: 'bold', color: isDarkMode ? '#32D74B' : '#34C759', marginBottom: 16 },
  description: { fontSize: 16, color: isDarkMode ? '#DDDDDD' : '#333333', lineHeight: 24 }
});