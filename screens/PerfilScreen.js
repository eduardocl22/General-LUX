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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
  const [campoEditando, setCampoEditando] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

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
      Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosUsuario();
  }, [user]);

  const mostrarAlertaElegante = (titulo, mensaje, onConfirm = null) => {
    return new Promise((resolve) => {
      Alert.alert(
        titulo,
        mensaje,
        [
          {
            text: "Aceptar",
            onPress: () => {
              resolve(true);
              if (onConfirm) onConfirm();
            },
            style: "default"
          }
        ],
        { cancelable: false }
      );
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      "🔒 Cerrar Sesión",
      "¿Estás seguro de que deseas salir de tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Cancelado")
        },
        {
          text: "Sí, Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              mostrarAlertaElegante(
                "👋 Sesión Cerrada", 
                "Has cerrado sesión exitosamente.\n\n¡Esperamos verte pronto!",
                () => navigation.navigate("Inicio")
              );
            } catch (error) {
              mostrarAlertaElegante("❌ Error", error.message);
            }
          }
        }
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("Alerta cerrada")
      }
    );
  };

  const handleGuardarCambios = async (tipo) => {
    if (!user) return;
    
    try {
      setGuardando(true);
      
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

      await mostrarAlertaElegante(
        "✅ ¡Éxito!", 
        tipo === 'personal' ? 
          "Tu información personal se ha actualizado correctamente." :
          "Tu dirección de envío se ha actualizado correctamente."
      );

      if (tipo === 'personal') {
        setEditando(false);
      } else {
        setEditandoDireccion(false);
      }
    } catch (error) {
      console.error("Error guardando datos:", error);
      mostrarAlertaElegante("❌ Error", "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
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

  const renderCampo = (label, value, campo, esEditable = true, esSelector = false, seccion = 'personal') => {
    const estaEditando = seccion === 'personal' ? editando : editandoDireccion;
    
    return (
      <View style={styles.campoContainer}>
        <Text style={styles.campoLabel}>{label}</Text>
        {estaEditando && esEditable ? (
          esSelector ? (
            <TouchableOpacity 
              style={styles.campoInput}
              onPress={() => abrirModal(campo)}
            >
              <Text style={styles.campoValue}>{value || `Seleccionar ${label.toLowerCase()}`}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.campoInputEdit}
              value={value}
              onChangeText={(texto) => setDatosUsuario(prev => ({ ...prev, [campo]: texto }))}
              placeholder={`Ingresa tu ${label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          )
        ) : (
          <Text style={styles.campoValue}>{value || "No especificado"}</Text>
        )}
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={styles.background}
          resizeMode="cover"
          imageStyle={{ opacity: 0.15 }}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        </ImageBackground>
        <Footer />
      </View>
    );
  }

  // Estadísticas dinámicas
  const estadisticas = {
    compras: 2, // Esto vendría de tu base de datos
    carrito: cartItems.length,
    pendientes: 1 // Esto vendría de tu base de datos
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            
            {/* Header del Perfil */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={80} color="#12A14B" />
              </View>
              <Text style={styles.welcomeText}>
                ¡Hola, {datosUsuario.nombre || "Usuario"}!
              </Text>
              <Text style={styles.emailText}>{datosUsuario.email}</Text>
              {datosUsuario.fechaRegistro && (
                <Text style={styles.registroText}>
                  Miembro desde: {formatearFecha(datosUsuario.fechaRegistro)}
                </Text>
              )}
            </View>

            {/* Tarjeta de Información Personal */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="person-outline" size={24} color="#12A14B" />
                <Text style={styles.cardTitle}>Información Personal</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditando(!editando)}
                  disabled={guardando}
                >
                  {guardando ? (
                    <ActivityIndicator size="small" color="#12A14B" />
                  ) : (
                    <>
                      <Ionicons 
                        name={editando ? "close" : "pencil"} 
                        size={20} 
                        color={editando ? "#e74c3c" : "#666"} 
                      />
                      <Text style={[styles.editText, editando && styles.editTextCancel]}>
                        {editando ? "Cancelar" : "Editar"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {renderCampo("Nombre", datosUsuario.nombre, "nombre", true, false, 'personal')}
              {renderCampo("Apellido", datosUsuario.apellido, "apellido", true, false, 'personal')}
              {renderCampo("Teléfono", datosUsuario.telefono, "telefono", true, false, 'personal')}
              {renderCampo("Email", datosUsuario.email, "email", false, false, 'personal')}

              {editando && (
                <TouchableOpacity 
                  style={[styles.guardarButton, guardando && styles.guardarButtonDisabled]}
                  onPress={() => handleGuardarCambios('personal')}
                  disabled={guardando}
                >
                  {guardando ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.guardarText}>Guardar Información</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Tarjeta de Dirección */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="location-outline" size={24} color="#12A14B" />
                <Text style={styles.cardTitle}>Dirección de Envío</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditandoDireccion(!editandoDireccion)}
                  disabled={guardando}
                >
                  {guardando ? (
                    <ActivityIndicator size="small" color="#12A14B" />
                  ) : (
                    <>
                      <Ionicons 
                        name={editandoDireccion ? "close" : "pencil"} 
                        size={20} 
                        color={editandoDireccion ? "#e74c3c" : "#666"} 
                      />
                      <Text style={[styles.editText, editandoDireccion && styles.editTextCancel]}>
                        {editandoDireccion ? "Cancelar" : "Editar"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {renderCampo("Dirección", datosUsuario.direccion, "direccion", true, false, 'direccion')}
              {renderCampo("Ciudad", datosUsuario.ciudad, "ciudad", true, false, 'direccion')}
              {renderCampo("Departamento", datosUsuario.departamento, "departamento", true, true, 'direccion')}
              {renderCampo("País", datosUsuario.pais, "pais", true, true, 'direccion')}

              {editandoDireccion && (
                <TouchableOpacity 
                  style={[styles.guardarButton, guardando && styles.guardarButtonDisabled]}
                  onPress={() => handleGuardarCambios('direccion')}
                  disabled={guardando}
                >
                  {guardando ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.guardarText}>Guardar Dirección</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Estadísticas del Usuario */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Mi Actividad</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="cart-outline" size={28} color="#12A14B" />
                  <Text style={styles.statNumber}>{estadisticas.compras}</Text>
                  <Text style={styles.statLabel}>Compras</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="bag-handle-outline" size={28} color="#12A14B" />
                  <Text style={styles.statNumber}>{estadisticas.carrito}</Text>
                  <Text style={styles.statLabel}>Carrito</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={28} color="#12A14B" />
                  <Text style={styles.statNumber}>{estadisticas.pendientes}</Text>
                  <Text style={styles.statLabel}>Pendientes</Text>
                </View>
              </View>
            </View>

            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FFF" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
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
              Seleccionar {campoEditando.charAt(0).toUpperCase() + campoEditando.slice(1)}
            </Text>
            <FlatList
              data={campoEditando === "departamento" ? departamentosBolivia : paises}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => seleccionarOpcion(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {datosUsuario[campoEditando] === item && (
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
    padding: 20,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#666",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 5,
    textAlign: "center",
  },
  emailText: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  registroText: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 25,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginLeft: 10,
    flex: 1,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  editText: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#666",
    marginLeft: 5,
  },
  editTextCancel: {
    color: "#e74c3c",
    fontFamily: "Aller_Bd",
  },
  campoContainer: {
    marginBottom: 20,
  },
  campoLabel: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    color: "#555",
    marginBottom: 8,
  },
  campoValue: {
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
    paddingVertical: 8,
  },
  campoInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  campoInputEdit: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
  },
  guardarButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#12A14B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  guardarButtonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "#999",
  },
  guardarText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Aller_Bd",
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 25,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    padding: 10,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Aller_Rg",
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Aller_Bd",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
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