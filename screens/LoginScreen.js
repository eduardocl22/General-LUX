// screens/LoginScreen.js
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
  StatusBar,
  ScrollView,
  Alert,
  LogBox
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Ignorar warnings
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental',
]);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  const fontFamilyOrDefault = (fontName) =>
    fontsLoaded ? fontName : "System";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Faltan datos", 
        "Ingresa correo y contraseña para continuar.",
        [{ text: "Entendido" }]
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(
        "Email inválido",
        "Por favor ingresa un email válido.",
        [{ text: "Corregir" }]
      );
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: "Inicio" }] });
    } catch (error) {
      let errorMessage = "Correo o contraseña incorrectos.";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del email no es válido.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Esta cuenta ha sido deshabilitada.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No existe una cuenta con este email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Demasiados intentos fallidos. Intenta más tarde.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión. Verifica tu internet.";
          break;
      }
      
      Alert.alert(
        "Error al iniciar sesión",
        errorMessage,
        [{ text: "Intentar de nuevo" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate("ForgotPassword");
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(
        "Correo requerido",
        "Por favor ingresa tu correo electrónico para recuperar tu contraseña.",
        [{ text: "Entendido" }]
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(
        "Email inválido",
        "Por favor ingresa un email válido.",
        [{ text: "Corregir" }]
      );
      return;
    }

    setLoading(true);
    try {
      // Enviar email de recuperación
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace de recuperación a tu correo electrónico.",
        [{ text: "Entendido" }]
      );
    } catch (error) {
      let errorMessage = "Error al enviar el correo de recuperación.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No existe una cuenta con este email.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del email no es válido.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Demasiados intentos. Intenta más tarde.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión. Verifica tu internet.";
          break;
      }
      
      Alert.alert(
        "Error",
        errorMessage,
        [{ text: "Intentar de nuevo" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
      
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15 }}
      >
        <Header navigation={navigation} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Contenido principal */}
            <View style={styles.mainContent}>
              <View style={styles.loginCard}>
                {/* Logo y título */}
                <View style={styles.headerContainer}>
                  <View style={styles.logoContainer}>
                    <Ionicons name="log-in" size={50} color="#12A14B" />
                  </View>
                  <Text style={[styles.title, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                    Iniciar Sesión
                  </Text>
                  <Text style={[styles.subtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </Text>
                </View>

                {/* Formulario */}
                <View style={styles.formContainer}>
                  {/* Campo Email */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      Correo Electrónico
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        style={[styles.input, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {/* Campo Contraseña */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      Contraseña
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Opciones adicionales */}
                  <View style={styles.optionsContainer}>
                    <TouchableOpacity
                      style={styles.rememberContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                      disabled={loading}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                        {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
                      </View>
                      <Text style={[styles.rememberText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                        Recordarme
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      disabled={loading}
                    >
                      <View style={styles.forgotPasswordContainer}>
                        <Ionicons name="key" size={16} color="#12A14B" style={styles.forgotIcon} />
                        <Text style={[styles.forgotText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                          ¿Olvidaste tu contraseña?
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Botón de inicio de sesión */}
                  <TouchableOpacity
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <Ionicons name="sync" size={20} color="#FFF" />
                        <Text style={[styles.loginButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                          Iniciando sesión...
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons name="log-in" size={20} color="#FFF" />
                        <Text style={[styles.loginButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                          Iniciar Sesión
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Separador - LINEA RECTA SIN TEXTO */}
                  <View style={styles.separator}>
                    <View style={styles.separatorLine} />
                  </View>

                  {/* Registro */}
                  <View style={styles.registerContainer}>
                    <Text style={[styles.registerText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      ¿No tienes una cuenta?
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Register")}
                      disabled={loading}
                      style={styles.registerButton}
                    >
                      <Text style={[styles.registerLink, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                        Crear cuenta
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#12A14B" style={styles.registerIcon} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Beneficios */}
                <View style={styles.benefitsContainer}>
                  <Text style={[styles.benefitsTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Beneficios de tu cuenta
                  </Text>
                  <View style={styles.benefitsGrid}>
                    <View style={styles.benefitItem}>
                      <Ionicons name="cart" size={20} color="#12A14B" />
                      <Text style={[styles.benefitText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                        Compras rápidas
                      </Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Ionicons name="time" size={20} color="#12A14B" />
                      <Text style={[styles.benefitText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                        Historial de pedidos
                      </Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Ionicons name="shield-checkmark" size={20} color="#12A14B" />
                      <Text style={[styles.benefitText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                        Compra segura
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Footer />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  loginCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 0,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  passwordToggle: {
    paddingRight: 15,
    paddingLeft: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#12A14B',
    borderColor: '#12A14B',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotIcon: {
    marginRight: 6,
  },
  forgotText: {
    fontSize: 14,
    color: '#12A14B',
  },
  loginButton: {
    backgroundColor: '#12A14B',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#95D5B2',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 17,
    marginLeft: 8,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 25,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEE',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: '#666',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  registerLink: {
    fontSize: 15,
    color: '#12A14B',
  },
  registerIcon: {
    marginLeft: 4,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(18, 161, 75, 0.1)',
    marginBottom: 0,
  },
  benefitsTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  benefitItem: {
    alignItems: 'center',
    flex: 1,
  },
  benefitText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  footerContainer: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
});