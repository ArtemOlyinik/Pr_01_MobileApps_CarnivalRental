import React, { createContext, ReactNode, useState } from 'react';

export interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  imageUri?: string | null;
}

interface AppContextType {
  costumesData: CostumeData[];
  setCostumesData: React.Dispatch<React.SetStateAction<CostumeData[]>>;
  isAuthenticated: boolean;
  login: (user: string, pass: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  newsletterEnabled: boolean;
  toggleNewsletter: () => void;
  // ДОДАНО: функція для збереження фото
  updateCostumeImage: (id: string, uri: string | null) => void; 
}

const generateDescription = (i: number, category: string) => {
  return `Це чудовий карнавальний костюм номер ${i + 1}. Ідеально підходить для тематичних вечірок. Категорія: ${category}.`;
};

const initialCostumes: CostumeData[] = Array.from({ length: 20 }, (_, i) => {
  const category = i % 2 === 0 ? 'Дорослий' : 'Дитячий';
  return {
    id: String(i + 1),
    name: `Карнавальний костюм #${i + 1}`,
    category,
    price: `${(i + 1) * 150} грн/доба`,
    description: generateDescription(i, category),
    // imageUri поки що немає
  };
});

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [costumesData, setCostumesData] = useState<CostumeData[]>(initialCostumes);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleNewsletter = () => setNewsletterEnabled(prev => !prev);

  // ДОДАНО: Функція, яка знаходить костюм по ID і оновлює йому фото
  const updateCostumeImage = (id: string, uri: string | null) => {
    setCostumesData(prevData => 
      prevData.map(costume => 
        costume.id === id ? { ...costume, imageUri: uri } : costume
      )
    );
  };

  const login = async (user: string, pass: string): Promise<{success: boolean, message: string}> => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass, expiresInMins: 30 }),
      });
      const responseText = await response.text();
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.accessToken || data.token) {
            setIsAuthenticated(true);
            setUserName(`${data.firstName} ${data.lastName}`);
            return { success: true, message: 'OK' };
          }
          return { success: false, message: 'Помилка: Сервер не повернув токен доступу.' };
        } catch (e) { return { success: false, message: 'Помилка читання JSON від сервера.' }; }
      } else {
        try {
          const errData = JSON.parse(responseText);
          return { success: false, message: errData.message || `Помилка API. Статус: ${response.status}` };
        } catch (e) { return { success: false, message: `Помилка API. Статус: ${response.status}` }; }
      }
    } catch (error: any) { return { success: false, message: `Помилка мережі: ${error.message}` }; }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <AppContext.Provider
      value={{
        costumesData, setCostumesData,
        isAuthenticated, login, logout,
        userName, setUserName,
        isDarkMode, toggleTheme,
        notificationsEnabled, toggleNotifications,
        newsletterEnabled, toggleNewsletter,
        updateCostumeImage, // Передаємо функцію вниз
      }}
    >
      {children}
    </AppContext.Provider>
  );
};