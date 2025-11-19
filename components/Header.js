import React from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar as RNStatusBar,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigation = useNavigation();
  const { user } = useAuth(); // 🔥 Usuario logueado o null

  const openMenu = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (error) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  // Navegar al perfil o login según estado de auth
  const goToUser = () => {
    if (user) {
      navigation.navigate("Perfil"); // 🔥 PerfilScreen
    } else {
      navigation.navigate("Login"); // 🔥 LoginScreen
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <RNStatusBar backgroundColor="#12A14B" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.header}
        resizeMode="cover"
      >
        {/* Botón de menú */}
        <TouchableOpacity
          onPress={openMenu}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Logo centrado */}
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/logo general lux-(Blanco).png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Contenedor de iconos a la derecha */}
        <View style={styles.rightIcons}>
          {/* Carrito */}
          <TouchableOpacity
            onPress={() => navigation.navigate("CarritoScreen")}
            style={[styles.iconButton, { marginRight: 10 }]}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Usuario dinámico */}
          <TouchableOpacity
            onPress={goToUser}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name={user ? "person" : "person-outline"}
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#12A14B" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    paddingHorizontal: 12,
    elevation: 6,
  },
  iconButton: { width: 40, alignItems: "center", justifyContent: "center" },
  centerContent: { flex: 1, alignItems: "center" },
  logo: { width: 200, height: 80 },
  rightIcons: { flexDirection: "row", alignItems: "center" },
});
