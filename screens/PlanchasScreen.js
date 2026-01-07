import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const subproductos = ["Seco", "Vapor"];

const localImages = {
  // "PLA-01.png": require("../assets/images/Planchas/PLA-01.png"),
};

export default function PlanchasScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  const fontFamilyOrDefault = (fontName) =>
    fontsLoaded ? fontName : "System";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "planchas"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedVariant || selectedVariant === "Todas") return productos;
    return productos.filter((item) => item.variante === selectedVariant);
  }, [productos, selectedVariant]);

  const renderProduct = ({ item }) => {
    const imageSource = localImages[item.imagen];
    
    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.productImage} />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="cube" size={32} color="#12A14B" />
              <Text style={styles.noImageText}>Imagen no disponible</Text>
            </View>
          )}
        </View>

        <View style={styles.productContent}>
          <Text 
            style={[styles.productName, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}
            numberOfLines={2}
          >
            {item.nombre}
          </Text>

          {item.precio && (
            <View style={styles.priceSection}>
              <View style={styles.priceTag}>
                <Text style={[styles.priceLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  Precio:
                </Text>
                <View style={styles.priceValueContainer}>
                  <Text style={[styles.priceCurrency, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Bs.
                  </Text>
                  <Text style={[styles.priceValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    {item.precio.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate("DetallesProducto", { producto: item })}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Text style={[styles.detailsButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Ver Detalles
                  </Text>
                  <View style={styles.buttonIconWrapper}>
                    <Ionicons name="arrow-forward" size={14} color="#FFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {!item.precio && (
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate("DetallesProducto", { producto: item })}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={[styles.detailsButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Ver Detalles
                </Text>
                <View style={styles.buttonIconWrapper}>
                  <Ionicons name="arrow-forward" size={14} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12A14B" />
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
            styles.scrollContent,
            (filteredProducts.length === 0 || loading) && styles.scrollContentEmpty
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                PLANCHAS
              </Text>
              <Text style={[styles.heroSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Planchas de ropa para un planchado perfecto
              </Text>
            </View>
          </View>

          <View style={styles.filtersSection}>
            <Text style={[styles.filtersTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              Filtro por categoría
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedVariant === null && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedVariant(null)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedVariant === null && styles.filterChipTextSelected,
                    { fontFamily: fontFamilyOrDefault("Aller_Bd") }
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              {subproductos.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterChip,
                    selectedVariant === item && styles.filterChipSelected,
                  ]}
                  onPress={() => setSelectedVariant(item)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedVariant === item && styles.filterChipTextSelected,
                      { fontFamily: fontFamilyOrDefault("Aller_Bd") }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.productsSection}>
            {loading ? (
              <View style={styles.loadingProducts}>
                <ActivityIndicator size="large" color="#12A14B" />
                <Text style={[styles.loadingText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  Cargando productos...
                </Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View style={styles.emptySection}>
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    <Ionicons name="search" size={50} color="#12A14B" />
                  </View>
                  <Text style={[styles.emptyText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    No hay productos disponibles
                  </Text>
                  <Text style={[styles.emptySubtext, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Prueba con otra categoría
                  </Text>
                </View>
                
                {/* Espaciador para contenido vacío */}
                <View style={styles.emptySpacer} />
              </View>
            ) : (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={[styles.resultsTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Productos
                  </Text>
                  <View style={styles.resultsCounter}>
                    <Text style={[styles.resultsCount, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      {filteredProducts.length} productos
                    </Text>
                  </View>
                </View>
                
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  numColumns={2}
                  contentContainerStyle={styles.productsGrid}
                  columnWrapperStyle={styles.columnWrapper}
                />
              </>
            )}
          </View>

          {/* Footer DENTRO del ScrollView (solo cuando hay productos) */}
          {filteredProducts.length > 0 && !loading && (
            <View style={styles.footerContainer}>
              <Footer />
            </View>
          )}
        </ScrollView>

        {/* Footer FUERA del ScrollView (cuando está vacío o cargando) */}
        {(filteredProducts.length === 0 || loading) && (
          <View style={styles.bottomFooter}>
            <Footer />
          </View>
        )}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  scrollContentEmpty: {
    minHeight: height * 0.8, // Altura mínima para contenido vacío
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  
  heroSection: {
    backgroundColor: 'rgba(18, 161, 75, 0.9)',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  
  filtersSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  filtersTitle: {
    fontSize: 20,
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  filtersScroll: {
    paddingHorizontal: 5,
  },
  filterChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipSelected: {
    backgroundColor: '#12A14B',
    borderColor: '#12A14B',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#FFF',
  },
  
  productsSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
    flex: 1,
  },
  loadingProducts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  // Sección de contenido vacío
  emptySection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(18, 161, 75, 0.1)',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#2C3E50',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptySpacer: {
    height: height * 0.3, // Espacio para empujar contenido
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  resultsTitle: {
    fontSize: 22,
    color: '#2C3E50',
  },
  resultsCounter: {
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultsCount: {
    fontSize: 12,
    color: '#12A14B',
  },
  productsGrid: {
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  
  imageContainer: {
    backgroundColor: 'rgba(18, 161, 75, 0.03)',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  noImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(18, 161, 75, 0.1)',
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  
  priceSection: {
    marginTop: 4,
  },
  priceTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceCurrency: {
    fontSize: 12,
    color: '#12A14B',
    marginRight: 2,
  },
  priceValue: {
    fontSize: 18,
    color: '#12A14B',
    fontWeight: 'bold',
  },
  
  detailsButton: {
    backgroundColor: '#12A14B',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#12A14B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 13,
    marginRight: 6,
  },
  buttonIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Footer DENTRO del ScrollView (para cuando hay productos)
  footerContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  
  // Footer FUERA del ScrollView (para cuando está vacío o cargando)
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});