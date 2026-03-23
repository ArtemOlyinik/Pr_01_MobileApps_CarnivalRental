import React, { createContext, ReactNode, useState } from 'react';

// Переносимо наші інтерфейси сюди
export interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

// Описуємо, що саме буде зберігатися в нашому глобальному сховищі
interface AppContextType {
  // Дані
  costumesData: CostumeData[];
  setCostumesData: React.Dispatch<React.SetStateAction<CostumeData[]>>;
  
  // Авторизація
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  
  // Налаштування користувача
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  newsletterEnabled: boolean;
  toggleNewsletter: () => void;
}

// Початкові дані
const generateDescription = (i: number, category: string) => {
  return `Це чудовий карнавальний костюм номер ${i + 1}. Ідеально підходить для тематичних вечірок, святкувань Хелловіну або новорічних корпоративів. Матеріал високої якості, дуже зручний. Категорія: ${category}.`;
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

// Створюємо сам контекст
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Створюємо Провайдер (обгортку), який буде роздавати ці дані
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Всі наші стани з минулої практичної переїхали сюди
  const [costumesData, setCostumesData] = useState<CostumeData[]>(initialCostumes);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Новий стан для авторизації
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Функції перемикання
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  const toggleNewsletter = () => setNewsletterEnabled(prev => !prev);

  // Функція логіну (захардкоджений користувач для Практичної №3)
  const login = (user: string, pass: string) => {
    // Перевіряємо заданих в коді користувачів (Пункт 3 завдання)
    if (user.toLowerCase() === 'student' && pass === '12345') {
      setIsAuthenticated(true);
      setUserName('Студент');
      return true;
    }
    return false;
  };

  // Функція виходу
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};