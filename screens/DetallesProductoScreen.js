import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.35;

const imagenesLocales = {
  // Cocinas
  "GLUX - 3SA MINEIRA.png": require("../assets/images/Cocina/4 Hornallas/GLUX - 3SA MINEIRA.png"),
  "GLUX - T50 BS LYS.png": require("../assets/images/Cocina/4 Hornallas/GLUX – T50 BS LYS.png"),
  // Climatización
  "AIRES SMART.png": require("../assets/images/Climatización/AIRES SMART.png"),
  "AIRES ONOFF.jpg": require("../assets/images/Climatización/AIRES ONOFF.jpg"),
  "AIRES ONOFF1.jpg": require("../assets/images/Climatización/AIRES ONOFF1.jpg"),
  "AIRES INVERTER.jpg": require("../assets/images/Climatización/AIRES INVERTER.jpg"),
  "GLUX-BA007.jpg": require("../assets/images/Climatización/GLUX-BA007.jpg"),
  "GLUX-BA008.png": require("../assets/images/Climatización/GLUX-BA008.png"),
};

export default function DetallesProductoScreen({ route }) {
  const { producto } = route.params;
  const navigation = useNavigation();
  const { addToCart, cartItems } = useCart();

  const [yaEnCarrito, setYaEnCarrito] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const animacion = useRef(new Animated.Value(-80)).current;
  const opacidad = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const existe = cartItems.some((item) => item.id === producto.id);
    setYaEnCarrito(existe);
  }, [cartItems]);

  const mostrarMensaje = () => {
    setMensajeVisible(true);
    Animated.parallel([
      Animated.timing(animacion, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(animacion, {
          toValue: -80,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacidad, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setMensajeVisible(false));
    }, 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen:
        imagenesLocales[producto.imagenes?.[0]] ||
        require("../assets/images/climatización.jpg"),
      cantidad: 1,
    });
    mostrarMensaje();
    setYaEnCarrito(true);
    
    // Animación de botón
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

// NUEVO - Usar navigate normal:
const handleVerCarrito = () => {
  navigation.navigate("CarritoScreen");
};

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F8F9FA' }}>
        <Text style={{ fontFamily: "Aller_Rg", color: '#666' }}>Cargando...</Text>
      </View>
    );
  }

  const fontFamilyOrDefault = (fontName) =>
    fontsLoaded ? fontName : "System";

  const renderCarouselItem = ({ item, index }) => {
    const imgSrc = imagenesLocales[item];
    return (
      <View style={styles.carouselItem}>
        {imgSrc ? (
          <Image
            source={imgSrc}
            style={styles.carouselImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={60} color="#DDD" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
      
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header referenciado desde componente Header.js */}
        <Header navigation={navigation} />

        {/* Mensaje emergente mejorado */}
        {mensajeVisible && (
          <Animated.View
            style={[
              styles.mensajeEmergente,
              { opacity: opacidad, transform: [{ translateY: animacion }] },
            ]}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            <Text style={[styles.textoMensaje, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              "{producto.nombre}" se ha añadido a tu carrito.
            </Text>
          </Animated.View>
        )}

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado del producto */}
          <View style={styles.productHeader}>
            <View style={styles.categoryBadge}>
              <Text style={[styles.categoryText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                {producto.categoria || "General Lux"}
              </Text>
            </View>
          </View>

          {/* Carrusel de imágenes mejorado */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              height={IMAGE_HEIGHT}
              autoPlay={false}
              data={producto.imagenes || []}
              renderItem={renderCarouselItem}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
            />
            
            {/* Contador de imágenes */}
            <View style={styles.imageCounter}>
              <Text style={[styles.counterText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                {(producto.imagenes?.length || 1)} imágenes
              </Text>
            </View>
          </View>

          {/* Información principal del producto */}
          <View style={styles.mainInfoCard}>
            <Text style={[styles.nombre, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
              {producto.nombre}
            </Text>
            <Text style={[styles.subcategoria, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              {producto.variante || "Modelo Premium"}
            </Text>
            
            {/* Rating y stock */}
            <View style={styles.ratingStockContainer}>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={16} color="#F39C12" />
                ))}
                <Text style={[styles.ratingText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  5.0 (24 reseñas)
                </Text>
              </View>
              <View style={[styles.stockBadge, { backgroundColor: '#2ECC71' }]}>
                <Text style={[styles.stockText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  ✓ En stock
                </Text>
              </View>
            </View>
          </View>

          {/* Características */}
          <View style={styles.featuresCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                <Ionicons name="checkmark-circle" size={18} color="#12A14B" /> Características principales
              </Text>
            </View>
            <View style={styles.featuresGrid}>
              {producto.caracteristicas?.map((car, i) => (
                <View key={i} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="checkmark" size={16} color="#12A14B" />
                  </View>
                  <Text style={[styles.featureText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    {car}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Precio destacado */}
          <View style={styles.precioCard}>
            <View style={styles.precioInfo}>
              <Text style={[styles.precioLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Precio especial
              </Text>
              <Text style={[styles.precio, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                Bs {producto.precio}
              </Text>
            </View>
            <View style={styles.garantiaBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#12A14B" />
              <Text style={[styles.garantiaText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                2 años de garantía
              </Text>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                <Ionicons name="document-text" size={18} color="#12A14B" /> Descripción del producto
              </Text>
            </View>
            <Text style={[styles.descripcion, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              {producto.descripcion || "Producto de alta calidad de General Lux con garantía y soporte especializado."}
            </Text>
            
            {/* Especificaciones técnicas */}
            {producto.especificaciones && (
              <View style={styles.specsContainer}>
                <Text style={[styles.specsTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Especificaciones técnicas:
                </Text>
                {Object.entries(producto.especificaciones).map(([key, value], index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={[styles.specKey, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>{key}:</Text>
                    <Text style={[styles.specValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>{value}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Botón de acción */}
          <Animated.View style={[styles.actionsContainer, { transform: [{ scale: scaleAnim }] }]}>
            {yaEnCarrito ? (
              <View style={styles.inCartContainer}>
                <View style={styles.inCartMessage}>
                  <Ionicons name="checkmark-circle" size={20} color="#000000ff" />
                  <Text style={[styles.inCartText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Este producto ya está en tu carrito
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewCartButton}
                  onPress={handleVerCarrito}
                  activeOpacity={0.9}
                >
                  <Ionicons name="cart" size={20} color="#FFF" />
                  <Text style={[styles.actionButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Ver carrito ({cartItems.length})
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                activeOpacity={0.9}
              >
                <Ionicons name="cart-outline" size={22} color="#FFF" />
                <Text style={[styles.actionButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Añadir al carrito
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Productos relacionados sugeridos */}
          <View style={styles.relatedSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                <Ionicons name="trending-up" size={18} color="#12A14B" /> Productos relacionados
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.relatedScroll}
            >
              <View style={styles.relatedPlaceholder}>
                <Ionicons name="grid" size={40} color="#DDD" />
                <Text style={[styles.relatedText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  Productos similares
                </Text>
              </View>
            </ScrollView>
          </View>

          {/* Footer DENTRO del ScrollView - EXACTO como HomeScreen */}
          <View style={styles.footerContainer}>
            <Footer />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

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
    paddingBottom: 0, // Importante para Footer
  },
  mensajeEmergente: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 110,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12A14B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  textoMensaje: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#12A14B',
  },
  categoryText: {
    color: '#12A14B',
    fontSize: 12,
  },
  carouselContainer: {
    height: IMAGE_HEIGHT,
    marginBottom: 15,
    position: 'relative',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFF',
    fontSize: 12,
  },
  mainInfoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nombre: {
    fontSize: 24,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 30,
  },
  subcategoria: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  ratingStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    color: '#FFF',
    fontSize: 12,
  },
  featuresCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2C3E50',
  },
  featuresGrid: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 8,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  precioCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E8F7ED',
  },
  precioInfo: {
    flex: 1,
  },
  precioLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  precio: {
    fontSize: 28,
    color: '#12A14B',
  },
  garantiaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  garantiaText: {
    fontSize: 12,
    color: '#12A14B',
  },
  descriptionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  specsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  specsTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  specKey: {
    fontSize: 13,
    color: '#666',
  },
  specValue: {
    fontSize: 13,
    color: '#2C3E50',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inCartContainer: {
    alignItems: 'center',
  },
  inCartMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  inCartText: {
    color: '#000000ff',
    fontSize: 14,
  },
  addToCartButton: {
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
  viewCartButton: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    width: '100%',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  relatedSection: {
    marginBottom: 20,
  },
  relatedScroll: {
    paddingLeft: 20,
  },
  relatedPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  relatedText: {
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
  // Footer EXACTO como HomeScreen
  footerContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});