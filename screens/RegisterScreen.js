// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "Santa Cruz",
    pais: "Bolivia"
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [campoModal, setCampoModal] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  // Listas para selección
  const departamentosBolivia = [
    "Santa Cruz", "La Paz", "Cochabamba", "Chuquisaca", 
    "Tarija", "Oruro", "Potosí", "Beni", "Pando"
  ];

  const paises = ["Bolivia", "Argentina", "Brasil", "Chile", "Perú"];

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const abrirModal = (campo) => {
    setCampoModal(campo);
    setModalVisible(true);
  };

  const seleccionarOpcion = (valor) => {
    setFormData(prev => ({
      ...prev,
      [campoModal]: valor
    }));
    setModalVisible(false);
  };

  const validarFormulario = () => {
    const { email, password, confirmPassword, nombre, apellido, telefono, direccion, ciudad } = formData;

    if (!email || !password || !confirmPassword || !nombre || !apellido || !telefono || !direccion || !ciudad) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos requeridos.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Email inválido", "Por favor ingresa un email válido.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas no coinciden", "Las contraseñas deben ser iguales.");
      return false;
    }

    if (!/^[+]?[\d\s\-()]{8,}$/.test(telefono)) {
      Alert.alert("Teléfono inválido", "Por favor ingresa un número de teléfono válido.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validarFormulario()) return;

    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );

      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        pais: formData.pais,
        email: formData.email,
        fechaRegistro: new Date().toISOString(),
      });

      Alert.alert(
        "¡Registro exitoso!", 
        "Tu cuenta ha sido creada correctamente.\n\nAhora puedes iniciar sesión.",
        [
          { 
            text: "Iniciar Sesión", 
            onPress: () => navigation.navigate("Login")
          }
        ]
      );

    } catch (error) {
      let mensajeError = "Error al crear la cuenta.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensajeError = "Este email ya está registrado.";
          break;
        case 'auth/invalid-email':
          mensajeError = "El formato del email no es válido.";
          break;
        case 'auth/weak-password':
          mensajeError = "La contraseña es demasiado débil.";
          break;
        default:
          mensajeError = error.message;
      }
      
      Alert.alert("Error", mensajeError);
    }
  };

  const renderInput = (label, campo, esObligatorio = true, tipo = "text", esSelector = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {esObligatorio && <Text style={styles.required}>*</Text>}
      </Text>
      
      {esSelector ? (
        <TouchableOpacity 
          style={styles.selectorInput}
          onPress={() => abrirModal(campo)}
        >
          <Text style={[styles.selectorText, !formData[campo] && styles.placeholderText]}>
            {formData[campo] || `Seleccionar ${label.toLowerCase()}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      ) : (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            placeholderTextColor="#999"
            value={formData[campo]}
            onChangeText={(texto) => handleInputChange(campo, texto)}
            secureTextEntry={tipo === "password" && !(campo === "password" ? mostrarPassword : mostrarConfirmPassword)}
            keyboardType={
              tipo === "email" ? "email-address" : 
              tipo === "phone" ? "phone-pad" : 
              "default"
            }
            autoCapitalize={campo === "email" ? "none" : "words"}
          />
          {(campo === "password" || campo === "confirmPassword") && (
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => campo === "password" ? 
                setMostrarPassword(!mostrarPassword) : 
                setMostrarConfirmPassword(!mostrarConfirmPassword)
              }
            >
              <Ionicons 
                name={campo === "password" ? 
                  (mostrarPassword ? "eye-off" : "eye") : 
                  (mostrarConfirmPassword ? "eye-off" : "eye")
                } 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.content}>
              <View style={styles.card}>
                {/* Header del Registro */}
                <View style={styles.header}>
                  <Ionicons name="person-add" size={32} color="#12A14B" />
                  <Text style={styles.title}>Crear Cuenta</Text>
                  <Text style={styles.subtitle}>
                    Completa tus datos para comenzar a comprar
                  </Text>
                </View>

                {/* Información de Cuenta */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Información de Cuenta</Text>
                  {renderInput("Email", "email", true, "email")}
                  {renderInput("Contraseña", "password", true, "password")}
                  {renderInput("Confirmar Contraseña", "confirmPassword", true, "password")}
                </View>

                {/* Información Personal */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Información Personal</Text>
                  {renderInput("Nombre", "nombre", true)}
                  {renderInput("Apellido", "apellido", true)}
                  {renderInput("Teléfono", "telefono", true, "phone")}
                </View>

                {/* Dirección */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Dirección de Envío</Text>
                  {renderInput("Dirección", "direccion", true)}
                  {renderInput("Ciudad", "ciudad", true)}
                  {renderInput("Departamento", "departamento", true, "text", true)}
                  {renderInput("País", "pais", true, "text", true)}
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                </TouchableOpacity>

                {/* Enlace a Login */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={styles.loginLink}
                >
                  <Text style={styles.loginText}>
                    ¿Ya tienes una cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <Footer />

      {/* Modal para selección */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Seleccionar {campoModal.charAt(0).toUpperCase() + campoModal.slice(1)}
            </Text>
            <FlatList
              data={campoModal === "departamento" ? departamentosBolivia : paises}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => seleccionarOpcion(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {formData[campoModal] === item && (
                    <Ionicons name="checkmark" size={20} color="#12A14B" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 25,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    color: "#444",
    marginBottom: 8,
  },
  required: {
    color: "#e74c3c",
  },
  textInputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontFamily: "Aller_Rg",
    fontSize: 16,
    color: "#2d2d2d",
    paddingRight: 50, // Espacio para el icono del ojo
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 5,
  },
  selectorInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  selectorText: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
  },
  placeholderText: {
    color: "#999",
  },
  button: {
    backgroundColor: "#12A14B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#12A14B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Aller_Bd",
    marginLeft: 8,
  },
  loginLink: {
    marginTop: 20,
    padding: 10,
  },
  loginText: {
    color: "#666",
    textAlign: "center",
    fontFamily: "Aller_Rg",
    fontSize: 14,
  },
  loginLinkText: {
    color: "#12A14B",
    fontFamily: "Aller_Bd",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "70%",
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
  },
  modalCloseButton: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: "Aller_Bd",
    color: "#666",
  },
});