import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar as RNStatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* StatusBar */}
      <RNStatusBar backgroundColor="#045700" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        {/* Menú hamburguesa */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()} // ✅ Funciona con Drawer
          style={styles.iconButton}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Logo + Texto */}
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>GENERAL LUX</Text>
        </View>

        {/* Carrito */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Contáctanos")} // Cambia a tu pantalla de carrito si la tienes
          style={styles.iconButton}
        >
          <Ionicons name="cart" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#045700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: "#045700",
  },
  iconButton: {
    width: 40,
    alignItems: "center",
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 34,
    height: 34,
    marginRight: 6,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
