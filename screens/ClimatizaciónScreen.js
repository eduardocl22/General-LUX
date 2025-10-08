// ClimatizaciónScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import Footer from "../components/Footer";

const subproductos = [
  "Aires Acondicionados Smart",
  "Aires Convencionales",
  "DC Inverter Smart",
  "Soportes Para Aire",
];

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

export default function ClimatizaciónScreen() {
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
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />; // pantalla blanca mientras cargan
  }

  const filteredProducts = selectedVariant
    ? productos.filter((item) => item.variante === selectedVariant)
    : productos;

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.img} style={styles.productImage} />
      <Text style={[styles.productText, { fontFamily: "Aller_Bd" }]} numberOfLines={2} ellipsizeMode="tail">
        {item.nombre}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5BA33B" />

      <Header />

      {/* Título */}
      <Text style={[styles.title, { fontFamily: "Aller_BdIt" }]}>Climatización</Text>

      {/* Chips de filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        <TouchableOpacity
          style={[styles.chip, selectedVariant === null && styles.chipSelected]}
          onPress={() => setSelectedVariant(null)}
        >
          <Text style={[styles.chipText, selectedVariant === null && styles.chipTextSelected, { fontFamily: "Aller_BdIt" }]}>
            Todas
          </Text>
        </TouchableOpacity>

        {subproductos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, selectedVariant === item && styles.chipSelected]}
            onPress={() => setSelectedVariant(item)}
          >
            <Text style={[styles.chipText, selectedVariant === item && styles.chipTextSelected, { fontFamily: "Aller_BdIt" }]} numberOfLines={1} ellipsizeMode="tail">
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: 16 }}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  title: { fontSize: 35, margin: 16, color: "#5BA33B", textAlign: "center" },

  chipContainer: { marginBottom: 16, paddingHorizontal: 10 },
  chip: {
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: { backgroundColor: "#5BA33B", borderColor: "#5BA33B" },
  chipText: { fontSize: 16, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },

  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    maxHeight: 250,
  },
  productImage: { width: 100, height: 150, marginBottom: 10 },
  productText: { fontSize: 14, textAlign: "center" },
});
