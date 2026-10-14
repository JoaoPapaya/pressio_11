import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/data/AuthContext';
import { ReadingsProvider } from './src/data/ReadingsContext';
import TabsNavigator from './src/navigation/TabsNavigator';
import NovaLeituraScreen from './src/screens/NovaLeituraScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import ConsultasScreen from './src/screens/ConsultasScreen';
import LembretesScreen from './src/screens/LembretesScreen';
import ExportacaoScreen from './src/screens/ExportacaoScreen';
import ContaScreen from './src/screens/ContaScreen';
import { colors } from './src/theme/theme';

const Stack = createNativeStackNavigator();

function Routes() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgTop, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Sem sessão: só Login/Registro. Com sessão: o app. Trocar de grupo é automático.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="Tabs" component={TabsNavigator} options={{ gestureEnabled: false }} />
          <Stack.Screen name="NovaLeitura" component={NovaLeituraScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Consultas" component={ConsultasScreen} />
          <Stack.Screen name="Lembretes" component={LembretesScreen} />
          <Stack.Screen name="Exportacao" component={ExportacaoScreen} />
          <Stack.Screen name="Conta" component={ContaScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ReadingsProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Routes />
        </NavigationContainer>
      </ReadingsProvider>
    </AuthProvider>
  );
}
