// screens/CarritoScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";

export default function CarritoScreen({ navigation }) {
  // Usamos el contexto del carrito (cartItems, funciones y subtotal vienen del contexto)
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal: subtotalContext,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [direccionVisible, setDireccionVisible] = useState(false);
  const [alturaAnimada] = useState(new Animated.Value(0));

  const [pais, setPais] = useState("Bolivia");
  const [departamento, setDepartamento] = useState("Santa Cruz");
  const [busquedaPais, setBusquedaPais] = useState("");

  const [paisModalVisible, setPaisModalVisible] = useState(false);
  const [departamentoModalVisible, setDepartamentoModalVisible] = useState(false);

  // Fuentes
  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded)
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }} />
    );

  // Animación del acordeón de dirección
  const toggleDireccion = () => {
    Animated.timing(alturaAnimada, {
      toValue: direccionVisible ? 0 : 320,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDireccionVisible(!direccionVisible);
  };

  // Lista de países (mismo listado que tenías)
  const allCountries = [
    "Afganistán","Albania","Alemania","Andorra","Angola","Antigua y Barbuda","Arabia Saudita",
    "Argelia","Argentina","Armenia","Australia","Austria","Azerbaiyán","Bahamas","Bangladés",
    "Barbados","Baréin","Bélgica","Belice","Benín","Bielorrusia","Birmania","Bolivia","Bosnia y Herzegovina",
    "Botsuana","Brasil","Brunéi","Bulgaria","Burkina Faso","Burundi","Bután","Cabo Verde","Camboya",
    "Camerún","Canadá","Chad","Chile","China","Chipre","Colombia","Comoras","Corea del Norte","Corea del Sur",
    "Costa de Marfil","Costa Rica","Croacia","Cuba","Dinamarca","Dominica","Ecuador","Egipto","El Salvador",
    "Emiratos Árabes Unidos","Eritrea","Eslovaquia","Eslovenia","España","Estados Unidos","Estonia","Etiopía",
    "Filipinas","Finlandia","Fiyi","Francia","Gabón","Gambia","Georgia","Ghana","Granada","Grecia","Guatemala",
    "Guinea","Guinea-Bisáu","Guinea Ecuatorial","Guyana","Haití","Honduras","Hungría","India","Indonesia",
    "Irak","Irán","Irlanda","Islandia","Islas Marshall","Islas Salomón","Israel","Italia","Jamaica","Japón",
    "Jordania","Kazajistán","Kenia","Kirguistán","Kiribati","Kuwait","Laos","Lesoto","Letonia","Líbano",
    "Liberia","Libia","Liechtenstein","Lituania","Luxemburgo","Madagascar","Malasia","Malaui","Maldivas",
    "Malí","Malta","Marruecos","Mauricio","Mauritania","México","Micronesia","Moldavia","Mónaco","Mongolia",
    "Montenegro","Mozambique","Namibia","Nauru","Nepal","Nicaragua","Níger","Nigeria","Noruega","Nueva Zelanda",
    "Omán","Países Bajos","Pakistán","Palaos","Panamá","Papúa Nueva Guinea","Paraguay","Perú","Polonia",
    "Portugal","Reino Unido","República Centroafricana","República Checa","República del Congo",
    "República Democrática del Congo","República Dominicana","Ruanda","Rumania","Rusia","Samoa",
    "San Cristóbal y Nieves","San Marino","San Vicente y las Granadinas","Santa Lucía","Santo Tomé y Príncipe",
    "Senegal","Serbia","Seychelles","Sierra Leona","Singapur","Siria","Somalia","Sri Lanka","Sudáfrica",
    "Sudán","Sudán del Sur","Suecia","Suiza","Surinam","Tailandia","Tanzania","Tayikistán","Timor Oriental",
    "Togo","Tonga","Trinidad y Tobago","Túnez","Turkmenistán","Turquía","Tuvalu","Ucrania","Uganda",
    "Uruguay","Uzbekistán","Vanuatu","Venezuela","Vietnam","Yemen","Yibuti","Zambia","Zimbabue"
  ];

  const departamentosBolivia = [
    "Santa Cruz","La Paz","Cochabamba","Chuquisaca","Tarija","Oruro","Potosí","Beni","Pando"
  ];

  const paisFiltrado = allCountries.filter((c) =>
    c.toLowerCase().includes(busquedaPais.toLowerCase())
  );

  // Totales (si tu CartContext ya provee subtotal, lo usamos; si no, calculamos aquí)
  const subtotal = subtotalContext ?? useMemo(
    () => (cartItems || []).reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 0), 0),
    [cartItems]
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  // Cambiar cantidad usando la función del contexto
  const changeQuantity = (id, delta) => {
    updateQuantity(id, delta);
  };

  // Eliminar (usa función del contexto)
  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Si carrito vacío
  const renderEmpty = () => (
    <View style={{ padding: 30, alignItems: "center" }}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={{ marginTop: 12, fontSize: 16, color: "#666" }}>
        Tu carrito está vacío.
      </Text>
      <TouchableOpacity
        style={{ marginTop: 16, backgroundColor: "#12A14B", padding: 10, borderRadius: 8 }}
        onPress={() => navigation.navigate("Inicio")}
      >
        <Text style={{ color: "#fff" }}>Seguir comprando</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.title, { fontFamily: "Aller_Bd" }]}>
            Carrito de Compras
          </Text>

          {/* Productos del carrito */}
          {(!cartItems || cartItems.length === 0) ? (
            renderEmpty()
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartRow}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeText}>Eliminar</Text>
                </TouchableOpacity>

                <View style={styles.productInfo}>
                  {/* Si item.imagen viene como require() o string local, lo mostramos; si no, placeholder */}
                  {item.imagen ? (
                    <Image
                      source={item.imagen}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.thumbnail, { justifyContent: "center", alignItems: "center" }]}>
                      <Ionicons name="image-outline" size={28} color="#bbb" />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.productName, { fontFamily: "Aller_Rg" }]}>
                      {item.nombre}
                    </Text>
                    <Text style={{ color: "#666", marginTop: 6, fontSize: 13 }}>
                      Precio unitario: Bs. {(item.precio || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={[styles.priceText, { fontFamily: "Aller_Rg" }]}>
                    Bs. {(item.precio || 0).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantitySection}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => changeQuantity(item.id, -1)}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { fontFamily: "Aller_Rg" }]}>
                    {item.cantidad}
                  </Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => changeQuantity(item.id, +1)}
                  >
                    <Text style={styles.qtyButtonText}>＋</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.subtotalSection}>
                  <Text style={[styles.subtotalText, { fontFamily: "Aller_Rg" }]}>
                    Bs. {((item.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Cupón */}
          <View style={styles.couponContainer}>
            <Text style={[styles.couponLabel, { fontFamily: "Aller_Rg" }]}>
              Código de cupón
            </Text>
            <View style={styles.couponRow}>
              <TextInput
                placeholder="Ingresa código"
                value={couponCode}
                onChangeText={setCouponCode}
                style={[styles.couponInputPlaceholder, { padding: 10 }]}
              />
              <TouchableOpacity style={styles.couponButton}>
                <Text style={[styles.couponButtonText, { fontFamily: "Aller_Bd" }]}>
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Totales */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={[styles.label, { fontFamily: "Aller_Rg" }]}>Subtotal</Text>
              <Text style={[styles.value, { fontFamily: "Aller_Rg" }]}>
                Bs. {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.label, { fontFamily: "Aller_Rg" }]}>Envío</Text>
              <Text style={[styles.value, { fontFamily: "Aller_Rg" }]}>
                {shippingCost === 0 ? "Envío gratuito" : `Bs. ${shippingCost.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.labelBold, { fontFamily: "Aller_Bd" }]}>Total</Text>
              <Text style={[styles.valueBold, { fontFamily: "Aller_Bd" }]}>
                Bs. {total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Botón finalizar compra */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              // placeholder: flujo de checkout. Aquí podrías navegar a pantalla de pago.
              navigation.navigate("Inicio");
            }}
          >
            <Text style={[styles.checkoutText, { fontFamily: "Aller_Bd" }]}>
              Finalizar compra
            </Text>
          </TouchableOpacity>

          {/* Dirección con animación */}
          <View style={styles.shippingInfo}>
            <TouchableOpacity onPress={toggleDireccion}>
              <Text style={[styles.changeAddressText, { fontFamily: "Aller_Bd" }]}>
                Cambiar dirección
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.animatedBox, { height: alturaAnimada }]}>
            <View style={styles.addressContainer}>
              {/* País */}
              <Text style={[styles.addressLabel, { fontFamily: "Aller_BdIt" }]}>
                País / Región
              </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setPaisModalVisible(true)}
              >
                <Text>{pais}</Text>
              </TouchableOpacity>

              {/* Departamento o Región */}
              <Text style={[styles.addressLabel, { fontFamily: "Aller_BdIt" }]}>
                {pais === "Bolivia" ? "Departamento" : "Región / Provincia"}
              </Text>

              {pais === "Bolivia" ? (
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setDepartamentoModalVisible(true)}
                >
                  <Text>{departamento}</Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={styles.input}
                  value={departamento}
                  onChangeText={setDepartamento}
                  placeholder="Escribir región o provincia"
                />
              )}

              {/* Botón Actualizar */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={toggleDireccion}
                activeOpacity={0.85}
              >
                <Text style={[styles.saveButtonText, { fontFamily: "Aller_Bd" }]}>
                  Actualizar
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Footer />

      {/* Modal País */}
      <Modal visible={paisModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Buscar país..."
            value={busquedaPais}
            onChangeText={setBusquedaPais}
          />
          <FlatList
            data={paisFiltrado}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setPais(item);
                  setDepartamento(item === "Bolivia" ? "Santa Cruz" : "");
                  setPaisModalVisible(false);
                }}
              >
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.saveButton, { marginTop: 10 }]}
            onPress={() => setPaisModalVisible(false)}
          >
            <Text style={styles.saveButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal Departamento */}
      <Modal visible={departamentoModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={departamentosBolivia}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setDepartamento(item);
                  setDepartamentoModalVisible(false);
                }}
              >
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.saveButton, { marginTop: 10 }]}
            onPress={() => setDepartamentoModalVisible(false)}
          >
            <Text style={styles.saveButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },

  cartRow: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  removeButton: { alignSelf: "flex-end" },
  removeText: { color: "red", fontSize: 14 },
  productInfo: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  thumbnail: { width: 60, height: 60, borderRadius: 6, marginRight: 10, backgroundColor: "#f5f5f5" },
  productName: { flex: 1, fontSize: 16 },
  priceSection: { marginVertical: 6 },
  priceText: { fontSize: 16, color: "#333" },
  quantitySection: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  qtyButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  qtyButtonText: { fontSize: 18, color: "#333" },
  qtyText: { marginHorizontal: 12, fontSize: 16 },
  subtotalSection: { marginVertical: 6, alignItems: "flex-end" },
  subtotalText: { fontSize: 16, fontWeight: "500", color: "#000" },
  couponContainer: { marginTop: 24, marginBottom: 16 },
  couponLabel: { fontSize: 16, marginBottom: 8 },
  couponRow: { flexDirection: "row" },
  couponInputPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
  },
  couponButton: {
    backgroundColor: "#12A14B",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 4,
  },
  couponButtonText: { color: "#fff", fontSize: 16 },
  totalsContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 16,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 16, color: "#333" },
  labelBold: { fontSize: 18, fontWeight: "bold" },
  valueBold: { fontSize: 18, fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  checkoutText: { color: "#fff", fontSize: 16 },
  shippingInfo: { marginBottom: 8 },
  changeAddressText: { fontSize: 14, color: "#12A14B" },

  // Animación dirección
  animatedBox: { overflow: "hidden" },
  addressContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
  },
  addressLabel: { fontSize: 16, marginBottom: 6 },
  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 16 },
  modalContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalItem: { padding: 12, fontSize: 16, borderBottomWidth: 1, borderColor: "#ddd" },
});
