// screens/PerfilScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function PerfilScreen({ navigation }) {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente.");
      navigation.navigate("Inicio");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Mi Perfil</Text>

            <Text style={styles.label}>Correo electrónico</Text>
            <Text style={styles.value}>{user?.email}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 25,
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#0004",
  },
  title: {
    fontSize: 28,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    fontFamily: "Aller_Rg",
  },
  value: {
    fontSize: 18,
    marginBottom: 20,
    color: "#000",
    fontFamily: "Aller_Bd",
  },
  logoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Aller_Bd",
  },
});
