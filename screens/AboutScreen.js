import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUsScreen() {
  // 🔠 Cargar fuentes Aller
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5BA33B" />
        <Text style={styles.loadingText}>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>QUIÉNES SOMOS</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            Somos una empresa con trayectoria e innovación tecnológica,
            ecoeficiente en todos nuestros productos para satisfacer a toda la
            familia. Nuestra tecnología y eficiencia en nuestros productos
            demuestra la indiscutible calidad internacional con la que son
            realizados.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>PROPÓSITO</Text>
          <Text style={styles.text}>
            Ayudar a la sociedad boliviana a tener momentos de satisfacción en
            sus hogares y trabajos al proveer a las familias de los diferentes
            departamentos de productos duraderos y de alta calidad.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>VISIÓN</Text>
          <Text style={styles.text}>
            Ser una empresa de clase mundial que produce y comercializa
            productos de alta tecnología y calidad, líder en el mercado
            nacional, que provee a las familias bolivianas productos de línea
            blanca de alta categoría amigables con el medio ambiente. Contamos
            con personal idóneo altamente capacitado y comprometido con el logro
            de nuestros objetivos orientados a la prestación de servicios de
            manera ágil y oportuna.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>MISIÓN</Text>
          <Text style={styles.text}>
            Aprovechar nuestra experiencia tanto nacional como internacional
            para liderar el mercado boliviano con una participación mayor al 40%
            dentro de los próximos 3 años, apoyados en la capacidad y compromiso
            de nuestro recurso humano.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>NUESTROS VALORES</Text>
          {[
            "La honestidad y la buena fe",
            "La amabilidad y el respeto",
            "La gratitud y la lealtad",
            "La responsabilidad y el esfuerzo",
            "El entusiasmo y el compromiso",
          ].map((valor, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{valor}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>
            POLÍTICA DE SEGURIDAD DE LA CADENA LOGÍSTICA INTERNACIONAL
          </Text>
          <Text style={styles.text}>
            GENERAL LUX es una empresa de amplia trayectoria, permanentemente
            innovadora y ecoeficiente en cada producto diseñado para satisfacer
            las necesidades de toda la familia. Es nuestra política ofrecer al
            mercado nacional productos con la más alta calidad y seguridad.
          </Text>
          <Text style={styles.text}>
            Hemos implementado un sistema de gestión de seguridad de nuestra
            cadena logística internacional que cumple con las leyes y
            normativas aduaneras legales vigentes, orientado a la detección,
            reconocimiento y prevención de actividades ilícitas en cada
            importación. General Lux asegura este compromiso facilitando los
            recursos necesarios para la mejora continua y el cumplimiento de los
            criterios mínimos de seguridad en todas sus operaciones.
          </Text>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 8, color: "#5BA33B", fontFamily: "Aller_Bd" },

  title: { fontSize: 26, color: "#5BA33B", marginBottom: 20, textAlign: "center", fontFamily: "Aller_BdIt" },
  subtitle: { fontSize: 18, color: "#5BA33B", marginBottom: 10, fontFamily: "Aller_BdIt" },
  text: { fontSize: 16, color: "#333", lineHeight: 22, textAlign: "left", fontFamily: "Aller_Rg" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },

  bulletItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bullet: { fontSize: 16, marginRight: 8, color: "#045700" },
  bulletText: { fontSize: 15, color: "#333", flex: 1, fontFamily: "Aller_Rg" },
});
