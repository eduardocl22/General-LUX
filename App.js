import "react-native-gesture-handler";
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

// Contextos
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider, useMenu } from "./context/MenuContext";

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
import DetallesCompraScreen from "./screens/DetallesCompraScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PerfilScreen from "./screens/PerfilScreen";

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Iconos válidos y representativos
const productosItems = [
  { 
    label: "Climatización", 
    screen: "Climatización", 
    icon: "air-conditioner", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Cocinas", 
    screen: "Cocinas", 
    icon: "stove", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Dispensadores", 
    screen: "Dispensadores", 
    icon: "water-pump", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Lavadoras", 
    screen: "Lavadoras", 
    icon: "washing-machine", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Licuadoras", 
    screen: "Licuadoras", 
    icon: "blender", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Microondas", 
    screen: "Microondas", 
    icon: "microwave", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Planchas", 
    screen: "Planchas", 
    icon: "iron", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Refrigeración", 
    screen: "Refrigeración", 
    icon: "fridge", 
    iconFamily: "MaterialCommunityIcons" 
  },
  { 
    label: "Televisores", 
    screen: "Televisores", 
    icon: "television", 
    iconFamily: "MaterialCommunityIcons" 
  },
];

const mainMenuItems = [
  { 
    label: "Inicio", 
    screen: "Inicio", 
    icon: "home", 
    iconFamily: "Ionicons" 
  },
  { 
    label: "Sobre Nosotros", 
    screen: "Sobre Nosotros", 
    icon: "information-circle", 
    iconFamily: "Ionicons" 
  },
  { 
    label: "Contáctanos", 
    screen: "Contáctanos", 
    icon: "call", 
    iconFamily: "Ionicons" 
  },
];

// Componente para renderizar iconos según la familia
const IconComponent = ({ family, name, size, color }) => {
  switch(family) {
    case 'MaterialIcons':
      return <MaterialIcons name={name} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name} size={size} color={color} />;
    case 'Ionicons':
    default:
      return <Ionicons name={name} size={size} color={color} />;
  }
};

function CustomDrawerContent(props) {
  // Usar el contexto del menú en lugar de useState local
  const { productosOpen, activeItem, toggleProductos, setActiveItem } = useMenu();

  const handleNavigation = (screen, label) => {
  setActiveItem(label);
  
  // Cerrar el drawer
  props.navigation.closeDrawer();
  
  // Lista de pantallas que DEBEN limpiar el historial
  const screensThatClearHistory = [
    "CarritoScreen", 
    "Perfil", 
    "Login", 
    "Register",
    "Inicio",  // Agregar Inicio también
    "Sobre Nosotros",
    "Contáctanos"
  ];
  
  // Si es una pantalla que debe limpiar historial
  if (screensThatClearHistory.includes(screen)) {
    // Usar reset para limpiar toda la pila de navegación
    props.navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
  } else if (screen === "DetallesProducto") {
    // Para detalles, navegar normalmente (permitir volver)
    props.navigation.navigate(screen);
  } else {
    // Para categorías de productos (Cocinas, Climatización, etc.)
    // Navegar normalmente - estas están en Stack Navigators
    props.navigation.navigate(screen);
  }
};

  const handleCloseDrawer = () => {
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.drawerContainer}>
      <StatusBar backgroundColor="#12A14B" barStyle="light-content" />
      
      {/* Header del Drawer */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCloseDrawer}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require("./assets/LOGO G (NEGRO).png")} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>GENERAL LUX</Text>
        </View>
      </View>

      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Menú Principal */}
        <View style={styles.menuSection}>
          {mainMenuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem, 
                activeItem === item.label && styles.activeMenuItem
              ]}
              onPress={() => handleNavigation(item.screen, item.label)}
            >
              <View style={[
                styles.menuIconContainer,
                activeItem === item.label && styles.activeMenuIconContainer
              ]}>
                <IconComponent 
                  family={item.iconFamily}
                  name={item.icon} 
                  size={22} 
                  color={activeItem === item.label ? "#FFF" : "#12A14B"} 
                />
              </View>
              <Text style={[
                styles.menuText, 
                activeItem === item.label && styles.activeMenuText
              ]}>
                {item.label}
              </Text>
              {activeItem === item.label && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Separador */}
        <View style={styles.separator}>
          <Text style={styles.separatorText}>PRODUCTOS</Text>
        </View>

        {/* Menú Productos */}
        <TouchableOpacity 
          style={styles.productsHeader}
          onPress={toggleProductos}
          activeOpacity={0.7}
        >
          <View style={[
            styles.menuIconContainer,
            productosOpen && styles.productsIconActive
          ]}>
            <MaterialCommunityIcons 
              name={productosOpen ? "folder-open" : "folder"} 
              size={22} 
              color={productosOpen ? "#FFF" : "#12A14B"} 
            />
          </View>
          <Text style={styles.productsTitle}>Catálogo de Productos</Text>
          <Ionicons 
            name={productosOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#12A14B" 
            style={styles.chevron}
          />
        </TouchableOpacity>

        {/* Lista de Productos */}
        {productosOpen && (
          <View style={styles.productsList}>
            {productosItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.productItem,
                  activeItem === item.label && styles.activeProductItem
                ]}
                onPress={() => handleNavigation(item.screen, item.label)}
              >
                <View style={[
                  styles.productIconContainer,
                  activeItem === item.label && styles.activeProductIconContainer
                ]}>
                  <IconComponent 
                    family={item.iconFamily}
                    name={item.icon} 
                    size={18} 
                    color={activeItem === item.label ? "#FFF" : "#666"} 
                  />
                </View>
                <Text style={[
                  styles.productText,
                  activeItem === item.label && styles.activeProductText
                ]}>
                  {item.label}
                </Text>
                {activeItem === item.label && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Espacio para footer */}
        <View style={styles.drawerFooter}>
          <View style={styles.footerCard}>
            <Ionicons name="shield-checkmark" size={24} color="#12A14B" />
            <Text style={styles.footerText}>Productos con Garantía</Text>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
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
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width * 0.85,
          backgroundColor: "#FFF",
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.3)',
        drawerPosition: 'left',
        swipeEnabled: true,
        drawerHideStatusBarOnOpen: false,
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
      }}
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
      <Drawer.Screen name="DetallesCompra" component={DetallesCompraScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
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

  // Si las fuentes no están cargadas, mostrar pantalla en blanco
  if (!fontsLoaded) {
    return null; // Pantalla en blanco mientras carga
  }

  return (
    <MenuProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  drawerHeader: {
    backgroundColor: '#12A14B',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: 'Aller_Bd',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
  },
  activeMenuItem: {
    backgroundColor: '#12A14B',
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activeMenuIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuText: {
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'Aller_Bd',
    flex: 1,
  },
  activeMenuText: {
    color: '#FFF',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  separator: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  separatorText: {
    fontSize: 12,
    color: '#95A5A6',
    fontFamily: 'Aller_Bd',
    letterSpacing: 1,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(18, 161, 75, 0.08)',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  productsIconActive: {
    backgroundColor: '#12A14B',
  },
  productsTitle: {
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'Aller_Bd',
    flex: 1,
    marginLeft: 15,
  },
  chevron: {
    marginLeft: 10,
  },
  productsList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 6,
  },
  activeProductItem: {
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#12A14B',
  },
  productIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeProductIconContainer: {
    backgroundColor: '#12A14B',
  },
  productText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Aller_Rg',
    flex: 1,
  },
  activeProductText: {
    color: '#12A14B',
    fontFamily: 'Aller_Bd',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#12A14B',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(18, 161, 75, 0.1)',
  },
  footerText: {
    fontSize: 14,
    color: '#2C3E50',
    fontFamily: 'Aller_Rg',
    marginLeft: 10,
  },
});