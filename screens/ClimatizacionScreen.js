import React, { useEffect, useState, useMemo, memo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const ProductCard = memo(({ item, onPress }) => {
  const imageSource = localImages[item.imagen];

  return (
    <View style={styles.productCardWrapper}>
      <View style={styles.productCard}>
        {imageSource ? (
          <Image source={imageSource} style={styles.productImage} />
        ) : (
          <View
            style={{
              width: "100%",
              height: "55%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
          >
            <Text style={{ color: "#666", fontSize: 12 }}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.productLabel}>
          <Text
            style={[styles.productText, { fontFamily: "Aller_Bd" }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.nombre}
          </Text>

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => onPress(item)}
          >
            <Text style={styles.readMoreText}>Leer más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function ClimatizacionScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 🔹 Cargar fuentes personalizadas
  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  // 🔹 Obtener productos desde Firestore (colección 'climatizacion')
  useEffect(() => {
    let mounted = true;
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Climatizacion"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (mounted) setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos de climatización:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProductos();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Filtrar por variante (subcategoría)
  const filteredProducts = useMemo(() => {
    if (!selectedVariant || selectedVariant === "Todas") return productos;
    return productos.filter((item) => item.variante === selectedVariant);
  }, [productos, selectedVariant]);

  // 🔹 Ir a la pantalla de detalles
  const handleOpenDetails = (item) => {
    navigation.navigate("DetallesProducto", { producto: item });
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12A14B" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/fondo.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#045700" />
      <Header />

      <View style={styles.container}>
        {/* 🔹 Subcategorías */}
        <View style={styles.stickyChips}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                (selectedVariant === null || selectedVariant === "Todas") &&
                  styles.chipSelected,
              ]}
              onPress={() => setSelectedVariant("Todas")}
            >
              <Text
                style={[
                  styles.chipText,
                  (selectedVariant === null || selectedVariant === "Todas") &&
                    styles.chipTextSelected,
                  { fontFamily: "Aller_BdIt" },
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>

            {subproductos.map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[
                  styles.chip,
                  selectedVariant === sub && styles.chipSelected,
                ]}
                onPress={() => setSelectedVariant(sub)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedVariant === sub && styles.chipTextSelected,
                    { fontFamily: "Aller_BdIt" },
                  ]}
                >
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 🔹 Lista de productos */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={[styles.mensajeVacio, { fontFamily: "Aller_Rg" }]}>
              No hay productos disponibles.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={handleOpenDetails} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{
              paddingVertical: 16,
              paddingHorizontal: 8,
              paddingBottom: 90,
            }}
            ListHeaderComponent={
              <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>
                Climatización
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        <Footer />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1, justifyContent: "space-between" },
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
  productCardWrapper: { flex: 1 / 3, padding: 5 },
  productCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  productImage: { width: "100%", height: "55%", resizeMode: "contain" },
  productLabel: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 8,
    alignItems: "center",
  },
  productText: { fontSize: 14, textAlign: "center", color: "#000" },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
