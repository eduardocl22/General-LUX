// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFonts } from "expo-font";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Ingresa correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Inicio correcto -> ir a Inicio (reemplaza pantalla de login)
      navigation.reset({
        index: 0,
        routes: [{ name: "Inicio" }],
      });
    } catch (error) {
      const code = error.code || "";
      let message = "Error al iniciar sesión.";
      if (code.includes("auth/user-not-found")) message = "Usuario no encontrado.";
      else if (code.includes("auth/wrong-password")) message = "Contraseña incorrecta.";
      else if (code.includes("auth/invalid-email")) message = "Correo inválido.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.inner}>
          <Text style={[styles.title, { fontFamily: "Aller_Bd" }]}>Iniciar sesión</Text>

          <TextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.loginText, { fontFamily: "Aller_Bd" }]}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={{ fontFamily: "Aller_Rg" }}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.linkText, { fontFamily: "Aller_BdIt" }]}> Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { padding: 20, paddingBottom: 140, flex: 1, justifyContent: "center" },
  title: { fontSize: 26, textAlign: "center", marginBottom: 20, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  loginText: { color: "#fff", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  linkText: { color: "#12A14B" },
});
