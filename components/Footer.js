import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <Image
          source={require("../assets/logo general lux-(Blanco).png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          © General Lux - 2025. Todos los Derechos Reservados.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: "auto",
    alignSelf: "stretch",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logo: { width: 100, height: 35, marginRight: 12 },
  footerText: { color: "#FFFFFF", fontSize: 12, flexShrink: 1 },
});
