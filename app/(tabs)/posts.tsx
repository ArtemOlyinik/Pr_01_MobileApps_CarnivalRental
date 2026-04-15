import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../../context/AppContext';

// Інтерфейс для даних з API
interface Post {
  id: number;
  title: string;
  body: string;
}

// Функція для завантаження даних
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Помилка завантаження даних');
  }
  return response.json();
};

export default function PostsScreen() {
  const context = useContext(AppContext);
  const isDarkMode = context?.isDarkMode || false;
  const styles = getStyles(isDarkMode);

  // ВИКОРИСТАННЯ REACT QUERY (Кешування та завантаження)
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'], // Ключ для кешу
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // Дані вважаються "свіжими" 5 хвилин (не будуть завантажуватись повторно)
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження відгуків...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Помилка: {(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  loadingText: {
    marginTop: 12,
    color: isDarkMode ? '#AAAAAA' : '#333333',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  cardBody: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#444444',
    lineHeight: 20,
  },
});