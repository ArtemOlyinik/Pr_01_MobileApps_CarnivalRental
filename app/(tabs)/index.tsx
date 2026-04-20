import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, IconButton, Paragraph, Portal } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function CatalogScreen() {
  const router = useRouter();
  // Підключаємо Zustand!
  const { costumesData, setCostumesData, isDarkMode } = useStore(); 
  
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [costumeToDelete, setCostumeToDelete] = useState<string | null>(null);

  const styles = getStyles(isDarkMode);

  const confirmDelete = (id: string) => {
    setCostumeToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const executeDelete = () => {
    if (costumeToDelete) {
      setCostumesData((prev) => prev.filter(item => item.id !== costumeToDelete));
    }
    setDeleteConfirmVisible(false);
    setCostumeToDelete(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={costumesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/costume/${item.id}`)}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>Фото</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>Категорія: {item.category}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
            <IconButton icon="delete" iconColor="#FF3B30" size={24} onPress={() => confirmDelete(item.id)} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      <Portal>
        <Dialog visible={deleteConfirmVisible} onDismiss={() => setDeleteConfirmVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
          <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Підтвердження</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Ви впевнені, що хочете видалити цей костюм?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteConfirmVisible(false)}>Скасувати</Button>
            <Button onPress={executeDelete} textColor="#FF3B30">Видалити</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  listContainer: { padding: 16, gap: 16 },
  card: { flexDirection: 'row', backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  imagePlaceholder: { width: 80, height: 80, backgroundColor: isDarkMode ? '#333333' : '#E5E5EA', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  imageText: { color: isDarkMode ? '#AAAAAA' : '#8E8E93', fontSize: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: isDarkMode ? '#AAAAAA' : '#8E8E93', marginBottom: 8 },
  cardPrice: { fontSize: 15, fontWeight: '600', color: isDarkMode ? '#32D74B' : '#34C759' }
});