import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Index() {
  const context = useContext(AppContext);
  
  // Якщо ми авторизовані - йдемо у наші вкладки. Якщо ні - на логін.
  if (context?.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/login" />;
}