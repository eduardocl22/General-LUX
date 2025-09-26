import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Phone, Mail, MapPin } from 'lucide-react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { StatusBar } from "expo-status-bar";

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <StatusBar style="light" backgroundColor="#045700" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Contáctanos</Text>

        {/* Tarjeta Teléfono */}
        <View style={styles.card}>
          <Phone size={28} color="#0056b3" style={styles.icon} />
          <View>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>+(591) 72112333</Text>
          </View>
        </View>

        {/* Tarjeta Correo */}
        <View style={styles.card}>
          <Mail size={28} color="#0056b3" style={styles.icon} />
          <View>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>info@generallux.com.bo</Text>
          </View>
        </View>

        {/* Tarjeta Dirección */}
        <View style={styles.card}>
          <MapPin size={28} color="#0056b3" style={styles.icon} />
          <View>
            <Text style={styles.label}>Dirección</Text>
            <Text style={styles.value}>4to Anillo, Av. 3 Pasos al Frente</Text>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  icon: { marginRight: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#555' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});
