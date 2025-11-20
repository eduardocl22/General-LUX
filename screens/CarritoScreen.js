// screens/CarritoScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
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

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  const subtotal = subtotalContext ?? useMemo(
    () => (cartItems || []).reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 0), 0),
    [cartItems]
  );

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const changeQuantity = (id, delta) => updateQuantity(id, delta);
  const removeItem = (id) => removeFromCart(id);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>
        Tu carrito está vacío.
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate("Inicio")}
      >
        <Text style={styles.continueShoppingText}>Seguir comprando</Text>
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
                      <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                        <Ionicons name="image-outline" size={28} color="#bbb" />
                      </View>
                    )}

                    <View style={styles.productDetails}>
                      <Text style={[styles.productName, { fontFamily: "Aller_Rg" }]}>{item.nombre}</Text>
                      <Text style={styles.unitPrice}>
                        Precio unitario: Bs. {(item.precio || 0).toFixed(0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.quantitySection}>
                    <TouchableOpacity 
                      style={styles.qtyButton} 
                      onPress={() => changeQuantity(item.id, -1)}
                      disabled={item.cantidad <= 1}
                    >
                      <Text style={[styles.qtyButtonText, item.cantidad <= 1 && styles.qtyButtonDisabled]}>−</Text>
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
            {cartItems && cartItems.length > 0 && (
              <View style={styles.totalsSection}>
                <View style={styles.totalsContainer}>
                  <View style={styles.totalRow}>
                    <Text style={[styles.labelBold, { fontFamily: "Aller_Bd" }]}>Subtotal</Text>
                    <Text style={[styles.valueBold, { fontFamily: "Aller_Bd" }]}>
                      Bs. {subtotal.toFixed(0)}
                    </Text>
                  </View>
                  <View style={[styles.totalRow, { marginTop: 8 }]}>
                    <Text style={[styles.labelBold, { fontFamily: "Aller_Bd" }]}>Total</Text>
                    <Text style={[styles.valueBold, { fontFamily: "Aller_Bd" }]}>Bs. {total.toFixed(0)}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={handleFinalize} activeOpacity={0.9}>
                  <Text style={[styles.checkoutText, { fontFamily: "Aller_Bd" }]}>REALIZAR COMPRA</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 36 }} />
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
      <Footer />
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
    color: "#2d2d2d",
  },

  /* ---------------------- CARRITO VACÍO ---------------------- */

  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Aller_Rg",
  },

  continueShoppingButton: {
    marginTop: 20,
    backgroundColor: "#12A14B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },

  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Aller_Bd",
  },

  /* ---------------------- FILAS DEL CARRITO ---------------------- */

  cartRow: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  removeButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },

  removeText: {
    color: "#e74c3c",
    fontSize: 14,
    fontFamily: "Aller_Rg",
  },

  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f8f8f8",
  },

  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },

  productDetails: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    color: "#2d2d2d",
    marginBottom: 4,
  },

  unitPrice: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Aller_Rg",
  },

  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  qtyButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  qtyButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },

  qtyButtonDisabled: {
    color: "#ccc",
  },

  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: "#2d2d2d",
    minWidth: 30,
    textAlign: "center",
  },

  /* ---------------------- TOTALES ---------------------- */

  totalsSection: {
    marginTop: 20,
  },

  totalsContainer: {
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    paddingTop: 20,
    marginBottom: 24,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  labelBold: {
    fontSize: 18,
    color: "#2d2d2d",
  },

  valueBold: {
    fontSize: 18,
    color: "#12A14B",
  },

  /* ---------------------- BOTÓN FINALIZAR ---------------------- */

  checkoutButton: {
    backgroundColor: "#12A14B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#12A14B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  checkoutText: {
    color: "#fff",
    fontSize: 17,
    letterSpacing: 0.8,
  },
});