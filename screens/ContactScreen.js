import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactInfo from '../components/ContactInfo';

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Contáctanos</Text>

        <ContactInfo label="Teléfono" value="+(591) 72112333" />
        <ContactInfo label="Correo" value="info@generallux.com.bo" />
        <ContactInfo label="Dirección" value="4to Anillo, Av. 3 Pasos al Frente" />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000000ff', marginBottom: 20, textAlign: 'center' },
});
