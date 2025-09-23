import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Footer from "../components/Footer";

export default function CocinasScreen() {
  const url = "https://generallux.com.bo/categoria-producto/cocinas";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}> 

      {/* WebView con productos */}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
      />

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#045700" },
  logo: { width: 40, height: 40, resizeMode: "contain", marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  webview: { flex: 1 },
});