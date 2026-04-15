import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';

export default function CostumeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const context = useContext(AppContext);
  const isDarkMode = context?.isDarkMode || false;

  const costume = context?.costumesData.find(c => c.id === id);
  const styles = getStyles(isDarkMode);

  const pickImage = async () => {
    const currentPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (!currentPermission.granted) {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Потрібен дозвіл на доступ до галереї!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // ВИПРАВЛЕНО: Використовуємо новий стандарт запису замість застарілого MediaTypeOptions
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, 
    });

    if (!result.canceled && context) {
      context.updateCostumeImage(id as string, result.assets[0].uri);
    }
  };

  const removeImage = () => {
    if (context) {
      context.updateCostumeImage(id as string, null);
    }
  };

  if (!costume) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Костюм не знайдено</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: costume.name, headerBackTitle: "Назад", headerShown: true }} />

      <View style={styles.content}>
        
        {costume.imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: costume.imageUri }} style={styles.image} />
            <Button 
              mode="outlined" 
              icon="delete" 
              textColor="#FF3B30" 
              style={{ borderColor: '#FF3B30', marginTop: 12 }}
              onPress={removeImage}
            >
              Відкріпити фото
            </Button>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Фото не прикріплено</Text>
            </View>
            <Button 
              mode="contained" 
              icon="camera-image" 
              buttonColor="#007AFF"
              style={{ marginTop: 12 }}
              onPress={pickImage}
            >
              Прикріпити фото з галереї
            </Button>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{costume.name}</Text>
          <Text style={styles.category}>Категорія: {costume.category}</Text>
          <Text style={styles.price}>{costume.price}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Опис:</Text>
          <Text style={styles.description}>{costume.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  errorText: { color: isDarkMode ? '#FFFFFF' : '#000000', fontSize: 18 },
  content: { padding: 24 },
  imageContainer: { marginBottom: 24, alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: 250, backgroundColor: isDarkMode ? '#333333' : '#E5E5EA', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250, borderRadius: 12 },
  imageText: { color: isDarkMode ? '#AAAAAA' : '#8E8E93', fontSize: 16 },
  infoContainer: { marginTop: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 8 },
  category: { fontSize: 16, color: isDarkMode ? '#AAAAAA' : '#666666', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: isDarkMode ? '#32D74B' : '#34C759', marginBottom: 24 },
  divider: { height: 1, backgroundColor: isDarkMode ? '#333333' : '#E0E0E0', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 8 },
  description: { fontSize: 16, color: isDarkMode ? '#DDDDDD' : '#333333', lineHeight: 24 },
});