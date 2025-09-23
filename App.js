import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Pantallas principales
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import CocinasScreen from "./screens/CocinasScreen";
import RefrigeradoresScreen from "./screens/RefrigeradoresScreen";
import LavadorasScreen from "./screens/LavadorasScreen";
import MicroondasScreen from "./screens/MicroondasScreen";
import ClimatizaciónScreen from "./screens/ClimatizaciónScreen";
import TelevisoresScreen from "./screens/TelevisoresScreen";
import LicuadorasScreen from "./screens/LicuadorasScreen";
import DispensadoresScreen from "./screens/DispensadoresScreen";
import PlanchasScreen from "./screens/PlanchasScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Contáctanos" component={ContactScreen} />
          <Stack.Screen name="Sobre Nosotros" component={AboutScreen} />

          {/* Categorías */}
          <Stack.Screen name="Cocinas" component={CocinasScreen} />
          <Stack.Screen name="Refrigeradores" component={RefrigeradoresScreen} />
          <Stack.Screen name="Lavadoras" component={LavadorasScreen} />
          <Stack.Screen name="Microondas" component={MicroondasScreen} />
          <Stack.Screen name="Climatización" component={ClimatizaciónScreen} />
          <Stack.Screen name="Televisores" component={TelevisoresScreen} />
          <Stack.Screen name="Licuadoras" component={LicuadorasScreen} />
          <Stack.Screen name="Dispensadores" component={DispensadoresScreen} />
          <Stack.Screen name="Planchas" component={PlanchasScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
