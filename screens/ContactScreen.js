import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import ContactInfo from "../components/ContactInfo";

export default function ContactScreen() {
  // Coordenadas exactas según la URL de Google Maps
  const location = {
    latitude: -17.7977663,
    longitude: -63.150086,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef(null);

  // Función para abrir la ubicación en Google Maps o Apple Maps
  const openMaps = () => {
    const lat = location.latitude;
    const lng = location.longitude;
    const label = "General Lux, Santa Cruz";
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
            label
          )}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=ChIJY5K-Px6xjZsRRE8t8mueSbk`; // URL con place_id opcional
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.headerText}>GENERAL LUX</Text>
        </View>

        {/* Información de contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <ContactInfo label="Teléfono" value="+(591) 72112333" />
          <ContactInfo label="Correo" value="info@generallux.com.bo" />
          <ContactInfo
            label="Dirección"
            value="Cuarto Anillo & Av 3 pasos al frente, Santa Cruz de la Sierra"
          />
        </View>

        {/* Mapa embebido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Nuestra Ubicación</Text>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location}
            scrollEnabled={true}
            zoomEnabled={true}
            onPress={openMaps} // Detecta tap en cualquier parte del mapa
          >
            <Marker coordinate={location}>
              <Callout>
                <View style={{ padding: 5, maxWidth: 200 }}>
                  <Text style={{ fontWeight: "bold" }}>General Lux</Text>
                  <Text>Cuarto Anillo & Av 3 pasos al frente</Text>
                  <Text>Santa Cruz de la Sierra, Bolivia</Text>
                  <Text>Tel: +(591) 72112333</Text>
                  <Text>Email: info@generallux.com.bo</Text>
                </View>
              </Callout>
            </Marker>
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#045700",
  },
  logo: { width: 40, height: 40, resizeMode: "contain", marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  section: { paddingHorizontal: 16, marginTop: 18 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#045700",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
  },
  note: { textAlign: "center", fontSize: 14, color: "#555", marginTop: 8 },
});
