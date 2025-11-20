// screens/DetallesCompraScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  ImageBackground,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Habilitar animaciones suaves en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetallesCompraScreen = () => {
  const navigation = useNavigation();
  const { cartItems, subtotal: total, clearCart } = useCart();
  const { user } = useAuth();

  // Estados principales
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // Estados para tarjetas
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: ""
  });
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const [tarjetasGuardadas, setTarjetasGuardadas] = useState([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [mostrarFormularioTarjeta, setMostrarFormularioTarjeta] = useState(false);

  // Animaciones
  const alturaTarjeta = useRef(new Animated.Value(0)).current;
  const alturaQR = useRef(new Animated.Value(0)).current;

  // Cargar datos del usuario
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (!user) return;
      
      try {
        setCargandoDatos(true);
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDatosUsuario(userData);
          
          // Cargar tarjetas guardadas si existen
          if (userData.tarjetasGuardadas) {
            setTarjetasGuardadas(userData.tarjetasGuardadas);
          }
        } else {
          setDatosUsuario({
            nombre: "",
            apellido: "",
            telefono: "",
            direccion: "",
            ciudad: "",
            departamento: ""
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setDatosUsuario({
          nombre: "",
          apellido: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          departamento: ""
        });
      } finally {
        setCargandoDatos(false);
      }
    };

    if (user) {
      cargarDatosUsuario();
    }
  }, [user]);

  // Validar usuario
  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Inicio de sesión requerido",
        "Debes iniciar sesión para continuar con la compra.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Ir a Login", 
            onPress: () => navigation.navigate("Login")
          },
        ]
      );
    }
  }, [user, navigation]);

  // Animaciones
  const animarPanel = (ref, open) => {
    Animated.timing(ref, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Manejar selección de método de pago
  const seleccionarMetodo = (metodo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (metodoSeleccionado === metodo) {
      setMetodoSeleccionado(null);
      animarPanel(alturaTarjeta, false);
      animarPanel(alturaQR, false);
      setMostrarFormularioTarjeta(false);
    } else {
      setMetodoSeleccionado(metodo);
      
      if (metodo === "tarjeta") {
        animarPanel(alturaTarjeta, true);
        animarPanel(alturaQR, false);
        
        // Si no hay tarjetas guardadas, mostrar formulario directamente
        if (tarjetasGuardadas.length === 0) {
          setMostrarFormularioTarjeta(true);
        }
      } else if (metodo === "qr") {
        animarPanel(alturaTarjeta, false);
        animarPanel(alturaQR, true);
      }
    }
  };

  // Interpolaciones para animaciones
  const panelTarjeta = alturaTarjeta.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tarjetasGuardadas.length > 0 && !mostrarFormularioTarjeta ? 350 : 450],
  });

  const panelQR = alturaQR.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  // Validaciones para tarjetas
  const validarNumeroTarjeta = (numero) => {
    const numeroLimpio = numero.replace(/\s/g, '');
    return /^\d{16}$/.test(numeroLimpio);
  };

  const validarCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validarVencimiento = (vencimiento) => {
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) return false;
    
    const [mes, año] = vencimiento.split('/').map(Number);
    const ahora = new Date();
    const añoActual = ahora.getFullYear() % 100;
    const mesActual = ahora.getMonth() + 1;
    
    if (año < añoActual) return false;
    if (año === añoActual && mes < mesActual) return false;
    if (mes < 1 || mes > 12) return false;
    
    return true;
  };

  const detectarTipoTarjeta = (numero) => {
    const numeroLimpio = numero.replace(/\s/g, '');
    
    if (/^4/.test(numeroLimpio)) return "Visa";
    if (/^5[1-5]/.test(numeroLimpio)) return "Mastercard";
    if (/^3[47]/.test(numeroLimpio)) return "American Express";
    
    return "Tarjeta";
  };

  // Formateadores
  const formatearNumeroTarjeta = (texto) => {
    const textoLimpio = texto.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const grupos = textoLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : textoLimpio;
  };

  const formatearVencimiento = (texto) => {
    const textoLimpio = texto.replace(/[^0-9]/g, '');
    if (textoLimpio.length >= 3) {
      return textoLimpio.slice(0, 2) + '/' + textoLimpio.slice(2, 4);
    }
    return textoLimpio;
  };

  // Guardar tarjeta en Firestore
  const guardarTarjetaEnBD = async (tarjetaData) => {
    if (!user) return false;
    
    try {
      await updateDoc(doc(db, "usuarios", user.uid), {
        tarjetasGuardadas: arrayUnion(tarjetaData)
      });
      return true;
    } catch (error) {
      console.error("Error guardando tarjeta:", error);
      return false;
    }
  };

  // Manejo de cambios en tarjeta
  const handleCambioTarjeta = (campo, valor) => {
    setDatosTarjeta(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const seleccionarTarjetaGuardada = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta.id);
    setDatosTarjeta({
      numero: `•••• •••• •••• ${tarjeta.ultimosDigitos}`,
      nombre: tarjeta.nombre,
      vencimiento: tarjeta.vencimiento,
      cvv: ""
    });
    setMostrarFormularioTarjeta(false);
  };

  const usarNuevaTarjeta = () => {
    setTarjetaSeleccionada(null);
    setDatosTarjeta({
      numero: "",
      nombre: "",
      vencimiento: "",
      cvv: ""
    });
    setMostrarFormularioTarjeta(true);
    setGuardarTarjeta(false);
  };

  const procesarGuardadoTarjeta = async () => {
    // Validar campos antes de guardar
    if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) {
      Alert.alert("Datos incompletos", "Por favor completa todos los campos de la tarjeta.");
      return;
    }
    
    if (!validarNumeroTarjeta(datosTarjeta.numero)) {
      Alert.alert("Número de tarjeta inválido", "El número de tarjeta debe tener 16 dígitos.");
      return;
    }
    
    if (!validarVencimiento(datosTarjeta.vencimiento)) {
      Alert.alert("Fecha de vencimiento inválida", "Por favor ingresa una fecha de vencimiento válida (MM/AA).");
      return;
    }
    
    if (!validarCVV(datosTarjeta.cvv)) {
      Alert.alert("CVV inválido", "El código de seguridad debe tener 3 o 4 dígitos.");
      return;
    }

    const nuevaTarjeta = {
      id: Date.now().toString(),
      ultimosDigitos: datosTarjeta.numero.replace(/\s/g, '').slice(-4),
      tipo: detectarTipoTarjeta(datosTarjeta.numero),
      nombre: datosTarjeta.nombre,
      vencimiento: datosTarjeta.vencimiento
    };

    const exito = await guardarTarjetaEnBD(nuevaTarjeta);
    
    if (exito) {
      setTarjetasGuardadas(prev => [...prev, nuevaTarjeta]);
      setTarjetaSeleccionada(nuevaTarjeta.id);
      setDatosTarjeta({
        numero: `•••• •••• •••• ${nuevaTarjeta.ultimosDigitos}`,
        nombre: nuevaTarjeta.nombre,
        vencimiento: nuevaTarjeta.vencimiento,
        cvv: ""
      });
      setMostrarFormularioTarjeta(false);
      setGuardarTarjeta(false);
      Alert.alert("✅ Tarjeta guardada", "Tu tarjeta se ha guardado correctamente para futuras compras.");
    } else {
      Alert.alert("❌ Error", "No se pudo guardar la tarjeta. Intenta nuevamente.");
    }
  };

  // Validar carrito vacío
  const carritoVacio = !cartItems || cartItems.length === 0;

  // Procesar pago
  const procesarPago = () => {
    if (!metodoSeleccionado) {
      Alert.alert("Método de pago requerido", "Por favor selecciona un método de pago.");
      return;
    }

    if (metodoSeleccionado === "tarjeta") {
      if (tarjetaSeleccionada) {
        // Validar CVV para tarjeta guardada
        if (!datosTarjeta.cvv || !validarCVV(datosTarjeta.cvv)) {
          Alert.alert("CVV inválido", "Por favor ingresa el código de seguridad de tu tarjeta.");
          return;
        }
      } else {
        // Validar todos los campos para nueva tarjeta
        if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) {
          Alert.alert("Datos incompletos", "Por favor completa todos los campos de la tarjeta.");
          return;
        }
        
        if (!validarNumeroTarjeta(datosTarjeta.numero)) {
          Alert.alert("Número de tarjeta inválido", "El número de tarjeta debe tener 16 dígitos.");
          return;
        }
        
        if (!validarVencimiento(datosTarjeta.vencimiento)) {
          Alert.alert("Fecha de vencimiento inválida", "Por favor ingresa una fecha de vencimiento válida (MM/AA).");
          return;
        }
        
        if (!validarCVV(datosTarjeta.cvv)) {
          Alert.alert("CVV inválido", "El código de seguridad debe tener 3 o 4 dígitos.");
          return;
        }

        // Si el usuario quiere guardar la tarjeta
        if (guardarTarjeta) {
          Alert.alert(
            "Guardar tarjeta",
            "¿Deseas guardar esta tarjeta para futuras compras?",
            [
              {
                text: "No guardar",
                style: "cancel",
                onPress: () => confirmarPago()
              },
              {
                text: "Sí, guardar",
                onPress: () => {
                  procesarGuardadoTarjeta().then(() => {
                    confirmarPago();
                  });
                }
              }
            ]
          );
          return;
        }
      }
    }

    confirmarPago();
  };

  const confirmarPago = () => {
    Alert.alert(
      "¡Compra realizada con éxito!", 
      `Gracias por tu compra.\nTotal: Bs. ${total?.toFixed(2)}\nMétodo: ${metodoSeleccionado === 'tarjeta' ? 'Tarjeta' : 'QR'}`,
      [
        { 
          text: "Continuar", 
          onPress: () => {
            clearCart();
            navigation.navigate("Inicio");
          }
        }
      ]
    );
  };

  // Si está cargando, mostrar spinner
  if (cargandoDatos) {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.15 }}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        </ImageBackground>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.15 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.tituloPrincipal}>Finalizar Compra</Text>

          {carritoVacio ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Tu carrito está vacío</Text>
              <TouchableOpacity
                style={styles.botonSeguirComprando}
                onPress={() => navigation.navigate("Inicio")}
              >
                <Text style={styles.botonTexto}>Seguir comprando</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.verticalLayout}>
              
              {/* SECCIÓN 1: RESUMEN DE COMPRA */}
              <View style={styles.seccion}>
                <View style={styles.headerSeccion}>
                  <Ionicons name="receipt-outline" size={24} color="#12A14B" />
                  <Text style={styles.subtitulo}>Resumen del Pedido</Text>
                </View>

                <View style={styles.resumenCard}>
                  {cartItems.map((item, index) => (
                    <View key={index} style={styles.resumenItem}>
                      {item.imagen ? (
                        <Image
                          source={item.imagen}
                          style={styles.resumenImg}
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={[styles.resumenImg, styles.resumenImgPlaceholder]}>
                          <Ionicons name="image-outline" size={24} color="#999" />
                        </View>
                      )}
                      <View style={styles.resumenInfo}>
                        <Text style={styles.resumenNombre}>{item.nombre}</Text>
                        <Text style={styles.resumenDetalle}>
                          Cantidad: {item.cantidad} × Bs. {item.precio?.toFixed(2) || "0.00"}
                        </Text>
                        <Text style={styles.resumenSubtotal}>
                          Bs. {(item.cantidad * item.precio).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.resumenTotalBox}>
                    <Text style={styles.resumenTotalLabel}>Total a pagar:</Text>
                    <Text style={styles.resumenTotal}>Bs. {total?.toFixed(2) || "0.00"}</Text>
                  </View>
                </View>
              </View>

              {/* SECCIÓN 2: INFORMACIÓN DE ENVÍO */}
              {datosUsuario && (
                <View style={styles.seccion}>
                  <View style={styles.headerSeccion}>
                    <Ionicons name="location-outline" size={24} color="#12A14B" />
                    <Text style={styles.subtitulo}>Información de Envío</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Nombre:</Text>
                      <Text style={styles.infoValue}>
                        {datosUsuario?.nombre || "No especificado"} {datosUsuario?.apellido || ""}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Teléfono:</Text>
                      <Text style={styles.infoValue}>{datosUsuario?.telefono || "No especificado"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Dirección:</Text>
                      <Text style={styles.infoValue}>
                        {datosUsuario?.direccion || "No especificado"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Ciudad:</Text>
                      <Text style={styles.infoValue}>
                        {datosUsuario?.ciudad || "No especificado"}, {datosUsuario?.departamento || "No especificado"}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.editarInfoButton}
                      onPress={() => navigation.navigate("Perfil")}
                    >
                      <Ionicons name="pencil" size={16} color="#12A14B" />
                      <Text style={styles.editarInfoText}>Editar información</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SECCIÓN 3: MÉTODOS DE PAGO */}
              <View style={styles.seccion}>
                <View style={styles.headerSeccion}>
                  <Ionicons name="card-outline" size={24} color="#12A14B" />
                  <Text style={styles.subtitulo}>Método de Pago</Text>
                </View>

                <View style={styles.metodosPagoContainer}>
                  
                  {/* Método Tarjeta */}
                  <View style={[
                    styles.metodoPagoContainer,
                    metodoSeleccionado === "tarjeta" && styles.metodoPagoSeleccionado
                  ]}>
                    <TouchableOpacity
                      style={styles.metodoPagoHeader}
                      onPress={() => seleccionarMetodo("tarjeta")}
                    >
                      <View style={styles.metodoInfo}>
                        <View style={styles.radioContainer}>
                          <View
                            style={[
                              styles.radio,
                              metodoSeleccionado === "tarjeta" && styles.radioSeleccionado,
                            ]}
                          />
                        </View>
                        <Ionicons name="card" size={24} color="#12A14B" style={styles.metodoIcon} />
                        <View style={styles.metodoTextos}>
                          <Text style={styles.metodoTitulo}>Tarjeta de Crédito o Débito</Text>
                          <Text style={styles.metodoDescripcion}>Pago seguro con tarjeta</Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={metodoSeleccionado === "tarjeta" ? "chevron-up" : "chevron-down"} 
                        size={22} 
                        color="#666" 
                      />
                    </TouchableOpacity>

                    <Animated.View style={[styles.panelDesplegable, { height: panelTarjeta }]}>
                      
                      {/* Tarjetas Guardadas */}
                      {tarjetasGuardadas.length > 0 && !mostrarFormularioTarjeta && (
                        <View style={styles.tarjetasGuardadasSection}>
                          <Text style={styles.tarjetasGuardadasTitle}>Tarjetas Guardadas</Text>
                          {tarjetasGuardadas.map((tarjeta) => (
                            <TouchableOpacity
                              key={tarjeta.id}
                              style={[
                                styles.tarjetaGuardada,
                                tarjetaSeleccionada === tarjeta.id && styles.tarjetaGuardadaSeleccionada
                              ]}
                              onPress={() => seleccionarTarjetaGuardada(tarjeta)}
                            >
                              <View style={styles.tarjetaInfo}>
                                <Ionicons 
                                  name="card" 
                                  size={20} 
                                  color={tarjetaSeleccionada === tarjeta.id ? "#12A14B" : "#666"} 
                                />
                                <View style={styles.tarjetaDetalles}>
                                  <Text style={styles.tarjetaTipo}>{tarjeta.tipo} •••• {tarjeta.ultimosDigitos}</Text>
                                  <Text style={styles.tarjetaNombre}>{tarjeta.nombre}</Text>
                                  <Text style={styles.tarjetaVencimiento}>Vence: {tarjeta.vencimiento}</Text>
                                </View>
                              </View>
                              {tarjetaSeleccionada === tarjeta.id && (
                                <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                              )}
                            </TouchableOpacity>
                          ))}
                          
                          <TouchableOpacity 
                            style={styles.usarNuevaTarjetaButton}
                            onPress={usarNuevaTarjeta}
                          >
                            <Ionicons name="add-circle-outline" size={18} color="#12A14B" />
                            <Text style={styles.usarNuevaTarjetaText}>Agregar nueva tarjeta</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Formulario de Nueva Tarjeta */}
                      {(mostrarFormularioTarjeta || tarjetasGuardadas.length === 0) && (
                        <View style={styles.formularioTarjeta}>
                          <Text style={styles.formularioTitle}>
                            {tarjetasGuardadas.length === 0 ? "Agregar Tarjeta" : "Nueva Tarjeta"}
                          </Text>
                          
                          <View style={styles.campoTarjeta}>
                            <Text style={styles.labelCampo}>Número de tarjeta</Text>
                            <TextInput
                              style={styles.inputReal}
                              placeholder=""
                              value={datosTarjeta.numero}
                              onChangeText={(texto) => handleCambioTarjeta('numero', formatearNumeroTarjeta(texto))}
                              keyboardType="numeric"
                              maxLength={19}
                              placeholderTextColor="#999"
                            />
                            {datosTarjeta.numero && (
                              <Text style={styles.tipoTarjeta}>
                                {detectarTipoTarjeta(datosTarjeta.numero)}
                              </Text>
                            )}
                          </View>
                          
                          <Text style={styles.labelCampo}>Nombre en la tarjeta</Text>
                          <TextInput
                            style={styles.inputReal}
                            placeholder=""
                            value={datosTarjeta.nombre}
                            onChangeText={(texto) => handleCambioTarjeta('nombre', texto.toUpperCase())}
                            placeholderTextColor="#999"
                          />
                          
                          <View style={styles.rowCampos}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.labelCampo}>Vencimiento (MM/AA)</Text>
                              <TextInput
                                style={styles.inputReal}
                                placeholder=""
                                value={datosTarjeta.vencimiento}
                                onChangeText={(texto) => handleCambioTarjeta('vencimiento', formatearVencimiento(texto))}
                                keyboardType="numeric"
                                maxLength={5}
                                placeholderTextColor="#999"
                              />
                            </View>
                            <View style={{ width: 15 }} />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.labelCampo}>CVV</Text>
                              <TextInput
                                style={styles.inputReal}
                                placeholder=""
                                value={datosTarjeta.cvv}
                                onChangeText={(texto) => handleCambioTarjeta('cvv', texto.replace(/[^0-9]/g, ''))}
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                placeholderTextColor="#999"
                              />
                            </View>
                          </View>

                          <TouchableOpacity 
                            style={styles.guardarTarjetaOption}
                            onPress={() => setGuardarTarjeta(!guardarTarjeta)}
                          >
                            <View style={styles.checkboxContainer}>
                              <View style={[styles.checkbox, guardarTarjeta && styles.checkboxSeleccionado]}>
                                {guardarTarjeta && <Ionicons name="checkmark" size={14} color="#FFF" />}
                              </View>
                            </View>
                            <Text style={styles.guardarTarjetaText}>
                              Guardar esta tarjeta para futuras compras
                            </Text>
                          </TouchableOpacity>

                          {guardarTarjeta && (
                            <TouchableOpacity 
                              style={[
                                styles.botonGuardarTarjeta,
                                (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) && 
                                styles.botonGuardarTarjetaDisabled
                              ]}
                              onPress={procesarGuardadoTarjeta}
                              disabled={!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv}
                            >
                              <Ionicons name="save-outline" size={18} color="#FFF" />
                              <Text style={styles.botonGuardarTarjetaText}>Guardar Tarjeta</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}

                      {/* CVV para tarjeta guardada */}
                      {tarjetaSeleccionada && !mostrarFormularioTarjeta && (
                        <View style={styles.cvvSection}>
                          <Text style={styles.labelCampo}>Código de seguridad (CVV)</Text>
                          <TextInput
                            style={styles.inputReal}
                            placeholder="Ingresa el CVV"
                            value={datosTarjeta.cvv}
                            onChangeText={(texto) => handleCambioTarjeta('cvv', texto.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            placeholderTextColor="#999"
                          />
                          <Text style={styles.cvvHelp}>
                            El CVV es el número de 3 o 4 dígitos en el reverso de tu tarjeta
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  </View>

                  {/* Método QR */}
                  <View style={[
                    styles.metodoPagoContainer,
                    metodoSeleccionado === "qr" && styles.metodoPagoSeleccionado
                  ]}>
                    <TouchableOpacity
                      style={styles.metodoPagoHeader}
                      onPress={() => seleccionarMetodo("qr")}
                    >
                      <View style={styles.metodoInfo}>
                        <View style={styles.radioContainer}>
                          <View
                            style={[
                              styles.radio,
                              metodoSeleccionado === "qr" && styles.radioSeleccionado,
                            ]}
                          />
                        </View>
                        <Ionicons name="qr-code" size={24} color="#12A14B" style={styles.metodoIcon} />
                        <View style={styles.metodoTextos}>
                          <Text style={styles.metodoTitulo}>Pago con QR</Text>
                          <Text style={styles.metodoDescripcion}>Escanea y paga desde tu banco</Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={metodoSeleccionado === "qr" ? "chevron-up" : "chevron-down"} 
                        size={22} 
                        color="#666" 
                      />
                    </TouchableOpacity>

                    <Animated.View style={[styles.panelDesplegable, { height: panelQR }]}>
                      <Text style={styles.labelCampo}>
                        Escanea el siguiente código QR con tu app bancaria:
                      </Text>
                      <View style={styles.qrContainer}>
                        <View style={styles.qrPlaceholder}>
                          <Ionicons name="qr-code-outline" size={80} color="#12A14B" />
                          <Text style={styles.qrPlaceholderSubtext}>GENERAL LUX</Text>
                          <Text style={styles.qrPlaceholderAmount}>
                            Bs. {total?.toFixed(2) || "0.00"}
                          </Text>
                          <Text style={styles.qrPlaceholderInfo}>
                            Pago seguro y rápido
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.qrTexto}>
                        El pago se confirmará automáticamente en unos minutos.
                      </Text>
                    </Animated.View>
                  </View>
                </View>

                {/* BOTÓN DE PAGO */}
                <TouchableOpacity
                  style={[
                    styles.botonPagar,
                    !metodoSeleccionado && styles.botonPagarDisabled
                  ]}
                  onPress={procesarPago}
                  disabled={!metodoSeleccionado}
                >
                  <Text style={styles.botonTexto}>
                    {metodoSeleccionado ? 'CONFIRMAR COMPRA' : 'SELECCIONA MÉTODO DE PAGO'}
                  </Text>
                  <Ionicons name="lock-closed" size={16} color="#FFF" style={styles.botonIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
    flexGrow: 1,
  },
  tituloPrincipal: {
    fontSize: 28,
    color: "#1a1a1a",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Aller_Bd",
    letterSpacing: 0.5,
  },
  verticalLayout: {
    flex: 1,
  },
  seccion: {
    marginBottom: 30,
  },
  headerSeccion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 20,
    color: "#12A14B",
    marginLeft: 10,
    fontFamily: "Aller_Bd",
    letterSpacing: 0.3,
  },
  // Loading
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
  // Información de envío
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    color: "#555",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
    flex: 2,
    textAlign: "right",
  },
  editarInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 8,
  },
  editarInfoText: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#12A14B",
    marginLeft: 6,
  },
  // Resumen de compra
  resumenCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resumenItem: {
    flexDirection: "row",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resumenImg: {
    width: 75,
    height: 75,
    marginRight: 15,
    borderRadius: 10,
  },
  resumenImgPlaceholder: {
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resumenInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resumenNombre: {
    fontSize: 16,
    color: "#2d2d2d",
    marginBottom: 6,
    fontFamily: "Aller_Bd",
  },
  resumenDetalle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Aller_Rg",
  },
  resumenSubtotal: {
    fontSize: 15,
    color: "#12A14B",
    fontFamily: "Aller_Bd",
  },
  resumenTotalBox: {
    marginTop: 15,
    borderTopWidth: 2,
    borderColor: "#e8e8e8",
    paddingTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumenTotalLabel: {
    fontSize: 18,
    color: "#2d2d2d",
    fontFamily: "Aller_Bd",
  },
  resumenTotal: {
    fontSize: 24,
    color: "#12A14B",
    fontFamily: "Aller_Bd",
  },
  // Métodos de pago
  metodosPagoContainer: {
    gap: 16,
  },
  metodoPagoContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "transparent",
  },
  metodoPagoSeleccionado: {
    borderColor: "#12A14B",
    backgroundColor: "rgba(18, 161, 75, 0.03)",
  },
  metodoPagoHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metodoInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  radioSeleccionado: {
    backgroundColor: "#12A14B",
    borderColor: "#12A14B",
  },
  metodoIcon: {
    marginRight: 12,
  },
  metodoTextos: {
    flex: 1,
  },
  metodoTitulo: {
    fontSize: 16,
    color: "#2d2d2d",
    fontFamily: "Aller_Bd",
    marginBottom: 2,
  },
  metodoDescripcion: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Aller_Rg",
  },
  panelDesplegable: {
    overflow: "hidden",
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  // Tarjetas guardadas
  tarjetasGuardadasSection: {
    marginBottom: 10,
  },
  tarjetasGuardadasTitle: {
    fontSize: 16,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 12,
  },
  tarjetaGuardada: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tarjetaGuardadaSeleccionada: {
    borderColor: "#12A14B",
    backgroundColor: "rgba(18, 161, 75, 0.05)",
  },
  tarjetaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tarjetaDetalles: {
    marginLeft: 12,
    flex: 1,
  },
  tarjetaTipo: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 2,
  },
  tarjetaNombre: {
    fontSize: 12,
    fontFamily: "Aller_Rg",
    color: "#666",
    marginBottom: 2,
  },
  tarjetaVencimiento: {
    fontSize: 11,
    fontFamily: "Aller_Rg",
    color: "#888",
  },
  usarNuevaTarjetaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f8f0",
    borderRadius: 8,
    marginTop: 5,
  },
  usarNuevaTarjetaText: {
    fontSize: 14,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
    marginLeft: 6,
  },
  // Formulario tarjeta
  formularioTarjeta: {
    marginTop: 10,
  },
  formularioTitle: {
    fontSize: 18,
    fontFamily: "Aller_Bd",
    color: "#2d2d2d",
    marginBottom: 15,
    textAlign: "center",
  },
  campoTarjeta: {
    position: "relative",
  },
  tipoTarjeta: {
    position: "absolute",
    right: 15,
    top: 15,
    fontSize: 12,
    fontFamily: "Aller_Bd",
    color: "#12A14B",
  },
  labelCampo: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
    fontFamily: "Aller_Bd",
    marginTop: 5,
  },
  inputReal: {
    height: 52,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Aller_Rg",
    color: "#2d2d2d",
  },
  rowCampos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guardarTarjetaOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 8,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSeleccionado: {
    backgroundColor: "#12A14B",
    borderColor: "#12A14B",
  },
  guardarTarjetaText: {
    fontSize: 14,
    fontFamily: "Aller_Rg",
    color: "#666",
    flex: 1,
  },
  botonGuardarTarjeta: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    elevation: 2,
  },
  botonGuardarTarjetaDisabled: {
    backgroundColor: "#ccc",
  },
  botonGuardarTarjetaText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Aller_Bd",
    marginLeft: 8,
  },
  // CVV
  cvvSection: {
    marginTop: 10,
  },
  cvvHelp: {
    fontSize: 12,
    fontFamily: "Aller_Rg",
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
    textAlign: "center",
  },
  // QR
  qrContainer: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 16,
    alignSelf: "center",
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#12A14B',
    borderStyle: 'dashed',
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderSubtext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#12A14B",
    marginTop: 12,
    fontFamily: "Aller_Bd",
  },
  qrPlaceholderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginTop: 6,
    fontFamily: "Aller_Bd",
  },
  qrPlaceholderInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontFamily: "Aller_Rg",
  },
  qrTexto: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    fontFamily: "Aller_Rg",
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 18,
  },
  // Botones
  botonPagar: {
    marginTop: 25,
    backgroundColor: "#12A14B",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#12A14B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  botonPagarDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "#999",
  },
  botonTexto: {
    color: "#FFF",
    fontSize: 17,
    fontFamily: "Aller_Bd",
    letterSpacing: 0.5,
  },
  botonIcon: {
    marginLeft: 8,
  },
  // Carrito vacío
  emptyCart: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 25,
    color: "#666",
    fontFamily: "Aller_Rg",
    marginTop: 15,
  },
  botonSeguirComprando: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default DetallesCompraScreen;