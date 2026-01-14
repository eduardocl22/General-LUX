// screens/PerfilScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function PerfilScreen({ navigation }) {
  const { user } = useAuth();
  const { cartItems } = useCart();
  
  // Estados para los datos del usuario
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "Santa Cruz",
    pais: "Bolivia",
    email: "",
    fechaRegistro: ""
  });

  const [editando, setEditando] = useState(false);
  const [editandoDireccion, setEditandoDireccion] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalExitoVisible, setModalExitoVisible] = useState(false);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [campoEditando, setCampoEditando] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [tipoGuardado, setTipoGuardado] = useState("");

  // Listas para selección
  const departamentosBolivia = [
    "Santa Cruz", "La Paz", "Cochabamba", "Chuquisaca", 
    "Tarija", "Oruro", "Potosí", "Beni", "Pando"
  ];

  const paises = ["Bolivia", "Argentina", "Brasil", "Chile", "Perú"];

  // Cargar datos del usuario desde Firestore
  const cargarDatosUsuario = async () => {
    if (!user) return;
    
    try {
      setCargando(true);
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDatosUsuario({
          nombre: userData.nombre || "",
          apellido: userData.apellido || "",
          telefono: userData.telefono || "",
          direccion: userData.direccion || "",
          ciudad: userData.ciudad || "",
          departamento: userData.departamento || "Santa Cruz",
          pais: userData.pais || "Bolivia",
          email: userData.email || user.email,
          fechaRegistro: userData.fechaRegistro || ""
        });
      } else {
        setDatosUsuario(prev => ({
          ...prev,
          email: user.email
        }));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      mostrarAlerta("Error", "No se pudieron cargar los datos del perfil.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosUsuario();
  }, [user]);

  const mostrarAlerta = (titulo, mensaje) => {
    Alert.alert(titulo, mensaje, [{ text: "Aceptar", style: "default" }]);
  };

  const handleLogout = async () => {
    setModalConfirmacionVisible(true);
  };

  const confirmarLogout = async () => {
    setModalConfirmacionVisible(false);
    try {
      await signOut(auth);
      setModalExitoVisible(true);
      setTimeout(() => {
        setModalExitoVisible(false);
        navigation.navigate("Inicio");
      }, 2000);
    } catch (error) {
      mostrarAlerta("Error", error.message);
    }
  };

  const handleGuardarCambios = async (tipo) => {
    if (!user) return;
    
    try {
      setGuardando(true);
      setTipoGuardado(tipo);
      
      // Actualizar en Firestore
      await updateDoc(doc(db, "usuarios", user.uid), {
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        telefono: datosUsuario.telefono,
        direccion: datosUsuario.direccion,
        ciudad: datosUsuario.ciudad,
        departamento: datosUsuario.departamento,
        pais: datosUsuario.pais,
        ultimaActualizacion: new Date().toISOString(),
      });

      // Mostrar modal de éxito
      setModalExitoVisible(true);
      
      // Ocultar modal después de 2 segundos y salir del modo edición
      setTimeout(() => {
        setModalExitoVisible(false);
        if (tipo === 'personal') {
          setEditando(false);
        } else {
          setEditandoDireccion(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error guardando datos:", error);
      mostrarAlerta("Error", "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
      setTipoGuardado("");
    }
  };

  const abrirModal = (campo) => {
    setCampoEditando(campo);
    setModalVisible(true);
  };

  const seleccionarOpcion = (valor) => {
    setDatosUsuario(prev => ({
      ...prev,
      [campoEditando]: valor
    }));
    setModalVisible(false);
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "No disponible";
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "No disponible";
    }
  };

  // FUNCIÓN PARA RENDERIZAR CAMPOS
  const renderCampo = (label, value, campo, esSelector = false, seccion = 'personal') => {
    const estaEditando = seccion === 'personal' ? editando : editandoDireccion;
    const esEditable = estaEditando;
    
    // Función para cambiar el valor del campo
    const handleChangeText = (texto) => {
      setDatosUsuario(prev => ({ ...prev, [campo]: texto }));
    };
    
    // Estilo del campo basado en si es editable o no
    const campoStyle = esEditable ? styles.campoInputEditable : styles.campoInputNoEditable;
    
    if (esSelector) {
      return (
        <View style={styles.campoContainer}>
          <Text style={[styles.campoLabel, { fontFamily: "Aller_Rg" }]}>{label}</Text>
          {estaEditando ? (
            <TouchableOpacity 
              style={[styles.campoInputSelector, esEditable && styles.campoInputSelectorEditable]}
              onPress={() => abrirModal(campo)}
              activeOpacity={0.7}
              disabled={!esEditable}
            >
              <Text style={[
                styles.campoValue, 
                { fontFamily: "Aller_Bd" },
                !esEditable && styles.campoValueNoEditable
              ]}>
                {value || `Seleccionar ${label.toLowerCase()}`}
              </Text>
              {esEditable && (
                <View style={styles.selectorIcon}>
                  <Ionicons name="chevron-down" size={18} color="#666" />
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={[styles.campoInputSelector, styles.campoInputNoEditable]}>
              <Text style={[styles.campoValue, { fontFamily: "Aller_Bd" }]}>
                {value || "No especificado"}
              </Text>
            </View>
          )}
        </View>
      );
    }
    
    return (
      <View style={styles.campoContainer}>
        <Text style={[styles.campoLabel, { fontFamily: "Aller_Rg" }]}>{label}</Text>
        <TextInput
          style={[campoStyle, { fontFamily: esEditable ? "Aller_Rg" : "Aller_Bd" }]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={esEditable ? `Ingresa tu ${label.toLowerCase()}` : ""}
          placeholderTextColor="#999"
          editable={esEditable}
          selectTextOnFocus={esEditable}
        />
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
        <Header navigation={navigation} />
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
            <Text style={[styles.loadingText, { fontFamily: "Aller_Rg" }]}>
              Cargando perfil...
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

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
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Contenido principal */}
            <View style={styles.mainContent}>
              {/* Encabezado del Perfil */}
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarBackground}>
                    <Ionicons name="person" size={50} color="#FFF" />
                  </View>
                </View>
                <Text style={[styles.welcomeText, { fontFamily: "Aller_BdIt" }]}>
                  ¡Hola, {datosUsuario.nombre || "Usuario"}!
                </Text>
                <Text style={[styles.emailText, { fontFamily: "Aller_Rg" }]}>
                  {datosUsuario.email}
                </Text>
                {datosUsuario.fechaRegistro && (
                  <View style={styles.registroBadge}>
                    <Ionicons name="calendar" size={14} color="#12A14B" />
                    <Text style={[styles.registroText, { fontFamily: "Aller_Rg" }]}>
                      Miembro desde: {formatearFecha(datosUsuario.fechaRegistro)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Tarjeta de Información Personal */}
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardIcon}>
                      <Ionicons name="person-circle" size={22} color="#12A14B" />
                    </View>
                    <Text style={[styles.cardTitle, { fontFamily: "Aller_BdIt" }]}>
                      Información Personal
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setEditando(!editando)}
                    disabled={guardando}
                    activeOpacity={0.8}
                  >
                    {guardando && tipoGuardado === 'personal' ? (
                      <ActivityIndicator size="small" color="#12A14B" />
                    ) : (
                      <>
                        <Ionicons 
                          name={editando ? "close-circle" : "create"} 
                          size={18} 
                          color={editando ? "#E74C3C" : "#666"} 
                        />
                        <Text style={[styles.editText, editando && styles.editTextCancel, { fontFamily: "Aller_Bd" }]}>
                          {editando ? "Cancelar" : "Editar"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <View style={editando ? styles.editContainer : styles.viewContainer}>
                    {renderCampo("Nombre", datosUsuario.nombre, "nombre", false, 'personal')}
                    {renderCampo("Apellido", datosUsuario.apellido, "apellido", false, 'personal')}
                    {renderCampo("Teléfono", datosUsuario.telefono, "telefono", false, 'personal')}
                    
                    {/* Botón de guardar dentro del ScrollView */}
                    {editando && (
                      <TouchableOpacity 
                        style={[styles.guardarButton, guardando && styles.guardarButtonDisabled]}
                        onPress={() => handleGuardarCambios('personal')}
                        disabled={guardando}
                        activeOpacity={0.9}
                      >
                        {guardando && tipoGuardado === 'personal' ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <Text style={[styles.guardarText, { fontFamily: "Aller_Bd" }]}>
                              Guardar Cambios
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Tarjeta de Dirección */}
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.cardIcon}>
                      <Ionicons name="location" size={22} color="#12A14B" />
                    </View>
                    <Text style={[styles.cardTitle, { fontFamily: "Aller_BdIt" }]}>
                      Dirección de Envío
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setEditandoDireccion(!editandoDireccion)}
                    disabled={guardando}
                    activeOpacity={0.8}
                  >
                    {guardando && tipoGuardado === 'direccion' ? (
                      <ActivityIndicator size="small" color="#12A14B" />
                    ) : (
                      <>
                        <Ionicons 
                          name={editandoDireccion ? "close-circle" : "create"} 
                          size={18} 
                          color={editandoDireccion ? "#E74C3C" : "#666"} 
                        />
                        <Text style={[styles.editText, editandoDireccion && styles.editTextCancel, { fontFamily: "Aller_Bd" }]}>
                          {editandoDireccion ? "Cancelar" : "Editar"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <View style={editandoDireccion ? styles.editContainer : styles.viewContainer}>
                    {renderCampo("Dirección", datosUsuario.direccion, "direccion", false, 'direccion')}
                    {renderCampo("Ciudad", datosUsuario.ciudad, "ciudad", false, 'direccion')}
                    {renderCampo("Departamento", datosUsuario.departamento, "departamento", true, 'direccion')}
                    {renderCampo("País", datosUsuario.pais, "pais", true, 'direccion')}

                    {/* Botón de guardar dentro del ScrollView */}
                    {editandoDireccion && (
                      <TouchableOpacity 
                        style={[styles.guardarButton, guardando && styles.guardarButtonDisabled]}
                        onPress={() => handleGuardarCambios('direccion')}
                        disabled={guardando}
                        activeOpacity={0.9}
                      >
                        {guardando && tipoGuardado === 'direccion' ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <Text style={[styles.guardarText, { fontFamily: "Aller_Bd" }]}>
                              Guardar Dirección
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Botón de Cerrar Sesión dentro del ScrollView */}
              <View style={styles.logoutContainer}>
                <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={handleLogout}
                  activeOpacity={0.9}
                >
                  <Ionicons name="log-out" size={22} color="#FFF" />
                  <Text style={[styles.logoutText, { fontFamily: "Aller_Bd" }]}>
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer AL FINAL del ScrollView */}
            <View style={styles.footerContainer}>
              <Footer />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* Modal de confirmación para cerrar sesión */}
      <Modal
        visible={modalConfirmacionVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalConfirmacionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalConfirmacion}>
            <View style={styles.modalConfirmacionHeader}>
              <View style={styles.modalConfirmacionIcon}>
                <Ionicons name="log-out" size={32} color="#E74C3C" />
              </View>
              <Text style={[styles.modalConfirmacionTitle, { fontFamily: "Aller_Bd" }]}>
                Cerrar Sesión
              </Text>
            </View>
            
            <Text style={[styles.modalConfirmacionText, { fontFamily: "Aller_Rg" }]}>
              ¿Estás seguro de que deseas salir de tu cuenta?
            </Text>
            
            <View style={styles.modalConfirmacionButtons}>
              <TouchableOpacity 
                style={[styles.modalConfirmacionButton, styles.modalCancelButton]}
                onPress={() => setModalConfirmacionVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalConfirmacionButtonText, { fontFamily: "Aller_Bd" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalConfirmacionButton, styles.modalConfirmButton]}
                onPress={confirmarLogout}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalConfirmacionButtonText, styles.modalConfirmButtonText, { fontFamily: "Aller_Bd" }]}>
                  Sí, Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito (para guardar cambios y cerrar sesión) */}
      <Modal
        visible={modalExitoVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalExito}>
            <View style={styles.modalExitoIcon}>
              <Ionicons name="checkmark-circle" size={60} color="#2ECC71" />
            </View>
            <Text style={[styles.modalExitoTitle, { fontFamily: "Aller_Bd" }]}>
              ¡Operación Exitosa!
            </Text>
            <Text style={[styles.modalExitoText, { fontFamily: "Aller_Rg" }]}>
              {tipoGuardado === 'personal' 
                ? "Tu información personal se ha actualizado correctamente."
                : tipoGuardado === 'direccion'
                ? "Tu dirección de envío se ha actualizado correctamente."
                : "Has cerrado sesión exitosamente."}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal para selección (departamento/país) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSeleccion}>
            <View style={styles.modalSeleccionHeader}>
              <Text style={[styles.modalSeleccionTitle, { fontFamily: "Aller_Bd" }]}>
                Seleccionar {campoEditando === "departamento" ? "Departamento" : "País"}
              </Text>
            </View>
            <FlatList
              data={campoEditando === "departamento" ? departamentosBolivia : paises}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalSeleccionItem}
                  onPress={() => seleccionarOpcion(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalSeleccionItemText, { fontFamily: "Aller_Rg" }]}>
                    {item}
                  </Text>
                  {datosUsuario[campoEditando] === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity 
              style={styles.modalSeleccionCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalSeleccionCloseText, { fontFamily: "Aller_Bd" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  
  // Encabezado del Perfil
  profileHeader: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#12A14B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeText: {
    fontSize: 24,
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  registroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  registroText: {
    fontSize: 12,
    color: '#12A14B',
  },
  
  // Tarjetas de Información
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: '#2C3E50',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 10,
    gap: 6,
  },
  editText: {
    fontSize: 14,
    color: '#666',
  },
  editTextCancel: {
    color: '#E74C3C',
  },
  cardContent: {
    padding: 20,
  },
  editContainer: {
    backgroundColor: 'rgba(18, 161, 75, 0.03)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(18, 161, 75, 0.1)',
  },
  viewContainer: {
    padding: 5,
  },
  
  // Campos de formulario
  campoContainer: {
    marginBottom: 18,
  },
  campoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  campoValue: {
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 12,
  },
  campoValueNoEditable: {
    color: '#666',
  },
  
  // Estilos para campos de entrada
  campoInputEditable: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#12A14B',
    fontSize: 16,
    color: '#2C3E50',
  },
  
  campoInputNoEditable: {
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#2C3E50',
    opacity: 0.8,
  },
  
  campoInputSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  campoInputSelectorEditable: {
    borderColor: '#12A14B',
    backgroundColor: '#FFF',
  },
  
  selectorIcon: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
  },
  
  // Botón Guardar
  guardarButton: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  guardarButtonDisabled: {
    backgroundColor: '#CCC',
    shadowColor: '#999',
  },
  guardarText: {
    color: '#FFF',
    fontSize: 16,
  },
  
  // Contenedor para botón de cerrar sesión
  logoutContainer: {
    marginBottom: 40,
  },
  
  // Botón Cerrar Sesión (dentro del ScrollView)
  logoutButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
  },
  
  // Footer Container (IGUAL que en LoginScreen)
  footerContainer: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  
  // Modals Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Modal de Confirmación (Cerrar Sesión)
  modalConfirmacion: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalConfirmacionHeader: {
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalConfirmacionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalConfirmacionTitle: {
    fontSize: 22,
    color: '#2C3E50',
    textAlign: 'center',
  },
  modalConfirmacionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  modalConfirmacionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  modalConfirmacionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  modalConfirmButton: {
    backgroundColor: '#2ECC71',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalConfirmacionButtonText: {
    fontSize: 16,
    fontFamily: 'Aller_Bd',
  },
  modalConfirmButtonText: {
    color: '#FFF',
  },
  
  // Modal de Éxito
  modalExito: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalExitoIcon: {
    marginBottom: 20,
  },
  modalExitoTitle: {
    fontSize: 22,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalExitoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Modal de Selección
  modalSeleccion: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalSeleccionHeader: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalSeleccionTitle: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
  },
  modalSeleccionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalSeleccionItemText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  modalSeleccionCloseButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  modalSeleccionCloseText: {
    fontSize: 16,
    color: '#666',
  },
});