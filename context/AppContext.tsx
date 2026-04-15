import React, { createContext, ReactNode, useState } from 'react';

export interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

interface AppContextType {
  costumesData: CostumeData[];
  setCostumesData: React.Dispatch<React.SetStateAction<CostumeData[]>>;
  isAuthenticated: boolean;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  newsletterEnabled: boolean;
  toggleNewsletter: () => void;
}

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

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user,
          password: pass,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setIsAuthenticated(true);
        // Використовуємо частину email до символу @ як ім'я
        const nameFromEmail = user.split('@')[0];
        setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <AppContext.Provider
      value={{
        costumesData,
        setCostumesData,
        isAuthenticated,
        login,
        logout,
        userName,
        setUserName,
        isDarkMode,
        toggleTheme,
        notificationsEnabled,
        toggleNotifications,
        newsletterEnabled,
        toggleNewsletter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};