import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TelevisoresScreen() {
  return (
    <View style={styles.container}>
      <Header title="Televisores" />
      <View style={styles.content}>
        <Text style={styles.text}>Aquí se mostrarán los productos de Televisores</Text>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
