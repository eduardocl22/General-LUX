import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { CartProvider } from "./context/CartContext";

// Componentes
import Header from "./components/Header";

// Pantallas
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import CocinasScreen from "./screens/CocinasScreen";
import RefrigeracionScreen from "./screens/RefrigeracionScreen";
import LavadorasScreen from "./screens/LavadorasScreen";
import MicroondasScreen from "./screens/MicroondasScreen";
import ClimatizacionScreen from "./screens/ClimatizacionScreen";
import TelevisoresScreen from "./screens/TelevisoresScreen";
import LicuadorasScreen from "./screens/LicuadorasScreen";
import DispensadoresScreen from "./screens/DispensadoresScreen";
import PlanchasScreen from "./screens/PlanchasScreen";
import CarritoScreen from "./screens/CarritoScreen";
import DetallesProductoScreen from "./screens/DetallesProductoScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const productosItems = [
  { label: "Climatización", screen: "Climatización" },
  { label: "Cocinas", screen: "Cocinas" },
  { label: "Dispensadores", screen: "Dispensadores" },
  { label: "Lavadoras", screen: "Lavadoras" },
  { label: "Licuadoras", screen: "Licuadoras" },
  { label: "Microondas", screen: "Microondas" },
  { label: "Planchas", screen: "Planchas" },
  { label: "Refrigeración", screen: "Refrigeración" },
  { label: "Televisores", screen: "Televisores" },
];

function CustomDrawerContent(props) {
  const [productosOpen, setProductosOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Inicio");

  const handleNavigation = (screen) => {
    setActiveItem(screen);
    props.navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
    if (!productosItems.some((item) => item.screen === screen)) {
      setProductosOpen(false);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 20 }}>
        {/* Inicio */}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Inicio" && styles.activeItem]}
          onPress={() => handleNavigation("Inicio")}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={activeItem === "Inicio" ? "#fff" : "#045700"}
          />
          <Text style={[styles.menuText, activeItem === "Inicio" && styles.activeText]}>
            Inicio
          </Text>
        </TouchableOpacity>

        {/* Productos */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setProductosOpen(!productosOpen)}
        >
          <Ionicons
            name={productosOpen ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            color="#045700"
          />
          <Text style={styles.menuText}>Productos</Text>
        </TouchableOpacity>

        {productosOpen && (
          <View style={{ paddingLeft: 20 }}>
            {productosItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.subMenuItem, activeItem === item.screen && styles.activeItem]}
                onPress={() => handleNavigation(item.screen)}
              >
                <Text style={[styles.menuText, activeItem === item.screen && styles.activeText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sobre Nosotros */}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Sobre Nosotros" && styles.activeItem]}
          onPress={() => handleNavigation("Sobre Nosotros")}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={activeItem === "Sobre Nosotros" ? "#fff" : "#045700"}
          />
          <Text style={[styles.menuText, activeItem === "Sobre Nosotros" && styles.activeText]}>
            Sobre Nosotros
          </Text>
        </TouchableOpacity>

        {/* Contáctanos*/}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Contáctanos" && styles.activeItem]}
          onPress={() => handleNavigation("Contáctanos")}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={activeItem === "Contáctanos" ? "#fff" : "#045700"}
          />
          <Text style={[styles.menuText, activeItem === "Contáctanos" && styles.activeText]}>
            Contáctanos
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
}

function createStack(screenName, ScreenComponent) {
  return () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={`${screenName}Stack`} component={ScreenComponent} />
      <Stack.Screen name="DetallesProducto" component={DetallesProductoScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 250, backgroundColor: "#fff" } }}
    >
      <Drawer.Screen name="Inicio" component={createStack("Inicio", HomeScreen)} />
      <Drawer.Screen name="Climatización" component={createStack("Climatización", ClimatizacionScreen)} />
      <Drawer.Screen name="Cocinas" component={createStack("Cocinas", CocinasScreen)} />
      <Drawer.Screen name="Dispensadores" component={createStack("Dispensadores", DispensadoresScreen)} />
      <Drawer.Screen name="Lavadoras" component={createStack("Lavadoras", LavadorasScreen)} />
      <Drawer.Screen name="Licuadoras" component={createStack("Licuadoras", LicuadorasScreen)} />
      <Drawer.Screen name="Microondas" component={createStack("Microondas", MicroondasScreen)} />
      <Drawer.Screen name="Planchas" component={createStack("Planchas", PlanchasScreen)} />
      <Drawer.Screen name="Refrigeración" component={createStack("Refrigeración", RefrigeracionScreen)} />
      <Drawer.Screen name="Televisores" component={createStack("Televisores", TelevisoresScreen)} />
      <Drawer.Screen name="Sobre Nosotros" component={AboutScreen} />
      <Drawer.Screen name="Contáctanos" component={ContactScreen} />
      <Drawer.Screen name="CarritoScreen" component={CarritoScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Aller_Bd: require("./assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("./assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("./assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("./assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("./assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("./assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text></Text>
      </View>
    );

  return (
    <CartProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  subMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuText: { fontSize: 17, color: "#5BA33B", marginLeft: 12, fontFamily: "Aller_It" },
  activeItem: { backgroundColor: "#5BA33B", borderRadius: 50 },
  activeText: { color: "#fff" },
});
