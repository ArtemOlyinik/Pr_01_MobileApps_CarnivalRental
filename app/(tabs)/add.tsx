import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Text, TextInput } from 'react-native-paper';
import { CostumeData, useStore } from '../../store/useStore';

export default function AddScreen() {
  const router = useRouter();
  const { setCostumesData, isDarkMode } = useStore();

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [validationDialogVisible, setValidationDialogVisible] = useState(false);

  const styles = getStyles(isDarkMode);

  const handleAddCostume = () => {
    if (newName.trim() === '' || newCategory.trim() === '' || newPrice.trim() === '') {
      setValidationDialogVisible(true);
      return;
    }

    const newCostume: CostumeData = {
      id: Date.now().toString(),
      name: newName,
      category: newCategory,
      price: `${newPrice} грн/доба`,
      description: newDescription.trim() === '' ? 'Опис відсутній.' : newDescription,
    };

    setCostumesData(prevData => [newCostume, ...prevData]);
    setNewName(''); setNewCategory(''); setNewPrice(''); setNewDescription('');
    router.push('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>Новий костюм</Text>

      <TextInput label="Назва костюма" value={newName} onChangeText={setNewName} style={styles.input} mode="outlined" textColor={isDarkMode ? '#FFF' : '#000'} activeOutlineColor="#007AFF" outlineColor={isDarkMode ? '#555' : '#CCC'} theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }} />
      <TextInput label="Категорія (Дорослий/Дитячий)" value={newCategory} onChangeText={setNewCategory} style={styles.input} mode="outlined" textColor={isDarkMode ? '#FFF' : '#000'} activeOutlineColor="#007AFF" outlineColor={isDarkMode ? '#555' : '#CCC'} theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }} />
      <TextInput label="Ціна (тільки число)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" style={styles.input} mode="outlined" textColor={isDarkMode ? '#FFF' : '#000'} activeOutlineColor="#007AFF" outlineColor={isDarkMode ? '#555' : '#CCC'} theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }} />
      <TextInput label="Детальний опис" value={newDescription} onChangeText={setNewDescription} multiline numberOfLines={3} style={[styles.input, { height: 100 }]} mode="outlined" textColor={isDarkMode ? '#FFF' : '#000'} activeOutlineColor="#007AFF" outlineColor={isDarkMode ? '#555' : '#CCC'} theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }} />

      <Button mode="contained" onPress={handleAddCostume} buttonColor="#007AFF" style={styles.button}>
        Зберегти костюм
      </Button>

      <Portal>
        <Dialog visible={validationDialogVisible} onDismiss={() => setValidationDialogVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
          <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Помилка</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Будь ласка, заповніть всі обов'язкові поля.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setValidationDialogVisible(false)} textColor="#007AFF">ОК</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: isDarkMode ? '#FFFFFF' : '#1C1C1E' },
  input: { marginBottom: 16, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
  button: { marginTop: 16, paddingVertical: 6 }
});