// DetallesProductoScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

// ✅ Mapeo de imágenes locales
const imagenesLocales = {
  // Cocinas
  "GLUX - 3SA MINEIRA.png": require("../assets/images/Cocina/4 Hornallas/GLUX - 3SA MINEIRA.png"),
  "GLUX - T50 BS LYS.png": require("../assets/images/Cocina/4 Hornallas/GLUX – T50 BS LYS.png"),

  // ✅ Climatización
  "AIRES SMART.png": require("../assets/images/Climatización/AIRES SMART.png"),
  "AIRES ONOFF.jpg": require("../assets/images/Climatización/AIRES ONOFF.jpg"),
  "AIRES ONOFF1.jpg": require("../assets/images/Climatización/AIRES ONOFF1.jpg"),
  "AIRES INVERTER.jpg": require("../assets/images/Climatización/AIRES INVERTER.jpg"),
  "GLUX-BA007.jpg": require("../assets/images/Climatización/GLUX-BA007.jpg"),
  "GLUX-BA008.png": require("../assets/images/Climatización/GLUX-BA008.png"),
};

export default function DetallesProductoScreen({ route }) {
  const { producto } = route.params;
  const [cantidad, setCantidad] = useState(1);

  const aumentarCantidad = () => setCantidad(cantidad + 1);
  const disminuirCantidad = () => cantidad > 1 && setCantidad(cantidad - 1);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text></Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* ✅ Carrusel de imágenes */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {producto.imagenes && producto.imagenes.length > 0 ? (
            producto.imagenes.map((img, index) => {
              const imgSrc = imagenesLocales[img];
              return (
                <View key={index} style={styles.imageContainer}>
                  {imgSrc ? (
                    <Image
                      source={imgSrc}
                      style={styles.imagenProducto}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={{ color: "#888" }}>No hay imagen: {img}</Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text>No hay imágenes para este producto</Text>
          )}
        </ScrollView>

        {/* Nombre */}
        <Text style={[styles.nombre, { fontFamily: "Aller_Bd" }]}>
          {producto.nombre}
        </Text>

        <Text style={[styles.subcategoria, { fontFamily: "Aller_Rg" }]}>
          {producto.variante}
        </Text>

        {/* Características */}
        <View style={styles.card}>
          <Text style={[styles.seccionTitulo, { fontFamily: "Aller_BdIt" }]}>
            Características
          </Text>
          {producto.caracteristicas?.map((car, i) => (
            <View key={i} style={styles.bulletContainer}>
              <Text style={[styles.bullet, { fontFamily: "Aller_Bd" }]}>∝</Text>
              <Text style={[styles.caracteristica, { fontFamily: "Aller_Rg" }]}>
                {car}
              </Text>
            </View>
          ))}
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={[styles.seccionTitulo, { fontFamily: "Aller_BdIt" }]}>
            Descripción
          </Text>
          <Text style={[styles.descripcion, { fontFamily: "Aller_Rg" }]}>
            {producto.descripcion}
          </Text>
        </View>

        {/* Precio */}
        <View style={styles.precioContainer}>
          <Text style={[styles.precio, { fontFamily: "Aller_Bd" }]}>
            Precio: Bs {producto.precio}
          </Text>
        </View>

        {/* Cantidad */}
        <View style={styles.cantidadContainer}>
          <TouchableOpacity style={styles.botonCantidad} onPress={disminuirCantidad}>
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.cantidadTexto, { fontFamily: "Aller_Bd" }]}>
            {cantidad}
          </Text>

          <TouchableOpacity style={styles.botonCantidad} onPress={aumentarCantidad}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Botón Carrito */}
        <TouchableOpacity style={styles.botonCarrito}>
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={[styles.textoCarrito, { fontFamily: "Aller_BdIt" }]}>
            Añadir al carrito
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
}

// ✅ Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFF9" },
  scrollContainer: { padding: 20, paddingBottom: 130 },

  carousel: {
    width: "100%",
    height: 260,
    marginBottom: 20,
  },
  imageContainer: {
    width: 350,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 10,
    elevation: 4,
  },
  imagenProducto: { width: "90%", height: "90%", borderRadius: 10 },

  nombre: { fontSize: 26, textAlign: "center", marginBottom: 5, color: "#000" },
  subcategoria: { fontSize: 20, textAlign: "center", color: "#12A14B", marginBottom: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  seccionTitulo: { fontSize: 18, color: "#12A14B", marginBottom: 10, textAlign: "center" },
  bulletContainer: { flexDirection: "row", marginBottom: 6 },
  bullet: { color: "#12A14B", fontSize: 16, marginRight: 6 },
  caracteristica: { fontSize: 15, color: "#333" },
  descripcion: { fontSize: 15, color: "#333", textAlign: "justify", lineHeight: 22 },

  precioContainer: {
    backgroundColor: "#E8F7ED",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  precio: { fontSize: 20, color: "#12A14B", fontWeight: "bold" },

  cantidadContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  botonCantidad: {
    backgroundColor: "#12A14B",
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cantidadTexto: { fontSize: 18, marginHorizontal: 15 },

  botonCarrito: {
    backgroundColor: "#12A14B",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  textoCarrito: { color: "#fff", fontSize: 16 },
});
