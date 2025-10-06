import React from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClimatizaciónScreen() {
  return (
    <View style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="#045700" />

      {/* Header personalizado */}
      <Header />

      {/* Contenido de la pantalla */}
      <View style={styles.content}>
        {/* Aquí puedes agregar el contenido que quieras en el futuro */}
      </View>

      {/* Footer personalizado */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  content: {
    flex: 1,
    // Separa contenido del header y footer
    padding: 16,
  },
});
