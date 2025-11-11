// /screens/DispensadoresScreen.js
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

const subproductos = ["Con Compresor", "Eléctrico"];

// Mapea nombres de archivo tal como los pondrás en Firestore (imagen field)
// Por ahora está vacío hasta que pegues las imágenes, añade claves cuando las tengas:
// Ej: "DISP-01.png": require("../assets/images/Dispensadores/DISP-01.png")
const localImages = {
  // "DISP-01.png": require("../assets/images/Dispensadores/DISP-01.png"),
};

const ProductCard = memo(({ item, onPress }) => {
  const imageSource = localImages[item.imagen];

  return (
    <View style={styles.productCardWrapper}>
      <View style={styles.productCard}>
        {imageSource ? (
          <Image source={imageSource} style={styles.productImage} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.productLabel}>
          <Text
            style={[styles.productText, { fontFamily: "Aller_Bd" }]}
            numberOfLines={2}
          >
            {item.nombre}
          </Text>

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => onPress(item)}
          >
            <Text style={styles.readMoreText}>Ver más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default function DispensadoresScreen({ navigation }) {
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

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "dispensadores"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (mounted) setProductos(data);
      } catch (err) {
        console.error("Error cargando dispensadores:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    if (!selectedVariant || selectedVariant === "Todas") return productos;
    return productos.filter((p) => p.variante === selectedVariant);
  }, [productos, selectedVariant]);

  const openDetails = (item) =>
    navigation.navigate("DetallesProducto", { producto: item });

  if (!fontsLoaded)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12A14B" />
      </View>
    );

  return (
    <ImageBackground
      source={require("../assets/fondo.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#045700" />
      <Header />
      <View style={styles.container}>
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
            {subproductos.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  selectedVariant === s && styles.chipSelected,
                ]}
                onPress={() => setSelectedVariant(s)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedVariant === s && styles.chipTextSelected,
                    { fontFamily: "Aller_BdIt" },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#12A14B" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={[styles.mensajeVacio, { fontFamily: "Aller_Rg" }]}>
              No hay productos disponibles.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={openDetails} />
            )}
            keyExtractor={(i) => i.id}
            numColumns={2}
            contentContainerStyle={{
              paddingVertical: 16,
              paddingHorizontal: 8,
              paddingBottom: 90,
            }}
            ListHeaderComponent={
              <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>
                Dispensadores
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
  title: { fontSize: 35, margin: 16, color: "#000", textAlign: "center" },
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noImage: {
    width: "100%",
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  noImageText: { color: "#666", fontSize: 12 },
});
