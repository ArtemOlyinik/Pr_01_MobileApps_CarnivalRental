import React, { useContext, useState } from 'react';
// ДОДАНО: Імпорт Image
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, IconButton, Paragraph, Portal } from 'react-native-paper';
import { AppContext, CostumeData } from '../../context/AppContext';

export default function CatalogScreen() {
  const context = useContext(AppContext);
  const router = useRouter();
  const isDarkMode = context?.isDarkMode || false;
  const costumesData = context?.costumesData || [];
  
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [costumeToDelete, setCostumeToDelete] = useState<string | null>(null);
  
  const [detailsDialogVisible, setDetailsDialogVisible] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState<CostumeData | null>(null);

  const styles = getStyles(isDarkMode);

  const confirmDelete = (id: string) => {
    setCostumeToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const executeDelete = () => {
    if (costumeToDelete && context) {
      context.setCostumesData(prev => prev.filter(item => item.id !== costumeToDelete));
    }
    setDeleteConfirmVisible(false);
    setCostumeToDelete(null);
  };

  const handleOpenDetails = (item: CostumeData) => {
    setSelectedCostume(item);
    setDetailsDialogVisible(true);
  };

  const handleGoToDetails = () => {
    setDetailsDialogVisible(false);
    if (selectedCostume) {
      router.push(`/costume/${selectedCostume.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={costumesData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenDetails(item)} activeOpacity={0.7}>
            
            {/* ВИПРАВЛЕНО: Відображаємо реальне фото, якщо воно є! */}
            <View style={styles.imagePlaceholder}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
              ) : (
                <Text style={styles.imageText}>Фото</Text>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>Категорія: {item.category}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
            <IconButton
              icon="delete"
              iconColor="#FF3B30"
              size={24}
              onPress={() => confirmDelete(item.id)}
            />
          </TouchableOpacity>
        )}
      />

      <Portal>
        <Dialog visible={deleteConfirmVisible} onDismiss={() => setDeleteConfirmVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
          <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Підтвердження</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Видалити цей костюм зі списку?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteConfirmVisible(false)} textColor="#8E8E93">Скасувати</Button>
            <Button onPress={executeDelete} textColor="#FF3B30">Видалити</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={detailsDialogVisible} onDismiss={() => setDetailsDialogVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
          <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 22 }}>{selectedCostume?.name}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: isDarkMode ? '#AAA' : '#555', marginBottom: 8, fontWeight: 'bold' }}>
              Категорія: <Text style={{ fontWeight: 'normal' }}>{selectedCostume?.category}</Text>
            </Paragraph>
            <Paragraph style={{ color: isDarkMode ? '#32D74B' : '#34C759', marginBottom: 16, fontWeight: 'bold', fontSize: 18 }}>
              {selectedCostume?.price}
            </Paragraph>
            <Paragraph style={{ color: isDarkMode ? '#DDD' : '#333', lineHeight: 22 }}>
              {selectedCostume?.description}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: 'space-between' }}>
            <Button onPress={handleGoToDetails} textColor="#34C759">Детальніше</Button>
            <Button onPress={() => setDetailsDialogVisible(false)} textColor="#007AFF">Закрити</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  listContainer: { padding: 16, gap: 16 },
  card: { flexDirection: 'row', backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderRadius: 12, padding: 12, elevation: 3, alignItems: 'center' },
  imagePlaceholder: { width: 80, height: 80, backgroundColor: isDarkMode ? '#333333' : '#E5E5EA', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  imageText: { color: isDarkMode ? '#AAAAAA' : '#8E8E93', fontSize: 12 },
  cardContent: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: isDarkMode ? '#AAAAAA' : '#8E8E93', marginBottom: 8 },
  cardPrice: { fontSize: 15, fontWeight: '600', color: isDarkMode ? '#32D74B' : '#34C759' },
});