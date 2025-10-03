import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import { Phone, Mail, MapPin } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { StatusBar } from "expo-status-bar";

export default function ContactScreen() {
  const location = {
    latitude: -17.7977663,
    longitude: -63.150086,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef(null);

  const openMaps = () => {
    const lat = location.latitude;
    const lng = location.longitude;
    const label = "General Lux, Santa Cruz";
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
            label
          )}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=ChIJY5K-Px6xjZsRRE8t8mueSbk`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" backgroundColor="#045700" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Contáctanos</Text>

        {/* Tarjeta Teléfono */}
        <View style={styles.card}>
          <Phone size={28} color="#10be00ff" style={styles.icon} />
          <View>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>+(591) 72112333</Text>
          </View>
        </View>

        {/* Tarjeta Correo */}
        <View style={styles.card}>
          <Mail size={28} color="#10be00ff" style={styles.icon} />
          <View>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>info@generallux.com.bo</Text>
          </View>
        </View>

        {/* Tarjeta Dirección */}
        <View style={styles.card}>
          <MapPin size={28} color="#10be00ff" style={styles.icon} />
          <View>
            <Text style={styles.label}>Dirección</Text>
            <Text style={styles.value}>
              Cuarto Anillo & Av 3 Pasos al Frente
            </Text>
          </View>
        </View>

        {/* Mapa embebido */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>📍 Nuestra Ubicación</Text>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          scrollEnabled={true}
          zoomEnabled={true}
          onPress={openMaps}
        >
          <Marker coordinate={location}>
            <Callout>
              <View style={{ padding: 5, maxWidth: 220 }}>
                <Text style={{ fontWeight: "bold" }}>General Lux</Text>
                <Text>Cuarto Anillo & Av 3 Pasos al Frente</Text>
                <Text>Santa Cruz de la Sierra, Bolivia</Text>
                <Text>Tel: +(591) 72112333</Text>
                <Text>Email: info@generallux.com.bo</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 25,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  icon: { marginRight: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#555" },
  value: { fontSize: 16, fontWeight: "bold", color: "#000" },

  // Mapa
  map: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#045700", marginBottom: 10 },
  note: { textAlign: "center", fontSize: 14, color: "#555", marginBottom: 16 },
});
