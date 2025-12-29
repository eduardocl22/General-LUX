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
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const subproductos = [
  "Aires Acondicionados Smart",
  "Aires Convencionales",
  "DC Inverter Smart",
  "Soportes Para Aire",
];

const localImages = {
  "AIRES SMART.png": require("../assets/images/Climatización/AIRES SMART.png"),
  "AIRES ONOFF.jpg": require("../assets/images/Climatización/AIRES ONOFF.jpg"),
  "AIRES ONOFF1.jpg": require("../assets/images/Climatización/AIRES ONOFF1.jpg"),
  "AIRES INVERTER.jpg": require("../assets/images/Climatización/AIRES INVERTER.jpg"),
  "GLUX-BA007.jpg": require("../assets/images/Climatización/GLUX-BA007.jpg"),
  "GLUX-BA008.png": require("../assets/images/Climatización/GLUX-BA008.png"),
};

export default function ClimatizacionScreen({ navigation }) {
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
        const snapshot = await getDocs(collection(db, "Climatizacion"));
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

  // === Renderizado de producto ===
  const renderProduct = ({ item }) => {
    const imageSource = localImages[item.imagen];
    
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("DetallesProducto", { producto: item })}
        activeOpacity={0.8}
      >
        {/* Contenedor de imagen con fondo degradado */}
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.productImage} />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image" size={40} color="#CCC" />
              <Text style={styles.noImageText}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text 
            style={[styles.productName, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}
            numberOfLines={2}
          >
            {item.nombre}
          </Text>
          
          {item.precio && (
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Precio:
              </Text>
              <Text style={[styles.priceValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                Bs. {item.precio.toLocaleString()}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate("DetallesProducto", { producto: item })}
          >
            <Text style={[styles.detailsButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
              Ver Detalles
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
        imageStyle={{ opacity: 0.15 }}
      >
        <Header navigation={navigation} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Ionicons name="snow" size={40} color="#FFF" />
              </View>
              <Text style={[styles.heroTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                CLIMATIZACIÓN
              </Text>
              <Text style={[styles.heroSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Sistemas de aire acondicionado para tu hogar u oficina
              </Text>
            </View>
          </View>

          {/* Filtros */}
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

          {/* Productos */}
          <View style={styles.productsSection}>
            {loading ? (
              <View style={styles.loadingProducts}>
                <ActivityIndicator size="large" color="#12A14B" />
                <Text style={[styles.loadingText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  Cargando productos...
                </Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={60} color="#CCC" />
                <Text style={[styles.emptyText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  No hay productos disponibles
                </Text>
                <Text style={[styles.emptySubtext, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                  Prueba con otra categoría
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultsTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Productos ({filteredProducts.length})
                </Text>
                
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

          {/* Footer */}
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
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  
  // Hero Section
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
  heroIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
  
  // Filters Section
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
  
  // Products Section
  productsSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  resultsTitle: {
    fontSize: 20,
    color: '#2C3E50',
    marginBottom: 15,
  },
  productsGrid: {
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  // Product Card
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  imageContainer: {
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 10,
    minHeight: 40,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  priceValue: {
    fontSize: 16,
    color: '#12A14B',
  },
  detailsButton: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  
  // Footer
  footerContainer: {
    marginTop: 0,
    backgroundColor: 'transparent',
  },
});