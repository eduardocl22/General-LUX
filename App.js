// App.js
import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";

// Pantallas principales
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import CocinasScreen from "./screens/CocinasScreen";
import RefrigeracionScreen from "./screens/RefrigeracionScreen";
import LavadorasScreen from "./screens/LavadorasScreen";
import MicroondasScreen from "./screens/MicroondasScreen";
import ClimatizaciónScreen from "./screens/ClimatizaciónScreen";
import TelevisoresScreen from "./screens/TelevisoresScreen";
import LicuadorasScreen from "./screens/LicuadorasScreen";
import DispensadoresScreen from "./screens/DispensadoresScreen";
import PlanchasScreen from "./screens/PlanchasScreen";

// Iconos
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

// Submenú de productos
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
    props.navigation.navigate(screen);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 20 }}>
        {/* --- Items del Drawer en el orden que quieras --- */}
        {/* Inicio */}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Inicio" && styles.activeItem]}
          onPress={() => handleNavigation("Inicio")}
        >
          <Ionicons name="home-outline" size={20} color={activeItem === "Inicio" ? "#fff" : "#045700"} />
          <Text style={[styles.menuText, activeItem === "Inicio" && styles.activeText]}>Inicio</Text>
        </TouchableOpacity>

        {/* Productos desplegable */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setProductosOpen(!productosOpen)}
        >
          <Ionicons name={productosOpen ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#045700" />
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
                <Text style={[styles.menuText, activeItem === item.screen && styles.activeText]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sobre Nosotros */}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Sobre Nosotros" && styles.activeItem]}
          onPress={() => handleNavigation("Sobre Nosotros")}
        >
          <Ionicons name="information-circle-outline" size={20} color={activeItem === "Sobre Nosotros" ? "#fff" : "#045700"} />
          <Text style={[styles.menuText, activeItem === "Sobre Nosotros" && styles.activeText]}>Sobre Nosotros</Text>
        </TouchableOpacity>

        {/* Contáctanos */}
        <TouchableOpacity
          style={[styles.menuItem, activeItem === "Contáctanos" && styles.activeItem]}
          onPress={() => handleNavigation("Contáctanos")}
        >
          <Ionicons name="call-outline" size={20} color={activeItem === "Contáctanos" ? "#fff" : "#045700"} />
          <Text style={[styles.menuText, activeItem === "Contáctanos" && styles.activeText]}>Contáctanos</Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 250,
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Drawer.Screen name="Inicio" component={HomeScreen} />
        <Drawer.Screen name="Sobre Nosotros" component={AboutScreen} />
        <Drawer.Screen name="Contáctanos" component={ContactScreen} />
        {/* Categorías */}
        <Drawer.Screen name="Climatización" component={ClimatizaciónScreen} />
        <Drawer.Screen name="Cocinas" component={CocinasScreen} />
        <Drawer.Screen name="Dispensadores" component={DispensadoresScreen} />
        <Drawer.Screen name="Lavadoras" component={LavadorasScreen} />
        <Drawer.Screen name="Licuadoras" component={LicuadorasScreen} />
        <Drawer.Screen name="Microondas" component={MicroondasScreen} />
        <Drawer.Screen name="Planchas" component={PlanchasScreen} />
        <Drawer.Screen name="Refrigeración" component={RefrigeracionScreen} />
        <Drawer.Screen name="Televisores" component={TelevisoresScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
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
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#045700",
    marginLeft: 12,
  },
  activeItem: {
    backgroundColor: "#045700",
    borderRadius: 50, // borde redondeado del cilindro
  },
  activeText: {
    color: "#fff",
  },
});
