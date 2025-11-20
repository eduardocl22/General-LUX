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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
  const { cartItems, subtotal: total } = useCart();
  const { user } = useAuth();

  // Estado para seleccionar método de pago
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

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

  // Manejar selección de método de pago
  const seleccionarMetodo = (metodo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMetodoSeleccionado(metodo);

    animarPanel(alturaTarjeta, metodo === "tarjeta");
    animarPanel(alturaQR, metodo === "qr");
  };

  // Interpolaciones para animaciones de altura
  const panelTarjeta = alturaTarjeta.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const panelQR = alturaQR.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  // Validar carrito vacío
  const carritoVacio = !cartItems || cartItems.length === 0;

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.2 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* TITULO */}
          <Text style={styles.titulo}>Detalles de la compra</Text>

          {carritoVacio ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
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
                <Text style={styles.subtitulo}>Resumen del pedido</Text>

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
                          <Text style={styles.placeholderText}>IMG</Text>
                        </View>
                      )}
                      <View style={styles.resumenInfo}>
                        <Text style={styles.resumenNombre}>{item.nombre}</Text>
                        <Text style={styles.resumenPrecio}>
                          {item.cantidad} x Bs. {item.precio?.toFixed(2) || "0.00"}
                        </Text>
                        <Text style={styles.resumenSubtotal}>
                          Subtotal: Bs. {(item.cantidad * item.precio).toFixed(2)}
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
                <Text style={styles.subtitulo}>Métodos de pago</Text>

                <View style={styles.metodosPagoContainer}>
                  {/* Método Tarjeta */}
                  <TouchableOpacity
                    style={[
                      styles.metodoPagoButton,
                      metodoSeleccionado === "tarjeta" && styles.metodoPagoSeleccionado
                    ]}
                    onPress={() => seleccionarMetodo("tarjeta")}
                  >
                    <View style={styles.metodoPagoHeader}>
                      <View style={styles.radioContainer}>
                        <View
                          style={[
                            styles.radio,
                            metodoSeleccionado === "tarjeta" && styles.radioSeleccionado,
                          ]}
                        />
                        <Text style={styles.radioLabel}>Tarjeta de crédito o débito</Text>
                      </View>
                    </View>

                    <Animated.View style={[styles.panelDesplegable, { height: panelTarjeta }]}>
                      <Text style={styles.labelCampo}>Número de tarjeta</Text>
                      <View style={styles.inputFake} />
                      <Text style={styles.labelCampo}>Nombre en la tarjeta</Text>
                      <View style={styles.inputFake} />
                      <View style={styles.rowCampos}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.labelCampo}>Vencimiento</Text>
                          <View style={styles.inputFake} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.labelCampo}>CVV</Text>
                          <View style={styles.inputFake} />
                        </View>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>

                  {/* Método QR */}
                  <TouchableOpacity
                    style={[
                      styles.metodoPagoButton,
                      metodoSeleccionado === "qr" && styles.metodoPagoSeleccionado
                    ]}
                    onPress={() => seleccionarMetodo("qr")}
                  >
                    <View style={styles.metodoPagoHeader}>
                      <View style={styles.radioContainer}>
                        <View
                          style={[
                            styles.radio,
                            metodoSeleccionado === "qr" && styles.radioSeleccionado,
                          ]}
                        />
                        <Text style={styles.radioLabel}>Pago con QR (Bolivia)</Text>
                      </View>
                    </View>

                    <Animated.View style={[styles.panelDesplegable, { height: panelQR }]}>
                      <Text style={styles.labelCampo}>
                        Escanea el siguiente QR con tu app bancaria:
                      </Text>
                      <View style={styles.qrContainer}>
                        <View style={styles.qrPlaceholder}>
                          <Text style={styles.qrPlaceholderText}>QR CODE</Text>
                          <Text style={styles.qrPlaceholderSubtext}>Pago General Lux</Text>
                          <Text style={styles.qrPlaceholderAmount}>
                            Bs. {total?.toFixed(2) || "0.00"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.qrTexto}>
                        El pago se confirmará manualmente por la empresa.
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                {/* BOTÓN DE PAGO */}
                <TouchableOpacity
                  style={styles.botonPagar}
                  onPress={() => {
                    if (!metodoSeleccionado) {
                      Alert.alert("Método de pago requerido", "Por favor selecciona un método de pago.");
                      return;
                    }
                    Alert.alert(
                      "Compra realizada", 
                      `¡Gracias por tu compra! Método: ${metodoSeleccionado === 'tarjeta' ? 'Tarjeta' : 'QR'}`,
                      [
                        { 
                          text: "Aceptar", 
                          onPress: () => navigation.navigate("Inicio")
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.botonTexto}>REALIZAR PEDIDO</Text>
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
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0A0A0A",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Aller_Bd",
  },
  verticalLayout: {
    flex: 1,
  },
  seccion: {
    marginBottom: 25,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#12A14B",
    marginBottom: 15,
    fontFamily: "Aller_Bd",
  },
  resumenCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  resumenItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  resumenImg: {
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 8,
  },
  resumenImgPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  resumenInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resumenNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    fontFamily: "Aller_Rg",
  },
  resumenPrecio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    fontFamily: "Aller_Rg",
  },
  resumenSubtotal: {
    fontSize: 14,
    color: "#12A14B",
    fontWeight: "600",
    fontFamily: "Aller_Bd",
  },
  resumenTotalBox: {
    marginTop: 12,
    borderTopWidth: 2,
    borderColor: "#DDD",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumenTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Aller_Bd",
  },
  resumenTotal: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#12A14B",
    fontFamily: "Aller_Bd",
  },
  metodosPagoContainer: {
    gap: 12,
  },
  metodoPagoButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  metodoPagoSeleccionado: {
    borderWidth: 2,
    borderColor: "#12A14B",
    backgroundColor: "rgba(18, 161, 75, 0.05)",
  },
  metodoPagoHeader: {
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#12A14B",
    marginRight: 10,
  },
  radioSeleccionado: {
    backgroundColor: "#12A14B",
  },
  radioLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    fontFamily: "Aller_Rg",
  },
  panelDesplegable: {
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  labelCampo: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontFamily: "Aller_Rg",
  },
  inputFake: {
    height: 44,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 12,
  },
  rowCampos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#12A14B',
    borderRadius: 10,
    padding: 10,
  },
  qrPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12A14B',
    marginBottom: 5,
  },
  qrPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrPlaceholderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qrTexto: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: "Aller_Rg",
  },
  botonPagar: {
    marginTop: 25,
    backgroundColor: "#12A14B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  botonTexto: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Aller_Bd",
  },
  emptyCart: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
    fontFamily: "Aller_Rg",
  },
  botonSeguirComprando: {
    backgroundColor: "#12A14B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});