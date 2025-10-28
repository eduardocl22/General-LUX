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

//Mapeo de imágenes locales
const imagenes = {
  "GLUX - 3SA MINEIRA.png": require("../assets/images/Cocina/4 Hornallas/GLUX - 3SA MINEIRA.png"),
  "GLUX - T50 BS LYS.png": require("../assets/images/Cocina/4 Hornallas/GLUX – T50 BS LYS.png"),
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
        <Text>Cargando...</Text>
      </View>
    );
  }

  const imagenLocal = imagenes[producto.imagen];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Imagen del producto */}
        {imagenLocal ? (
          <View style={styles.imageContainer}>
            <Image
              source={imagenLocal}
              style={styles.imagenProducto}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Text style={{ color: "#888" }}>No se encontró la imagen</Text>
          </View>
        )}

        {/* Nombre y categoría */}
        <Text style={[styles.nombre, { fontFamily: "Aller_Bd" }]}>
          {producto.nombre || "Producto sin nombre"}
        </Text>
        <Text style={[styles.subcategoria, { fontFamily: "Aller_Rg" }]}>
          {producto.variante || "Sin categoría"}
        </Text>

        {/* Características */}
        <View style={styles.card}>
          <Text style={[styles.seccionTitulo, { fontFamily: "Aller_BdIt" }]}>
            Características
          </Text>
          {producto.caracteristicas &&
          Array.isArray(producto.caracteristicas) &&
          producto.caracteristicas.length > 0 ? (
            producto.caracteristicas.map((car, index) => (
              <View key={index} style={styles.bulletContainer}>
                <Text
                  style={[styles.bullet, { fontFamily: "Aller_Bd" }]}
                >{`∝`}</Text>
                <Text
                  style={[styles.caracteristica, { fontFamily: "Aller_Rg" }]}
                >
                  {car}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.caracteristica, { fontFamily: "Aller_Rg" }]}>
              No hay características registradas.
            </Text>
          )}
        </View>

        {/* Descripción */}
        <View style={styles.card}>
          <Text style={[styles.seccionTitulo, { fontFamily: "Aller_BdIt" }]}>
            Descripción
          </Text>
          <Text style={[styles.descripcion, { fontFamily: "Aller_Rg" }]}>
            {producto.descripcion || "Sin descripción disponible."}
          </Text>
        </View>

        {/* Precio */}
        <View style={styles.precioContainer}>
          <Text style={[styles.precio, { fontFamily: "Aller_Bd" }]}>
            Precio: ${producto.precio ?? "0.00"}
          </Text>
        </View>

        {/* Selector de cantidad */}
        <View style={styles.cantidadContainer}>
          <TouchableOpacity
            style={styles.botonCantidad}
            onPress={disminuirCantidad}
          >
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.cantidadTexto, { fontFamily: "Aller_Bd" }]}>
            {cantidad}
          </Text>
          <TouchableOpacity
            style={styles.botonCantidad}
            onPress={aumentarCantidad}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Botón añadir al carrito */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FFF9",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20,
    alignItems: "center",
  },
  imagenProducto: {
    width: "90%",
    height: 250,
    borderRadius: 15,
  },
  nombre: {
    fontSize: 26,
    textAlign: "center",
    color: "#000",
    marginBottom: 5,
  },
  subcategoria: {
    fontSize: 20,
    textAlign: "center",
    color: "#12A14B",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  seccionTitulo: {
    fontSize: 18,
    color: "#12A14B",
    marginBottom: 10,
    textAlign: "center",
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    color: "#12A14B",
    fontSize: 16,
    marginRight: 6,
  },
  caracteristica: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  descripcion: {
    fontSize: 15,
    color: "#333",
    textAlign: "justify",
    lineHeight: 22,
  },
  precioContainer: {
    backgroundColor: "#E8F7ED",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  precio: {
    fontSize: 20,
    color: "#12A14B",
    fontWeight: "bold",
  },
  cantidadContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  botonCantidad: {
    backgroundColor: "#12A14B",
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cantidadTexto: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  botonCarrito: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
    gap: 8,
  },
  textoCarrito: {
    color: "#fff",
    fontSize: 16,
  },
});
