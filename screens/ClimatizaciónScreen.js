import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClimatizaciónScreen() {
  return (
    <View style={styles.container}>
      <Header title="Climatización" />
      <View style={styles.content}>
        <Text style={styles.text}>Aquí se mostrarán los productos de Climatización</Text>
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
