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
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

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
    outputRange: [0, tarjetasGuardadas.length > 0 && !mostrarFormularioTarjeta ? 320 : 420],
  });

  const panelQR = alturaQR.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
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
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={styles.background}
          resizeMode="cover"
        >
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
            <Text style={styles.loadingText}>Cargando información...</Text>
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
      >
        <Header navigation={navigation} />

        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer,
            (carritoVacio || cartItems.length === 0) && styles.scrollContainerEmpty
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header de la pantalla */}
          <View style={styles.headerSection}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.purchaseIconHeader}>
                <Ionicons name="bag-check" size={28} color="#FFF" />
              </View>
              <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>
                Finalizar Compra
              </Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: "Aller_Rg" }]}>
              Completa tu compra de manera segura
            </Text>
          </View>

          {carritoVacio ? (
            <View style={styles.emptySection}>
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="cart-outline" size={80} color="#12A14B" />
                  <View style={styles.emptyIconBadge}>
                    <Ionicons name="close" size={24} color="#FFF" />
                  </View>
                </View>
                <Text style={[styles.emptyTitle, { fontFamily: "Aller_Bd" }]}>
                  Carrito Vacío
                </Text>
                <Text style={[styles.emptyText, { fontFamily: "Aller_Rg" }]}>
                  Tu carrito de compras está vacío. 
                  {"\n"}Agrega productos para proceder con la compra.
                </Text>
                <TouchableOpacity
                  style={styles.continueShoppingButton}
                  onPress={() => navigation.navigate("Inicio")}
                  activeOpacity={0.9}
                >
                  <Ionicons name="home-outline" size={22} color="#FFF" />
                  <Text style={[styles.continueShoppingText, { fontFamily: "Aller_Bd" }]}>
                    Ir al Inicio
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Espaciador para carrito vacío */}
              <View style={styles.emptySpacer} />
            </View>
          ) : (
            <>
              {/* SECCIÓN 1: RESUMEN DE COMPRA */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="receipt-outline" size={22} color="#12A14B" />
                  <Text style={[styles.sectionTitle, { fontFamily: "Aller_BdIt" }]}>
                    Resumen del Pedido
                  </Text>
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
                          <Ionicons name="cube" size={24} color="#BBB" />
                        </View>
                      )}
                      <View style={styles.resumenInfo}>
                        <Text style={[styles.resumenNombre, { fontFamily: "Aller_Bd" }]}>
                          {item.nombre}
                        </Text>
                        <Text style={[styles.resumenDetalle, { fontFamily: "Aller_Rg" }]}>
                          Cantidad: {item.cantidad} × Bs. {item.precio?.toFixed(2) || "0.00"}
                        </Text>
                        <View style={styles.resumenSubtotalRow}>
                          <Text style={[styles.resumenSubtotalLabel, { fontFamily: "Aller_Rg" }]}>
                            Subtotal:
                          </Text>
                          <Text style={[styles.resumenSubtotal, { fontFamily: "Aller_Bd" }]}>
                            Bs. {(item.cantidad * item.precio).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}

                  <View style={styles.totalContainer}>
                    <View style={styles.totalRow}>
                      <Text style={[styles.totalLabel, { fontFamily: "Aller_Bd" }]}>
                        Total a pagar:
                      </Text>
                      <Text style={[styles.totalValue, { fontFamily: "Aller_Bd" }]}>
                        Bs. {total?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* SECCIÓN 2: INFORMACIÓN DE ENVÍO */}
              {datosUsuario && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="location-outline" size={22} color="#12A14B" />
                    <Text style={[styles.sectionTitle, { fontFamily: "Aller_BdIt" }]}>
                      Información de Envío
                    </Text>
                  </View>

                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { fontFamily: "Aller_Rg" }]}>Nombre:</Text>
                      <Text style={[styles.infoValue, { fontFamily: "Aller_Bd" }]}>
                        {datosUsuario?.nombre || "No especificado"} {datosUsuario?.apellido || ""}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { fontFamily: "Aller_Rg" }]}>Teléfono:</Text>
                      <Text style={[styles.infoValue, { fontFamily: "Aller_Bd" }]}>
                        {datosUsuario?.telefono || "No especificado"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { fontFamily: "Aller_Rg" }]}>Dirección:</Text>
                      <Text style={[styles.infoValue, { fontFamily: "Aller_Bd" }]}>
                        {datosUsuario?.direccion || "No especificado"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { fontFamily: "Aller_Rg" }]}>Ciudad:</Text>
                      <Text style={[styles.infoValue, { fontFamily: "Aller_Bd" }]}>
                        {datosUsuario?.ciudad || "No especificado"}, {datosUsuario?.departamento || "No especificado"}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.editInfoButton}
                      onPress={() => navigation.navigate("Perfil")}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="pencil" size={16} color="#12A14B" />
                      <Text style={[styles.editInfoText, { fontFamily: "Aller_Bd" }]}>
                        Editar información
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SECCIÓN 3: MÉTODOS DE PAGO */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="card-outline" size={22} color="#12A14B" />
                  <Text style={[styles.sectionTitle, { fontFamily: "Aller_BdIt" }]}>
                    Método de Pago
                  </Text>
                </View>

                <View style={styles.paymentMethodsContainer}>
                  
                  {/* Método Tarjeta */}
                  <View style={[
                    styles.methodContainer,
                    metodoSeleccionado === "tarjeta" && styles.methodContainerSelected
                  ]}>
                    <TouchableOpacity
                      style={styles.methodHeader}
                      onPress={() => seleccionarMetodo("tarjeta")}
                      activeOpacity={0.8}
                    >
                      <View style={styles.methodInfo}>
                        <View style={styles.radioContainer}>
                          <View
                            style={[
                              styles.radio,
                              metodoSeleccionado === "tarjeta" && styles.radioSelected,
                            ]}
                          />
                        </View>
                        <Ionicons name="card" size={24} color="#12A14B" style={styles.methodIcon} />
                        <View style={styles.methodTexts}>
                          <Text style={[styles.methodTitle, { fontFamily: "Aller_Bd" }]}>
                            Tarjeta de Crédito/Débito
                          </Text>
                          <Text style={[styles.methodDescription, { fontFamily: "Aller_Rg" }]}>
                            Pago seguro con tarjeta
                          </Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={metodoSeleccionado === "tarjeta" ? "chevron-up" : "chevron-down"} 
                        size={22} 
                        color="#666" 
                      />
                    </TouchableOpacity>

                    <Animated.View style={[styles.expandablePanel, { height: panelTarjeta }]}>
                      
                      {/* Tarjetas Guardadas */}
                      {tarjetasGuardadas.length > 0 && !mostrarFormularioTarjeta && (
                        <View style={styles.savedCardsSection}>
                          <Text style={[styles.savedCardsTitle, { fontFamily: "Aller_Bd" }]}>
                            Tarjetas Guardadas
                          </Text>
                          {tarjetasGuardadas.map((tarjeta) => (
                            <TouchableOpacity
                              key={tarjeta.id}
                              style={[
                                styles.savedCard,
                                tarjetaSeleccionada === tarjeta.id && styles.savedCardSelected
                              ]}
                              onPress={() => seleccionarTarjetaGuardada(tarjeta)}
                              activeOpacity={0.8}
                            >
                              <View style={styles.cardInfo}>
                                <Ionicons 
                                  name="card" 
                                  size={20} 
                                  color={tarjetaSeleccionada === tarjeta.id ? "#12A14B" : "#666"} 
                                />
                                <View style={styles.cardDetails}>
                                  <Text style={[styles.cardType, { fontFamily: "Aller_Bd" }]}>
                                    {tarjeta.tipo} •••• {tarjeta.ultimosDigitos}
                                  </Text>
                                  <Text style={[styles.cardName, { fontFamily: "Aller_Rg" }]}>
                                    {tarjeta.nombre}
                                  </Text>
                                  <Text style={[styles.cardExpiry, { fontFamily: "Aller_Rg" }]}>
                                    Vence: {tarjeta.vencimiento}
                                  </Text>
                                </View>
                              </View>
                              {tarjetaSeleccionada === tarjeta.id && (
                                <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                              )}
                            </TouchableOpacity>
                          ))}
                          
                          <TouchableOpacity 
                            style={styles.useNewCardButton}
                            onPress={usarNuevaTarjeta}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="add-circle-outline" size={18} color="#12A14B" />
                            <Text style={[styles.useNewCardText, { fontFamily: "Aller_Bd" }]}>
                              Agregar nueva tarjeta
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Formulario de Nueva Tarjeta */}
                      {(mostrarFormularioTarjeta || tarjetasGuardadas.length === 0) && (
                        <View style={styles.cardForm}>
                          <Text style={[styles.formTitle, { fontFamily: "Aller_Bd" }]}>
                            {tarjetasGuardadas.length === 0 ? "Agregar Tarjeta" : "Nueva Tarjeta"}
                          </Text>
                          
                          <View style={styles.cardField}>
                            <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                              Número de tarjeta
                            </Text>
                            <TextInput
                              style={styles.input}
                              value={datosTarjeta.numero}
                              onChangeText={(texto) => handleCambioTarjeta('numero', formatearNumeroTarjeta(texto))}
                              keyboardType="numeric"
                              maxLength={19}
                              placeholderTextColor="#999"
                            />
                            {datosTarjeta.numero && (
                              <Text style={[styles.cardTypeBadge, { fontFamily: "Aller_Bd" }]}>
                                {detectarTipoTarjeta(datosTarjeta.numero)}
                              </Text>
                            )}
                          </View>
                          
                          <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                            Nombre en la tarjeta
                          </Text>
                          <TextInput
                            style={styles.input}
                            value={datosTarjeta.nombre}
                            onChangeText={(texto) => handleCambioTarjeta('nombre', texto.toUpperCase())}
                            placeholderTextColor="#999"
                          />
                          
                          <View style={styles.rowFields}>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                                MM/AA
                              </Text>
                              <TextInput
                                style={styles.input}
                                value={datosTarjeta.vencimiento}
                                onChangeText={(texto) => handleCambioTarjeta('vencimiento', formatearVencimiento(texto))}
                                keyboardType="numeric"
                                maxLength={5}
                                placeholderTextColor="#999"
                              />
                            </View>
                            <View style={{ width: 15 }} />
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                                CVV
                              </Text>
                              <TextInput
                                style={styles.input}
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
                            style={styles.saveCardOption}
                            onPress={() => setGuardarTarjeta(!guardarTarjeta)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.checkboxContainer}>
                              <View style={[styles.checkbox, guardarTarjeta && styles.checkboxSelected]}>
                                {guardarTarjeta && <Ionicons name="checkmark" size={14} color="#FFF" />}
                              </View>
                            </View>
                            <Text style={[styles.saveCardText, { fontFamily: "Aller_Rg" }]}>
                              Guardar esta tarjeta para futuras compras
                            </Text>
                          </TouchableOpacity>

                          {guardarTarjeta && (
                            <TouchableOpacity 
                              style={[
                                styles.saveCardButton,
                                (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) && 
                                styles.saveCardButtonDisabled
                              ]}
                              onPress={procesarGuardadoTarjeta}
                              disabled={!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv}
                              activeOpacity={0.9}
                            >
                              <Ionicons name="save-outline" size={18} color="#FFF" />
                              <Text style={[styles.saveCardButtonText, { fontFamily: "Aller_Bd" }]}>
                                Guardar Tarjeta
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}

                      {/* CVV para tarjeta guardada */}
                      {tarjetaSeleccionada && !mostrarFormularioTarjeta && (
                        <View style={styles.cvvSection}>
                          <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                            Código de seguridad (CVV)
                          </Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ingresa el CVV"
                            value={datosTarjeta.cvv}
                            onChangeText={(texto) => handleCambioTarjeta('cvv', texto.replace(/[^0-9]/g, ''))}
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            placeholderTextColor="#999"
                          />
                          <Text style={[styles.cvvHelp, { fontFamily: "Aller_Rg" }]}>
                            El CVV es el número de 3 o 4 dígitos en el reverso de tu tarjeta
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  </View>

                  {/* Método QR */}
                  <View style={[
                    styles.methodContainer,
                    metodoSeleccionado === "qr" && styles.methodContainerSelected
                  ]}>
                    <TouchableOpacity
                      style={styles.methodHeader}
                      onPress={() => seleccionarMetodo("qr")}
                      activeOpacity={0.8}
                    >
                      <View style={styles.methodInfo}>
                        <View style={styles.radioContainer}>
                          <View
                            style={[
                              styles.radio,
                              metodoSeleccionado === "qr" && styles.radioSelected,
                            ]}
                          />
                        </View>
                        <Ionicons name="qr-code" size={24} color="#12A14B" style={styles.methodIcon} />
                        <View style={styles.methodTexts}>
                          <Text style={[styles.methodTitle, { fontFamily: "Aller_Bd" }]}>
                            Pago con QR
                          </Text>
                          <Text style={[styles.methodDescription, { fontFamily: "Aller_Rg" }]}>
                            Escanea y paga desde tu banco
                          </Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={metodoSeleccionado === "qr" ? "chevron-up" : "chevron-down"} 
                        size={22} 
                        color="#666" 
                      />
                    </TouchableOpacity>

                    <Animated.View style={[styles.expandablePanel, { height: panelQR }]}>
                      <Text style={[styles.fieldLabel, { fontFamily: "Aller_Rg" }]}>
                        Escanea el siguiente código QR con tu app bancaria:
                      </Text>
                      <View style={styles.qrContainer}>
                        <View style={styles.qrPlaceholder}>
                          <Ionicons name="qr-code-outline" size={80} color="#12A14B" />
                          <Text style={[styles.qrPlaceholderSubtext, { fontFamily: "Aller_Bd" }]}>
                            GENERAL LUX
                          </Text>
                          <Text style={[styles.qrPlaceholderAmount, { fontFamily: "Aller_Bd" }]}>
                            Bs. {total?.toFixed(2) || "0.00"}
                          </Text>
                          <Text style={[styles.qrPlaceholderInfo, { fontFamily: "Aller_Rg" }]}>
                            Pago seguro y rápido
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.qrText, { fontFamily: "Aller_Rg" }]}>
                        El pago se confirmará automáticamente en unos minutos.
                      </Text>
                    </Animated.View>
                  </View>
                </View>

                {/* BOTÓN DE CONFIRMAR COMPRA */}
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    !metodoSeleccionado && styles.confirmButtonDisabled
                  ]}
                  onPress={procesarPago}
                  disabled={!metodoSeleccionado}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.confirmButtonText, { fontFamily: "Aller_Bd" }]}>
                    {metodoSeleccionado ? 'CONFIRMAR COMPRA' : 'SELECCIONA MÉTODO DE PAGO'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer DENTRO del ScrollView (solo cuando hay productos) */}
              {cartItems.length > 0 && !carritoVacio && (
                <View style={styles.footerContainer}>
                  <Footer />
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Footer FUERA del ScrollView (cuando está vacío) */}
        {(carritoVacio || cartItems.length === 0) && (
          <View style={styles.bottomFooter}>
            <Footer />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

/* ------------------------ ESTILOS MEJORADOS ------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  scrollContainerEmpty: {
    minHeight: height * 0.8,
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
  // Header Section
  headerSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  purchaseIconHeader: {
    position: 'relative',
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    color: '#2C3E50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Carrito Vacío
  emptySection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  emptyIconBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  emptySpacer: {
    height: height * 0.3,
  },
  continueShoppingButton: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '100%',
    gap: 10,
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueShoppingText: {
    color: '#FFF',
    fontSize: 16,
  },
  // Section Cards
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2C3E50',
    marginLeft: 10,
  },
  // Resumen de Compra
  resumenCard: {
    marginTop: 10,
  },
  resumenItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resumenImg: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  resumenImgPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  resumenInfo: {
    flex: 1,
    marginLeft: 15,
  },
  resumenNombre: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 20,
  },
  resumenDetalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resumenSubtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumenSubtotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  resumenSubtotal: {
    fontSize: 16,
    color: '#12A14B',
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#EEE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 24,
    color: '#12A14B',
  },
  // Información de Envío
  infoCard: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 2,
    textAlign: 'right',
  },
  editInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 10,
    gap: 8,
  },
  editInfoText: {
    fontSize: 14,
    color: '#12A14B',
  },
  // Métodos de Pago
  paymentMethodsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  methodContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodContainerSelected: {
    borderColor: '#12A14B',
    backgroundColor: 'rgba(18, 161, 75, 0.03)',
  },
  methodHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#CCC',
  },
  radioSelected: {
    backgroundColor: '#12A14B',
    borderColor: '#12A14B',
  },
  methodIcon: {
    marginRight: 12,
  },
  methodTexts: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: '#666',
  },
  expandablePanel: {
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  // Tarjetas Guardadas
  savedCardsSection: {
    marginBottom: 10,
  },
  savedCardsTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 12,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  savedCardSelected: {
    borderColor: '#12A14B',
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardType: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 11,
    color: '#888',
  },
  useNewCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 8,
    marginTop: 5,
    gap: 8,
  },
  useNewCardText: {
    fontSize: 14,
    color: '#12A14B',
  },
  // Formulario de Tarjeta
  cardForm: {
    marginTop: 10,
  },
  formTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardField: {
    position: 'relative',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  cardTypeBadge: {
    position: 'absolute',
    right: 15,
    top: 15,
    fontSize: 12,
    color: '#12A14B',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#12A14B',
    borderColor: '#12A14B',
  },
  saveCardText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  saveCardButton: {
    backgroundColor: '#12A14B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    gap: 8,
  },
  saveCardButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveCardButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  // CVV
  cvvSection: {
    marginTop: 10,
  },
  cvvHelp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // QR
  qrContainer: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 16,
    alignSelf: 'center',
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
    color: '#12A14B',
    marginTop: 12,
  },
  qrPlaceholderAmount: {
    fontSize: 20,
    color: '#2C3E50',
    marginTop: 6,
  },
  qrPlaceholderInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  qrText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 18,
  },
  // Botón de Confirmar
  confirmButton: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCC',
    shadowColor: '#999',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  // Footer
  footerContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

export default DetallesCompraScreen;