// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    departamento: "Santa Cruz",
    pais: "Bolivia"
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [campoModal, setCampoModal] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Listas para selección
  const departamentosBolivia = [
    "Santa Cruz", "La Paz", "Cochabamba", "Chuquisaca", 
    "Tarija", "Oruro", "Potosí", "Beni", "Pando"
  ];

  const paises = ["Bolivia", "Argentina", "Brasil", "Chile", "Perú"];

  // Escuchar cambios en el teclado
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
    const { email, password, confirmPassword, nombre, apellido, telefono, direccion } = formData;

    if (!email || !password || !confirmPassword || !nombre || !apellido || !telefono || !direccion) {
      showCustomError("Campos incompletos", "Por favor completa todos los campos requeridos.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showCustomError("Email inválido", "El formato del email ingresado no es válido. Por favor ingresa un email válido");
      return false;
    }

    if (password.length < 6) {
      showCustomError("Contraseña débil", "La contraseña debe tener al menos 6 caracteres para mayor seguridad.");
      return false;
    }

    if (password !== confirmPassword) {
      showCustomError("Contraseñas no coinciden", "Las contraseñas ingresadas no son iguales. Por favor verifica.");
      return false;
    }

    if (!/^[+]?[\d\s\-()]{8,}$/.test(telefono)) {
      showCustomError("Teléfono inválido", "Por favor ingresa un número de teléfono válido.");
      return false;
    }

    return true;
  };

  // Función para mostrar errores personalizados
  const showCustomError = (titulo, mensaje) => {
    setErrorMessage({
      titulo: titulo || "Error",
      mensaje: mensaje || "Ha ocurrido un error inesperado.",
      tipo: "error"
    });
    setShowErrorModal(true);
  };

  // Función para mostrar error de Firebase
  const showFirebaseError = (error) => {
    let titulo = "Error de Registro";
    let mensaje = "No se pudo completar el registro. Por favor intenta nuevamente.";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        titulo = "Email ya registrado";
        mensaje = "Este correo electrónico ya está asociado a una cuenta existente. Por favor utiliza otro email o intenta iniciar sesión.";
        break;
      case 'auth/invalid-email':
        titulo = "Formato de email inválido";
        mensaje = "El formato del email ingresado no es válido. Por favor ingresa un email válido";
        break;
      case 'auth/weak-password':
        titulo = "Contraseña muy débil";
        mensaje = "La contraseña es demasiado débil. Por favor crea una contraseña más segura con al menos 6 caracteres.";
        break;
      case 'auth/network-request-failed':
        titulo = "Error de conexión";
        mensaje = "No se pudo conectar con el servidor. Por favor verifica tu conexión a internet e intenta nuevamente.";
        break;
      case 'auth/operation-not-allowed':
        titulo = "Operación no permitida";
        mensaje = "El registro con email y contraseña no está habilitado. Por favor contacta al soporte técnico.";
        break;
      case 'auth/too-many-requests':
        titulo = "Demasiados intentos";
        mensaje = "Has realizado demasiados intentos de registro. Por favor espera unos minutos antes de intentar nuevamente.";
        break;
      default:
        mensaje = `Error técnico: ${error.message}. Por favor intenta más tarde.`;
    }
    
    setErrorMessage({
      titulo,
      mensaje,
      tipo: "firebase"
    });
    setShowErrorModal(true);
  };

  const handleRegister = async () => {
    if (isRegistering) return;
    
    if (!validarFormulario()) return;

    setIsRegistering(true);

    try {
      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );

      const user = userCredential.user;

      // 2. Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        departamento: formData.departamento,
        pais: formData.pais,
        email: formData.email,
        fechaRegistro: new Date().toISOString(),
      });

      // 3. Cerrar sesión inmediatamente
      await signOut(auth);

      // 4. Mostrar modal de éxito
      setShowSuccessModal(true);

    } catch (error) {
      // Mostrar error personalizado de Firebase
      showFirebaseError(error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    
    // Limpiar formulario
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      departamento: "Santa Cruz",
      pais: "Bolivia"
    });
    
    // Navegar a Login
    navigation.navigate("Login");
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
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
          activeOpacity={0.7}
        >
          <Text style={[styles.selectorText, !formData[campo] && styles.placeholderText]}>
            {formData[campo] || `Seleccionar ${label.toLowerCase()}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={`Ingresa tu ${label.toLowerCase()}`}
          placeholderTextColor="#999"
          value={formData[campo]}
          onChangeText={(texto) => handleInputChange(campo, texto)}
          secureTextEntry={tipo === "password"}
          keyboardType={
            tipo === "email" ? "email-address" : 
            tipo === "phone" ? "phone-pad" : 
            "default"
          }
          autoCapitalize={campo === "email" ? "none" : "words"}
          returnKeyType="next"
          blurOnSubmit={false}
          editable={!isRegistering}
        />
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header />
        
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={styles.background}
          resizeMode="cover"
          imageStyle={{ opacity: 0.15 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
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
                    {renderInput("Departamento", "departamento", true, "text", true)}
                    {renderInput("País", "pais", true, "text", true)}
                  </View>

                  {/* Botón de Registro */}
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      isRegistering && styles.buttonDisabled
                    ]} 
                    onPress={handleRegister}
                    activeOpacity={0.8}
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Ionicons name="sync" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Creando cuenta...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Crear Cuenta</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Enlace a Login */}
                  <TouchableOpacity
                    onPress={() => !isRegistering && navigation.navigate("Login")}
                    style={styles.loginLink}
                    activeOpacity={0.7}
                    disabled={isRegistering}
                  >
                    <Text style={[
                      styles.loginText,
                      isRegistering && styles.loginTextDisabled
                    ]}>
                      ¿Ya tienes una cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Footer con ancho completo */}
                {!isKeyboardVisible && (
                  <View style={styles.footerWrapper}>
                    <Footer />
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>

        {/* Modal para selección */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalFullScreenOverlay}>
            <View style={styles.modalContentContainer}>
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
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                      {formData[campoModal] === item && (
                        <Ionicons name="checkmark" size={20} color="#12A14B" />
                      )}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCloseText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de éxito profesional */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={handleSuccessModalClose}
        >
          <View style={styles.modalFullScreenOverlay}>
            <View style={styles.successModalContent}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={80} color="#12A14B" />
              </View>
              <Text style={styles.successModalTitle}>¡Registro Exitoso!</Text>
              <Text style={styles.successModalText}>
                Tu cuenta ha sido creada correctamente. {"\n\n"}
                Ahora puedes iniciar sesión con tus credenciales.
              </Text>
              <TouchableOpacity 
                style={styles.successModalButton}
                onPress={handleSuccessModalClose}
                activeOpacity={0.7}
              >
                <Text style={styles.successModalButtonText}>Ir a Iniciar Sesión</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de error profesional */}
        <Modal
          visible={showErrorModal}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={handleErrorModalClose}
        >
          <View style={styles.modalFullScreenOverlay}>
            <View style={styles.errorModalContent}>
              <View style={styles.errorIconContainer}>
                <Ionicons 
                  name={errorMessage.tipo === "firebase" ? "alert-circle" : "warning"} 
                  size={80} 
                  color="#E74C3C" 
                />
              </View>
              <Text style={styles.errorModalTitle}>
                {errorMessage.titulo || "Error"}
              </Text>
              <Text style={styles.errorModalText}>
                {errorMessage.mensaje}
              </Text>
              <TouchableOpacity 
                style={styles.errorModalButton}
                onPress={handleErrorModalClose}
                activeOpacity={0.7}
              >
                <Text style={styles.errorModalButtonText}>Entendido</Text>
                <Ionicons name="close-circle" size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
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
    margin: 20,
    marginBottom: 10,
  },
  footerWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontFamily: "Aller_Rg",
    fontSize: 16,
    color: "#2d2d2d",
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
  buttonDisabled: {
    backgroundColor: "#95D5B2",
    opacity: 0.7,
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
  loginTextDisabled: {
    opacity: 0.5,
  },
  loginLinkText: {
    color: "#12A14B",
    fontFamily: "Aller_Bd",
  },
  // MODAL OVERLAY QUE CUBRE TODA LA PANTALLA
  modalFullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentContainer: {
    width: '90%',
    maxHeight: '80%',
    marginTop: statusBarHeight,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
  // Modal de éxito
  successModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successModalTitle: {
    fontSize: 24,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginBottom: 15,
    textAlign: "center",
  },
  successModalText: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  successModalButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#12A14B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Aller_Bd",
  },
  // Modal de error
  errorModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorModalTitle: {
    fontSize: 24,
    fontFamily: "Aller_Bd",
    color: "#E74C3C",
    marginBottom: 15,
    textAlign: "center",
  },
  errorModalText: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  errorModalButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Aller_Bd",
  },
});