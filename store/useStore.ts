import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  imageUri?: string | null;
}

interface AppState {
  // Дані
  costumesData: CostumeData[];
  setCostumesData: (data: CostumeData[] | ((prev: CostumeData[]) => CostumeData[])) => void;
  updateCostumeImage: (id: string, uri: string | null) => void;

  // Авторизація
  isAuthenticated: boolean;
  login: (user: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Налаштування користувача
  userName: string;
  setUserName: (name: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  newsletterEnabled: boolean;
  toggleNewsletter: () => void;

  // Режим "Тільки поточна сесія"
  isSessionOnly: boolean;
  toggleSessionOnly: () => void;
}

const generateDescription = (i: number, category: string) => {
  return `Це чудовий карнавальний костюм номер ${i + 1}. Ідеально підходить для тематичних вечірок. Матеріал високої якості. Категорія: ${category}.`;
};

const initialCostumes: CostumeData[] = Array.from({ length: 20 }, (_, i) => {
  const category = i % 2 === 0 ? 'Дорослий' : 'Дитячий';
  return {
    id: String(i + 1),
    name: `Карнавальний костюм #${i + 1}`,
    category: category,
    price: `${(i + 1) * 150} грн/доба`,
    description: generateDescription(i, category),
  };
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Стан даних
      costumesData: initialCostumes,
      setCostumesData: (data) => set((state) => ({
        costumesData: typeof data === 'function' ? data(state.costumesData) : data
      })),
      updateCostumeImage: (id, uri) => set((state) => ({
        costumesData: state.costumesData.map(costume =>
          costume.id === id ? { ...costume, imageUri: uri } : costume
        )
      })),

      // Стан авторизації (Реальний API)
      isAuthenticated: false,
      login: async (user, pass) => {
        const trimmedUser = user.trim();
        const trimmedPass = pass.trim();
        
        // Хардкод-фолбек на випадок проблем з мережею в симуляторі
        if (trimmedUser === 'emilys' && trimmedPass === 'emilyspass') {
          set({ isAuthenticated: true, userName: 'Emily (Offline)' });
          return { success: true };
        }

        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: trimmedUser, password: trimmedPass }),
          });
          const data = await response.json();
          
          if (response.ok && data.accessToken) {
            set({ isAuthenticated: true, userName: data.firstName || 'Користувач' });
            return { success: true };
          } else {
            return { success: false, message: data.message || 'Невірний логін або пароль' };
          }
        } catch (error) {
          console.error("Login fetch error:", error);
          return { success: false, message: 'Помилка мережі. Перевірте з\'єднання.' };
        }
      },
      logout: () => set({ isAuthenticated: false, userName: '' }),

      // Стан налаштувань
      userName: '',
      setUserName: (name) => set({ userName: name }),
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      notificationsEnabled: false,
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      newsletterEnabled: false,
      toggleNewsletter: () => set((state) => ({ newsletterEnabled: !state.newsletterEnabled })),

      // Стан "Тільки поточна сесія"
      isSessionOnly: false,
      toggleSessionOnly: () => set((state) => ({ isSessionOnly: !state.isSessionOnly })),
    }),
    {
      name: 'carnival-storage', // Унікальне ім'я для AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        // Логіка Пункту 4: Якщо увімкнено "Тільки поточна сесія", фізично на пристрій нічого не пишемо (зберігаємо лише статус перемикача)
        if (state.isSessionOnly) {
          return { isSessionOnly: true } as AppState;
        }
        // Інакше — зберігаємо весь стан
        return state;
      },
    }
  )
);