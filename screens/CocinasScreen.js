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

// Lista de subvariantes de cocinas
const subvariantes = [
  { nombre: "GLUX – T50 BS «LYS»", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX – T50 SS «VENISE»", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX -3SA ‘MINEIRA’", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 S «GAROTA»", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 SB-ES ‘MARACANA’", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 SSB-ES ‘CARNAVAL’", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1 STV SAMBA", img: require("../assets/images/cocinas.jpg") },
  { nombre: "GLUX 1P-‘PEQUI’", img: require("../assets/images/cocinas.jpg") },
];

export default function CocinasScreen() {
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Filtrar productos según subvariante seleccionada
  const filteredProducts = selectedVariant
    ? subvariantes.filter((item) => item.nombre === selectedVariant)
    : subvariantes;

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

      {/* Chips de subvariantes */}
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

        {subvariantes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              selectedVariant === item.nombre && styles.chipSelected,
            ]}
            onPress={() => setSelectedVariant(item.nombre)}
          >
            <Text
              style={[
                styles.chipText,
                selectedVariant === item.nombre && styles.chipTextSelected,
              ]}
            >
              {item.nombre}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
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
  },
  productImage: { width: 80, height: 80, marginBottom: 8 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
