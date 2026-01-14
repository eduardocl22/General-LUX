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
  StatusBar,
  Dimensions,
} from "react-native";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function CarritoScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, subtotal: subtotalContext } = useCart();
  const { user } = useAuth();

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#F8F9FA" }} />;

  const fontFamilyOrDefault = (fontName) => fontsLoaded ? fontName : "System";

  const subtotal = subtotalContext ?? useMemo(
    () => (cartItems || []).reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 0), 0),
    [cartItems]
  );

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const changeQuantity = (id, delta) => updateQuantity(id, delta);
  const removeItem = (id) => removeFromCart(id);

  const renderEmpty = () => (
    <View style={styles.emptySection}>
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="cart-outline" size={80} color="#12A14B" />
          <View style={styles.emptyIconBadge}>
            <Ionicons name="close" size={24} color="#FFF" />
          </View>
        </View>
        <Text style={[styles.emptyTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
          Carrito Vacío
        </Text>
        <Text style={[styles.emptyText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
          Aún no has agregado productos a tu carrito. 
          {"\n"}Explora nuestras categorías y encuentra lo mejor para tu hogar.
        </Text>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate("Inicio")}
          activeOpacity={0.9}
        >
          <Ionicons name="home-outline" size={22} color="#FFF" />
          <Text style={[styles.continueShoppingText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
            Ir al Inicio
          </Text>
        </TouchableOpacity>
        
        {/* ❌ ELIMINADO: Botón "Ver Catálogo" */}
      </View>
      
      {/* Espaciador para empujar el Footer hacia abajo cuando hay poco contenido */}
      <View style={styles.emptySpacer} />
    </View>
  );

  const handleFinalize = () => {
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("DetallesCompra");    
  };

  const handleContinueShopping = () => {
    navigation.navigate("Inicio");
  };

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
            (!cartItems || cartItems.length === 0) && styles.scrollContainerEmpty
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado del Carrito */}
          <View style={styles.headerSection}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.cartIconHeader}>
                <Ionicons name="cart" size={28} color="#FFF" />
              </View>
              <Text style={[styles.title, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                Mi Carrito de Compras
              </Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
            </Text>
          </View>

          {/* Carrito Vacío o con Productos */}
          {(!cartItems || cartItems.length === 0) ? renderEmpty() : (
            <>
              {/* Lista de Productos */}
              <View style={styles.productsSection}>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartCard}>
                    {/* Header del producto - SOLO botón de eliminar */}
                    <View style={styles.productHeader}>
                      <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => removeItem(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                      </TouchableOpacity>
                    </View>

                    {/* Información del producto */}
                    <View style={styles.productInfo}>
                      {item.imagen ? (
                        <Image source={item.imagen} style={styles.thumbnail} resizeMode="contain" />
                      ) : (
                        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                          <Ionicons name="image-outline" size={32} color="#BBB" />
                        </View>
                      )}

                      <View style={styles.productDetails}>
                        <Text style={[styles.productName, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                          {item.nombre}
                        </Text>
                        <Text style={[styles.unitPrice, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                          Bs. {(item.precio || 0).toFixed(0)} unidad
                        </Text>
                        
                        {/* Contador de cantidad */}
                        <View style={styles.quantityContainer}>
                          <Text style={[styles.quantityLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                            Cantidad:
                          </Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity 
                              style={[styles.qtyButton, item.cantidad <= 1 && styles.qtyButtonDisabled]} 
                              onPress={() => changeQuantity(item.id, -1)}
                              disabled={item.cantidad <= 1}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="remove" size={18} color={item.cantidad <= 1 ? "#CCC" : "#2C3E50"} />
                            </TouchableOpacity>
                            <View style={styles.qtyDisplay}>
                              <Text style={[styles.qtyText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                                {item.cantidad}
                              </Text>
                            </View>
                            <TouchableOpacity 
                              style={styles.qtyButton} 
                              onPress={() => changeQuantity(item.id, +1)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="add" size={18} color="#2C3E50" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Subtotal por producto */}
                        <View style={styles.itemSubtotal}>
                          <Text style={[styles.subtotalLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                            Subtotal:
                          </Text>
                          <Text style={[styles.subtotalValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                            Bs. {((item.precio || 0) * (item.cantidad || 0)).toFixed(0)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Resumen de Compra */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="receipt-outline" size={22} color="#12A14B" />
                  <Text style={[styles.summaryTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                    Resumen de Compra
                  </Text>
                </View>

                <View style={styles.summaryDetails}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})
                    </Text>
                    <Text style={[styles.summaryValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      Bs. {subtotal.toFixed(0)}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <View style={styles.shippingInfo}>
                      <Ionicons name="car-outline" size={16} color="#666" />
                      <Text style={[styles.shippingLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                        Envío
                      </Text>
                    </View>
                    <Text style={[styles.freeShipping, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      ¡Gratis!
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={[styles.totalLabel, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      Total a pagar
                    </Text>
                    <Text style={[styles.totalValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      Bs. {total.toFixed(0)}
                    </Text>
                  </View>
                </View>

                {/* Badge de garantía */}
                <View style={styles.guaranteeBadge}>
                  <Ionicons name="shield-checkmark" size={18} color="#12A14B" />
                  <Text style={[styles.guaranteeText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Todos los productos incluyen 2 años de garantía
                  </Text>
                </View>
              </View>

              {/* Botones de Acción - MISMO TAMAÑO */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleContinueShopping}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.actionButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Seguir Comprando
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.finalizeButton]} 
                  onPress={handleFinalize}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.finalizeButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Finalizar Compra
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Footer - SOLO se muestra si hay productos */}
          {cartItems && cartItems.length > 0 && (
            <View style={styles.footerContainer}>
              <Footer />
            </View>
          )}
        </ScrollView>

        {/* Footer para carrito vacío - FUERA del ScrollView */}
        {(!cartItems || cartItems.length === 0) && (
          <View style={styles.bottomFooter}>
            <Footer />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

/* ------------------------ ESTILOS CORREGIDOS ------------------------ */

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
    minHeight: height * 0.8, // Altura mínima para carrito vacío
  },
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
  cartIconHeader: {
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
  // SECCIÓN DE CARRITO VACÍO - CORREGIDA
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
  emptySpacer: {
    height: height * 0.3, // Espacio para empujar el Footer hacia abajo
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
  // ❌ ELIMINADO: browseButton y browseText
  productsSection: {
    marginBottom: 20,
  },
  cartCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  removeButton: {
    padding: 6,
  },
  productInfo: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 5,
    lineHeight: 22,
  },
  unitPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qtyButtonDisabled: {
    backgroundColor: '#F8F9FA',
    borderColor: '#EEE',
  },
  qtyDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  itemSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  subtotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  subtotalValue: {
    fontSize: 18,
    color: '#12A14B',
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    color: '#2C3E50',
    marginLeft: 10,
  },
  summaryDetails: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#2C3E50',
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shippingLabel: {
    fontSize: 15,
    color: '#666',
  },
  freeShipping: {
    fontSize: 15,
    color: '#12A14B',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  totalRow: {
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 24,
    color: '#12A14B',
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  guaranteeText: {
    fontSize: 13,
    color: '#12A14B',
    flex: 1,
  },
  // Botones de Acción
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#12A14B',
    gap: 10,
  },
  actionButtonText: {
    color: '#12A14B',
    fontSize: 16,
  },
  finalizeButton: {
    backgroundColor: '#12A14B',
    borderWidth: 0,
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finalizeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  // Footer DENTRO del ScrollView (para cuando hay productos)
  footerContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  // Footer FUERA del ScrollView (para cuando está vacío)
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});