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
  { nombre: "GLUX – T50 BS «LYS»", variante: "4 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX – T50 SS «VENISE", variante: "4 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX -3SA ‘MINEIRA’", variante: "5 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 S «GAROTA»", variante: "5 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 SB-ES ‘MARACANA", variante: "6 Hornallas", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 SSB-ES ‘CARNAVAL’", variante: "Encimeras", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 STV SAMBA", variante: "Hornos de empotrar", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 SSB-ES ‘CARNAVAL’", variante: "Hornos Eléctricos", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX -3SA ‘MINEIRA’", variante: "Extractores de grasa", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX – T50 BS «LYS»", variante: "Complementos", img: require("../assets/images/cocinas.jpg") },
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
      <Text style={styles.productText}>{item.nombre}</Text>
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: { fontSize: 12, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },

  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  productImage: { width: 80, height: 80, marginBottom: 8 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
