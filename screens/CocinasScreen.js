import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

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

const productos = [
  { nombre: "Cocina 4 Hornallas Modelo A", variante: "4 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Cocina 4 Hornallas Modelo B", variante: "4 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Cocina 5 Hornallas Modelo A", variante: "5 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Cocina 5 Hornallas Modelo B", variante: "5 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Cocina 6 Hornallas Modelo A", variante: "6 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Encimera Modelo A", variante: "Encimeras", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Horno de empotrar Modelo A", variante: "Hornos de empotrar", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Horno eléctrico Modelo A", variante: "Hornos Eléctricos", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Extractor de grasa Modelo A", variante: "Extractores de grasa", img: require("../assets/images/cocinas.jpg") },
  { nombre: "Complemento Modelo A", variante: "Complementos", img: require("../assets/images/cocinas.jpg") },
];

export default function CocinasScreen() {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const filteredProducts = selectedVariant
    ? productos.filter((item) => item.variante === selectedVariant)
    : productos;

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.img} style={styles.productImage} />
      <Text style={styles.productText} numberOfLines={2} ellipsizeMode="tail">
        {item.nombre}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de estado */}
      <StatusBar style="light" backgroundColor="#045700" />

      {/* HEADER igual al de HomeScreen */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>GENERAL LUX</Text>
      </View>

      <Text style={styles.title}>Cocinas</Text>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
      >
        <TouchableOpacity
          style={[styles.chip, selectedVariant === null && styles.chipSelected]}
          onPress={() => setSelectedVariant(null)}
        >
          <Text
            style={[styles.chipText, selectedVariant === null && styles.chipTextSelected]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        {subproductos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, selectedVariant === item && styles.chipSelected]}
            onPress={() => setSelectedVariant(item)}
          >
            <Text
              style={[styles.chipText, selectedVariant === item && styles.chipTextSelected]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#045700",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  title: { fontSize: 22, fontWeight: "bold", margin: 16, color: "#333" },

  chipContainer: { marginBottom: 16, paddingHorizontal: 10 },
  chip: {
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#045700",
    borderColor: "#045700",
  },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },

  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    maxHeight: 140,
  },
  productImage: { width: 80, height: 80, marginBottom: 8 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
