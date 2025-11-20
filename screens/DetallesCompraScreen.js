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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Usa los hooks de tus contextos en lugar de useContext directo
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Habilitar animaciones suaves en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetallesCompraScreen = () => {
  const navigation = useNavigation();
  const { cartItems, subtotal: total, clearCart } = useCart();
  const { user } = useAuth();

  // Estado para seleccionar método de pago
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // Estados para los campos de tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    nombre: "",
    vencimiento: "",
    cvv: ""
  });

  // Animaciones de despliegue para paneles
  const alturaTarjeta = useRef(new Animated.Value(0)).current;
  const alturaQR = useRef(new Animated.Value(0)).current;

  // Validar que el usuario esté logueado antes de permitir compra
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

  // Animar panel de pago
  const animarPanel = (ref, open) => {
    Animated.timing(ref, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Manejar selección de método de pago (ACORDEÓN)
  const seleccionarMetodo = (metodo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (metodoSeleccionado === metodo) {
      // Si ya está seleccionado, lo deseleccionamos (cierra el acordeón)
      setMetodoSeleccionado(null);
      animarPanel(alturaTarjeta, false);
      animarPanel(alturaQR, false);
    } else {
      // Selecciona el nuevo método y abre su acordeón
      setMetodoSeleccionado(metodo);
      
      if (metodo === "tarjeta") {
        animarPanel(alturaTarjeta, true);
        animarPanel(alturaQR, false);
      } else if (metodo === "qr") {
        animarPanel(alturaTarjeta, false);
        animarPanel(alturaQR, true);
      }
    }
  };

  // Interpolaciones para animaciones de altura
  const panelTarjeta = alturaTarjeta.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  const panelQR = alturaQR.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  // Manejar cambio en campos de tarjeta
  const handleCambioTarjeta = (campo, valor) => {
    setDatosTarjeta(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Formatear número de tarjeta (XXXX XXXX XXXX XXXX)
  const formatearNumeroTarjeta = (texto) => {
    const textoLimpio = texto.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const grupos = textoLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : textoLimpio;
  };

  // Formatear fecha de vencimiento (MM/YY)
  const formatearVencimiento = (texto) => {
    const textoLimpio = texto.replace(/[^0-9]/g, '');
    if (textoLimpio.length >= 3) {
      return textoLimpio.slice(0, 2) + '/' + textoLimpio.slice(2, 4);
    }
    return textoLimpio;
  };

  // Validar carrito vacío
  const carritoVacio = !cartItems || cartItems.length === 0;

  // Función para procesar el pago
  const procesarPago = () => {
    if (!metodoSeleccionado) {
      Alert.alert("Método de pago requerido", "Por favor selecciona un método de pago.");
      return;
    }

    if (metodoSeleccionado === "tarjeta") {
      // Validar campos de tarjeta
      if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) {
        Alert.alert("Datos incompletos", "Por favor completa todos los campos de la tarjeta.");
        return;
      }
      
      if (datosTarjeta.numero.replace(/\s/g, '').length !== 16) {
        Alert.alert("Número de tarjeta inválido", "El número de tarjeta debe tener 16 dígitos.");
        return;
      }
    }

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

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.15 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* TITULO PRINCIPAL */}
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

              {/* SECCIÓN 2: MÉTODOS DE PAGO */}
              <View style={styles.seccion}>
                <View style={styles.headerSeccion}>
                  <Ionicons name="card-outline" size={24} color="#12A14B" />
                  <Text style={styles.subtitulo}>Método de Pago</Text>
                </View>

                <View style={styles.metodosPagoContainer}>
                  
                  {/* Método Tarjeta - ACORDEÓN */}
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
                            maxLength={3}
                            secureTextEntry
                            placeholderTextColor="#999"
                          />
                        </View>
                      </View>
                    </Animated.View>
                  </View>

                  {/* Método QR - ACORDEÓN */}
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

export default DetallesCompraScreen;

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
    color: '#12A14B',
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