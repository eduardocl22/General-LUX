import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";

// Lista de subproductos para los chips
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

// Lista completa de productos
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

  // Filtrar productos según subproducto seleccionado
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
      <Text style={styles.title}>Cocinas</Text>

      {/* Chips de subproductos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
      >
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
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
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
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cuadrícula de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },

  chipContainer: { marginBottom: 16 },
  chip: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 32,          // altura fija
    justifyContent: "center",  // centrar verticalmente el texto
    alignItems: "center",      // centrar horizontalmente el texto
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    height: 32,          // misma altura que chip normal
    justifyContent: "center",
    alignItems: "center",
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
    maxHeight: 140, // Limita la altura para uniformidad
  },
  productImage: { width: 80, height: 80, marginBottom: 8 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
