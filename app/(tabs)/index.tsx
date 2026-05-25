import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, IconButton, Paragraph, Portal } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring, useAnimatedScrollHandler, interpolate, Extrapolation } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const AnimatedListItem = ({ item, index, isDarkMode, styles, onPress, onConfirmDelete, scrollY }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const scrollStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const itemPosition = index * 100;
    const scaleY = interpolate(
      scrollY.value,
      [itemPosition - 400, itemPosition, itemPosition + 400],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [itemPosition - 400, itemPosition, itemPosition + 400],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: scaleY }],
      opacity: opacity,
    };
  });

  const renderRightActions = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'flex-end', width: 80, paddingRight: 10 }}>
        <IconButton icon="delete" iconColor="#FF3B30" size={32} onPress={() => onConfirmDelete(item.id)} />
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={scrollStyle}>
      <Swipeable renderRightActions={renderRightActions}>
        <AnimatedTouchableOpacity 
          style={[styles.card, animatedStyle]} 
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.95);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
        >
          {item.imageUri ? (
            <Animated.Image sharedTransitionTag={`image-${item.id}`} source={{ uri: item.imageUri }} style={styles.image} />
          ) : (
            <Animated.View sharedTransitionTag={`image-${item.id}`} style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Фото</Text>
            </Animated.View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>Категорія: {item.category}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
          </View>
        </AnimatedTouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
};

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

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={costumesData}
        keyExtractor={(item: any) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }: any) => (
          <AnimatedListItem 
            item={item} 
            index={index} 
            isDarkMode={isDarkMode} 
            styles={styles} 
            scrollY={scrollY}
            onPress={() => router.push(`/costume/${item.id}`)}
            onConfirmDelete={confirmDelete}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      <Modal transparent visible={deleteConfirmVisible} animationType="none">
        <View style={StyleSheet.absoluteFillObject}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setDeleteConfirmVisible(false)} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} pointerEvents="box-none">
            {deleteConfirmVisible && (
              <Animated.View 
                entering={FadeInDown.duration(300).springify()} 
                exiting={FadeOutUp.duration(200)}
                style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', padding: 24, borderRadius: 12, width: '80%', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 }}
              >
                <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Підтвердження</Text>
                <Text style={{ color: isDarkMode ? '#AAA' : '#333', fontSize: 16, marginBottom: 24 }}>Ви впевнені, що хочете видалити цей костюм?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
                  <Button onPress={() => setDeleteConfirmVisible(false)}>Скасувати</Button>
                  <Button onPress={executeDelete} textColor="#FF3B30">Видалити</Button>
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </Modal>
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