// screens/RegisterScreen.js
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  const handleRegister = async () => {
    if (!nombre.trim() || !email || !password) {
      Alert.alert("Faltan datos", "Completa nombre, correo y contraseña.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Contraseña", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Actualizar displayName
      await updateProfile(userCredential.user, { displayName: nombre.trim() });

      // Redirigir a Inicio (reset)
      navigation.reset({
        index: 0,
        routes: [{ name: "Inicio" }],
      });
    } catch (error) {
      const code = error.code || "";
      let message = "Error al registrar usuario.";
      if (code.includes("auth/email-already-in-use")) message = "El correo ya está en uso.";
      else if (code.includes("auth/invalid-email")) message = "Correo inválido.";
      else if (code.includes("auth/weak-password")) message = "Contraseña débil.";
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
          <Text style={[styles.title, { fontFamily: "Aller_Bd" }]}>Crear cuenta</Text>

          <TextInput
            placeholder="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TextInput
            placeholder="Contraseña (mín 6 caracteres)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, { fontFamily: "Aller_Rg" }]}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.registerText, { fontFamily: "Aller_Bd" }]}>Registrar</Text>}
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={{ fontFamily: "Aller_Rg" }}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.linkText, { fontFamily: "Aller_BdIt" }]}> Iniciar sesión</Text>
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
  registerButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  registerText: { color: "#fff", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  linkText: { color: "#12A14B" },
});
