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
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
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
    maxHeight: 250,
  },
  productImage: { width: 100, height: 150, marginBottom: 10 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
