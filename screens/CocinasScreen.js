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
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useFonts } from "expo-font";

// 🖼️ Mapeo de imágenes locales
const imagenesLocales = {
  "GLUX - 3SA MINEIRA.png": require("../assets/images/Cocina/4 Hornallas/GLUX - 3SA MINEIRA.png"),
  "GLUX - T50 BS LYS.png": require("../assets/images/Cocina/4 Hornallas/GLUX – T50 BS LYS.png"),
};

export default function CocinasScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const subproductos = [
    "4 Hornallas",
    "5 Hornallas",
    "6 Hornallas",
    "Encimeras",
    "Hornos de empotrar",
    "Hornos Eléctricos",
    "Extractores de grasa",
    "Complementos",
  ];

  // Cargar fuentes personalizadas
  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Cocinas"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrado por variante
  const filteredProducts = useMemo(() => {
    if (!selectedVariant) return productos;
    return productos.filter((item) => item.variante === selectedVariant);
  }, [productos, selectedVariant]);

  // Renderizar cada producto
  const renderProduct = ({ item }) => {
    const imagenLocal = imagenesLocales[item.imagen] || imagenesLocales.default;

    return (
      <View key={item.id} style={styles.productCard}>
        <Image source={imagenLocal} style={styles.productImage} />

        <Text style={[styles.productText, { fontFamily: "Aller_Rg" }]}>
          {item.nombre}
        </Text>

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() =>
            navigation.navigate("DetallesProducto", { producto: item })
          }
        >
          <Text style={[styles.readMoreText, { fontFamily: "Aller_BdIt" }]}>
            Ver más
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Filtros de variantes */}
        <View style={styles.stickyChips}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.chip,
                selectedVariant === null && styles.chipSelected,
              ]}
              onPress={() => setSelectedVariant(null)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedVariant === null && styles.chipTextSelected,
                  { fontFamily: "Aller_BdIt" },
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>

            {subproductos.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  selectedVariant === item && styles.chipSelected,
                ]}
                onPress={() => setSelectedVariant(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedVariant === item && styles.chipTextSelected,
                    { fontFamily: "Aller_BdIt" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de productos */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2ecc71"
            style={{ flex: 1, marginTop: 50 }}
          />
        ) : filteredProducts.length === 0 ? (
          <Text style={[styles.mensajeVacio, { fontFamily: "Aller_Rg" }]}>
            No hay productos disponibles.
          </Text>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
            ListHeaderComponent={
              <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>
                Cocinas
              </Text>
            }
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
          />
        )}
      </ImageBackground>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  background: { flex: 1, width: "100%", height: "100%" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    margin: 16,
    color: "#000",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stickyChips: {
    backgroundColor: "#12A14B",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#12A14B",
    zIndex: 10,
  },
  chip: {
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: { backgroundColor: "#12A14B", borderColor: "#12A14B" },
  chipText: { fontSize: 16, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },
  productCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
  },
  readMoreButton: {
    marginTop: 6,
    backgroundColor: "#5BA33B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  readMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  mensajeVacio: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 20,
  },
});
