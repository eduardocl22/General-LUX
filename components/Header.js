import React from "react";
import {
  View,
  Image,
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
      {/* Barra de estado */}
      <RNStatusBar backgroundColor="#5BA33B" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        {/* Botón de menú hamburguesa */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        {/* LOGO CENTRAL */}
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/logo general lux-(Blanco).png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Botón de carrito */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CarritoScreen")}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#5BA33B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    paddingHorizontal: 12,
    backgroundColor: "#5BA33B",
    elevation: 6,
  },
  iconButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
  },
});
