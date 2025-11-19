import React, { useState, useContext, useEffect, useRef } from "react";
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
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { CartContext } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";

// Necesario para animaciones suaves en Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetallesCompraScreen = () => {
  const navigation = useNavigation();
  const { carrito, total, user } = useContext(CartContext);

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // Animaciones de despliegue
  const alturaTarjeta = useRef(new Animated.Value(0)).current;
  const alturaQR = useRef(new Animated.Value(0)).current;

  // *** VALIDAR LOGIN ANTES DE PERMITIR LA COMPRA
  useEffect(() => {
    if (!user) {
      navigation.navigate("LoginScreen");
    }
  }, [user]);

  // Animación
  const animarPanel = (ref, open) => {
    Animated.timing(ref, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Manejar cambio de método de pago
  const seleccionarMetodo = (metodo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMetodoSeleccionado(metodo);

    animarPanel(alturaTarjeta, metodo === "tarjeta");
    animarPanel(alturaQR, metodo === "qr");
  };

  // Paneles animados
  const panelTarjeta = alturaTarjeta.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const panelQR = alturaQR.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <ImageBackground
      source={require("../assets/fondo.jpeg")}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* TITULO */}
        <Text style={styles.titulo}>Detalles de la compra</Text>

        {/* CONTENEDOR PRINCIPAL IZQUIERDA / DERECHA */}
        <View style={styles.row}>

          {/* COLUMNA IZQUIERDA (Métodos de pago) */}
          <View style={styles.colIzquierda}>

            {/* ---------- MÉTODOS DE PAGO ---------- */}
            <Text style={styles.subtitulo}>Métodos de pago</Text>

            {/* Método Tarjeta */}
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => seleccionarMetodo("tarjeta")}
            >
              <View
                style={[
                  styles.radio,
                  metodoSeleccionado === "tarjeta" && styles.radioSeleccionado,
                ]}
              />
              <Text style={styles.radioLabel}>Tarjeta de crédito o débito</Text>
            </TouchableOpacity>

            {/* Panel animado tarjeta */}
            <Animated.View
              style={[styles.panelDesplegable, { height: panelTarjeta }]}
            >
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

            {/* Método QR */}
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => seleccionarMetodo("qr")}
            >
              <View
                style={[
                  styles.radio,
                  metodoSeleccionado === "qr" && styles.radioSeleccionado,
                ]}
              />
              <Text style={styles.radioLabel}>Pago con QR (Bolivia)</Text>
            </TouchableOpacity>

            {/* Panel animado QR */}
            <Animated.View style={[styles.panelDesplegable, { height: panelQR }]}>
              <Text style={styles.labelCampo}>
                Escanea el siguiente QR con tu app bancaria:
              </Text>

              <View style={styles.qrContainer}>
                <QRCode
                  value="PAGO-GENERAL-LUX-QR-BO" // ← Aquí podrás reemplazar por el QR oficial
                  size={140}
                  color="#000"
                  backgroundColor="#FFF"
                />
              </View>

              <Text style={styles.qrTexto}>
                El pago se confirmará manualmente por la empresa.
              </Text>
            </Animated.View>

          </View>

          {/* COLUMNA DERECHA (Resumen) */}
          <View style={styles.colDerecha}>
            <Text style={styles.subtitulo}>Resumen del pedido</Text>

            <View style={styles.resumenCard}>
              {carrito.map((item, index) => (
                <View key={index} style={styles.resumenItem}>
                  <Image
                    source={item.imagen}
                    style={styles.resumenImg}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resumenNombre}>{item.nombre}</Text>
                    <Text style={styles.resumenPrecio}>
                      {item.cantidad} x ${item.precio}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.resumenTotalBox}>
                <Text style={styles.resumenTotalLabel}>Total a pagar:</Text>
                <Text style={styles.resumenTotal}>${total}</Text>
              </View>
            </View>

            {/* BOTÓN REALIZAR PEDIDO */}
            <TouchableOpacity style={styles.botonPagar}>
              <Text style={styles.botonTexto}>REALIZAR PEDIDO</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default DetallesCompraScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0A0A0A",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  colIzquierda: {
    flex: 0.6,
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 16,
    borderRadius: 12,
  },
  colDerecha: {
    flex: 0.4,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 12,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#12A14B",
    marginBottom: 10,
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  },

  panelDesplegable: {
    overflow: "hidden",
    backgroundColor: "#F6F6F6",
    padding: 8,
    borderRadius: 8,
    marginBottom: 14,
  },

  labelCampo: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },

  inputFake: {
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 10,
  },

  rowCampos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  qrContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
  },
  qrTexto: {
    textAlign: "center",
    color: "#333",
  },

  resumenCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
  },
  resumenItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  resumenImg: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  resumenNombre: {
    fontSize: 16,
    fontWeight: "600",
  },
  resumenPrecio: {
    fontSize: 14,
    color: "#555",
  },
  resumenTotalBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#DDD",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumenTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resumenTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#12A14B",
  },

  botonPagar: {
    marginTop: 20,
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  botonTexto: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
