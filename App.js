import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReadingsProvider } from './src/data/ReadingsContext';
import TabsNavigator from './src/navigation/TabsNavigator';
import NovaLeituraScreen from './src/screens/NovaLeituraScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import ConsultasScreen from './src/screens/ConsultasScreen';
import LembretesScreen from './src/screens/LembretesScreen';
import ExportacaoScreen from './src/screens/ExportacaoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ReadingsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="Tabs" component={TabsNavigator} options={{ gestureEnabled: false }} />
          <Stack.Screen name="NovaLeitura" component={NovaLeituraScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Consultas" component={ConsultasScreen} />
          <Stack.Screen name="Lembretes" component={LembretesScreen} />
          <Stack.Screen name="Exportacao" component={ExportacaoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReadingsProvider>
  );
}
