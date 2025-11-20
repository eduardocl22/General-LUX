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
  ImageBackground,
} from "react-native";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function CarritoScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, subtotal: subtotalContext } = useCart();
  const { user } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [direccionVisible, setDireccionVisible] = useState(false);
  const [alturaAnimada] = useState(new Animated.Value(0));

  const [pais, setPais] = useState("Bolivia");
  const [departamento, setDepartamento] = useState("Santa Cruz");
  const [busquedaPais, setBusquedaPais] = useState("");

  const [paisModalVisible, setPaisModalVisible] = useState(false);
  const [departamentoModalVisible, setDepartamentoModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  const toggleDireccion = () => {
    Animated.timing(alturaAnimada, {
      toValue: direccionVisible ? 0 : 320,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setDireccionVisible(!direccionVisible);
  };

  const allCountries = [
    /* lista completa de países */
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

  const subtotal = subtotalContext ?? useMemo(
    () => (cartItems || []).reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 0), 0),
    [cartItems]
  );

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const changeQuantity = (id, delta) => updateQuantity(id, delta);
  const removeItem = (id) => removeFromCart(id);

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

const handleFinalize = () => {
  if (!user) {
    navigation.navigate("Login");
    return;
  }
  navigation.navigate("DetallesCompra");    
};

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ImageBackground
          source={require("../assets/fondo.jpeg")}
          style={styles.background}
          imageStyle={{ opacity: 0.25 }}
          resizeMode="cover"
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={[styles.title, { fontFamily: "Aller_Bd" }]}>Carrito de Compras</Text>

            {(!cartItems || cartItems.length === 0) ? renderEmpty() : (
              cartItems.map((item) => (
                <View key={item.id} style={styles.cartRow}>
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeText}>Eliminar</Text>
                  </TouchableOpacity>

                  <View style={styles.productInfo}>
                    {item.imagen ? (
                      <Image source={item.imagen} style={styles.thumbnail} resizeMode="cover" />
                    ) : (
                      <View style={[styles.thumbnail, { justifyContent: "center", alignItems: "center" }]}>
                        <Ionicons name="image-outline" size={28} color="#bbb" />
                      </View>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.productName, { fontFamily: "Aller_Rg" }]}>{item.nombre}</Text>
                      <Text style={{ color: "#666", marginTop: 6, fontSize: 13 }}>
                        Precio unitario: Bs. {(item.precio || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>


                  <View style={styles.quantitySection}>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => changeQuantity(item.id, -1)}>
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { fontFamily: "Aller_Rg" }]}>{item.cantidad}</Text>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => changeQuantity(item.id, +1)}>
                      <Text style={styles.qtyButtonText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Totales */}
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={[styles.labelBold, { fontFamily: "Aller_Bd" }]}>Subtotal</Text>
                <Text style={[styles.valueBold, { fontFamily: "Aller_Bd" }]}>
                  Bs. {subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.totalRow, { marginTop: 8 }]}>
                <Text style={[styles.labelBold, { fontFamily: "Aller_Bd" }]}>Total</Text>
                <Text style={[styles.valueBold, { fontFamily: "Aller_Bd" }]}>Bs. {total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleFinalize} activeOpacity={0.9}>
              <Text style={[styles.checkoutText, { fontFamily: "Aller_Bd" }]}>FINALIZAR COMPRA</Text>
            </TouchableOpacity>

            {/* Acordeón de dirección */}
            <View style={styles.shippingInfo}>
              <TouchableOpacity onPress={toggleDireccion}>
                <Text style={[styles.changeAddressText, { fontFamily: "Aller_Bd" }]}>Cambiar dirección</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.animatedBox, { height: alturaAnimada }]}>
              <View style={styles.addressContainer}>
                <Text style={[styles.addressLabel, { fontFamily: "Aller_BdIt" }]}>País / Región</Text>
                <TouchableOpacity style={styles.input} onPress={() => setPaisModalVisible(true)}>
                  <Text>{pais}</Text>
                </TouchableOpacity>

                <Text style={[styles.addressLabel, { fontFamily: "Aller_BdIt" }]}>
                  {pais === "Bolivia" ? "Departamento" : "Región / Provincia"}
                </Text>

                {pais === "Bolivia" ? (
                  <TouchableOpacity style={styles.input} onPress={() => setDepartamentoModalVisible(true)}>
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

                <TouchableOpacity style={styles.saveButton} onPress={toggleDireccion} activeOpacity={0.85}>
                  <Text style={[styles.saveButtonText, { fontFamily: "Aller_Bd" }]}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={{ height: 36 }} />
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
      <Footer />

      {/* MODALES de país y departamento */}
      <Modal visible={paisModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput style={styles.searchBox} placeholder="Buscar país..." value={busquedaPais} onChangeText={setBusquedaPais} />
          <FlatList
            data={paisFiltrado}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setPais(item); setDepartamento(item === "Bolivia" ? "Santa Cruz" : ""); setPaisModalVisible(false); }}>
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.saveButton, { marginTop: 10 }]} onPress={() => setPaisModalVisible(false)}>
            <Text style={styles.saveButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={departamentoModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={departamentosBolivia}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setDepartamento(item); setDepartamentoModalVisible(false); }}>
                <Text style={styles.modalItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={[styles.saveButton, { marginTop: 10 }]} onPress={() => setDepartamentoModalVisible(false)}>
            <Text style={styles.saveButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------ ESTILOS COMPLETOS ------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 0.5,
  },

  /* ---------------------- FILAS DEL CARRITO ---------------------- */

  cartRow: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    elevation: 3,
  },

  removeButton: {
    alignSelf: "flex-end",
    marginBottom: 6,
  },

  removeText: {
    color: "red",
    fontSize: 14,
  },

  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f1f1f1",
  },

  productName: {
    fontSize: 17,
    color: "#222",
  },

  priceSection: {
    marginBottom: 8,
  },

  priceText: {
    fontSize: 16,
    color: "#444",
  },

  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  qtyButtonText: {
    fontSize: 20,
    color: "#333",
  },

  qtyText: {
    marginHorizontal: 14,
    fontSize: 17,
  },

  subtotalSection: {
    alignItems: "flex-end",
  },

  subtotalText: {
    fontSize: 16,
    fontWeight: "600",
  },

  /* ---------------------- TOTALES ---------------------- */

  totalsContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 16,
    marginTop: 20,
    marginBottom: 24,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    color: "#333",
  },

  value: {
    fontSize: 16,
    color: "#333",
  },

  labelBold: {
    fontSize: 18,
    fontWeight: "bold",
  },

  valueBold: {
    fontSize: 18,
    fontWeight: "bold",
  },

  /* ---------------------- BOTÓN FINALIZAR ---------------------- */

  checkoutButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 28,
    marginTop: 10,
  },

  checkoutText: {
    color: "#fff",
    fontSize: 17,
    letterSpacing: 0.8,
  },

  /* ---------------------- DIRECCIÓN ---------------------- */

  shippingInfo: {
    marginBottom: 10,
  },

  changeAddressText: {
    fontSize: 15,
    color: "#12A14B",
  },

  animatedBox: {
    overflow: "hidden",
  },

  addressContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 30,
    elevation: 2,
  },

  addressLabel: {
    fontSize: 15,
    marginBottom: 6,
    color: "#222",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
  },

  saveButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  /* ---------------------- MODALES ---------------------- */

  modalContainer: {
    flex: 1,
    padding: 18,
    backgroundColor: "#fff",
  },

  modalItem: {
    padding: 16,
    fontSize: 17,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});