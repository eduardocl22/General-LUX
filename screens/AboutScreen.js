import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUsScreen() {
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#045700",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#045700",
    marginBottom: 10,
  },
  text: { fontSize: 16, color: "#333", lineHeight: 22, textAlign: "start" },
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
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: { fontSize: 16, marginRight: 8, color: "#045700" },
  bulletText: { fontSize: 15, color: "#333", flex: 1 },
});
