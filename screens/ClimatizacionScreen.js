import React, { useState, useMemo, memo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 🔹 Subcategorías
const subproductos = [
  "Aires Acondicionados Smart",
  "Aires Convencionales",
  "DC Inverter Smart",
  "Soportes Para Aire",
];

// 🔹 Productos
const productos = [
  {
    nombre: "AIRES SMART",
    variante: "Aires Acondicionados Smart",
    img: require("../assets/images/Climatización/AIRES SMART.png"),
  },
  {
    nombre: "AIRES ON/OFF",
    variante: "Aires Acondicionados Smart",
    img: require("../assets/images/Climatización/AIRES ONOFF.jpg"),
  },
  {
    nombre: "AIRES ON/OFF",
    variante: "Aires Convencionales",
    img: require("../assets/images/Climatización/AIRES ONOFF1.jpg"),
  },
  {
    nombre: "AIRES INVERTER",
    variante: "DC Inverter Smart",
    img: require("../assets/images/Climatización/AIRES INVERTER.jpg"),
  },
  {
    nombre: "GLUX-BA007",
    variante: "Soportes Para Aire",
    img: require("../assets/images/Climatización/GLUX-BA007.jpg"),
  },
  {
    nombre: "GLUX-BA008",
    variante: "Soportes Para Aire",
    img: require("../assets/images/Climatización/GLUX-BA008.png"),
  },
];

// 🔸 Componente de producto optimizado
const ProductCard = memo(({ item }) => (
  <View style={styles.productCardWrapper}>
    <View style={styles.productCard}>
      <Image source={item.img} style={styles.productImage} />
      <View style={styles.productLabel}>
        <Text
          style={[styles.productText, { fontFamily: "Aller_Bd" }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.nombre}
        </Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Leer más</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
));

export default function ClimatizacionScreen() {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  const filteredProducts = useMemo(() => {
    return selectedVariant
      ? productos.filter((item) => item.variante === selectedVariant)
      : productos;
  }, [selectedVariant]);

  return (
    <ImageBackground
      source={require("../assets/fondo.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#045700" />
      <Header />

      {/* Contenedor principal */}
      <View style={styles.container}>
        {/* 🔹 Chips fijos arriba */}
        <View style={styles.stickyChips}>
          <FlatList
            data={[null, ...subproductos]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              item === null ? (
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
              ) : (
                <TouchableOpacity
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
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            }
          />
        </View>

        {/* 🔹 FlatList de productos */}
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard item={item} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 5 }}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews
          extraData={selectedVariant}
          ListHeaderComponent={
            <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>
              Climatización
            </Text>
          }
          style={{ flex: 1 }}
        />

        {/* Footer fijo */}
        <Footer />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between", // Footer queda abajo
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
  productCardWrapper: {
    flex: 1 / 3,
    padding: 5,
  },
  productCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
  },
  productLabel: {
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingVertical: 6,
    alignItems: "center",
  },
  productText: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
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
});
