import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>QUIENES SOMOS</Text>
        <Text style={styles.text}>
          Somos una empresa con trayectoria e innovación tecnológica,
          ecoeficiente en todos nuestros productos para satisfacer a toda la
          familia. Nuestra tecnología y eficiencia en nuestros productos
          demuestra la indiscutible calidad internacional con la que son
          realizados.
        </Text>
        <Text style={styles.subtitle}>PROPÓSITO</Text>
        <Text style={styles.text}>
          Ayudar a la sociedad boliviana a tener momentos de satisfacción en sus
          hogares y trabajos al Proveer a las familias de los diferentes
          departamentos de productos duraderos y de alta calidad.
        </Text>
        <Text style={styles.subtitle}>VISIÓN</Text>
        <Text style={styles.text}>
          Ser una empresa de clase mundial que produce y comercializa productos
          de alta tecnología y calidad, líder en el mercado nacional, que provee
          a las familias bolivianas productos de línea blanca de alta categoría
          amigables con el medio ambiente que hacen sus momentos más
          satisfactorios. Contamos con personal idóneo altamente capacitado y
          comprometido con el logro de nuestros objetivos orientados a la
          prestación de servicios de manera ágil y oportuna.
        </Text>
        <Text style={styles.subtitle}>MISIÓN</Text>
        <Text style={styles.text}>
          Aprovechar nuestra experiencia tanto nacional como internacional para
          liderar el mercado boliviano con una participación mayor al 40% dentro
          de los próximos 3 años, apoyados en la capacidad y compromiso de
          nuestro recurso humano.
        </Text>
        <Text style={styles.subtitle}>NUESTROS VALORES </Text>
        <Text style={styles.text}>
          {"\u2022"} La honestidad y la buena fe.{"\n"}
          {"\u2022"} La amabilidad y el respeto.{"\n"}
          {"\u2022"} La gratitud y la lealtad.{"\n"}
          {"\u2022"} La responsabilidad y el esfuerzo.{"\n"}
          {"\u2022"} El entusiasmo y el compromiso.{"\n"}
        </Text>
        <Text style={styles.subtitle}>
          POLÍTICA DE SEGURIDAD DE LA CADENA LOGÍSTICA INTERNACIONAL
        </Text>
        <Text style={styles.text}>
          GENERAL LUX, es una empresa de amplia trayectoria, permanentemente
          innovadora en tecnológica ecoeficiente en cada producto diseñado para
          satisfacer las necesidades de toda la familia. Es nuestra política
          ofrecer al mercado nacional, productos con la más alta calidad y
          seguridad. Tratamos de crear experiencias reales mediante todos
          nuestros productos, los que pueden ser utilizados para
          entretenimiento, descanso, y todo aquello pueda hacer la vida más
          fácil dentro del hogar, la escuela, la oficina, etc. Para lograr este
          compromiso, hemos implementado un sistema de gestión de seguridad de
          nuestra cadena logística internacional que cumple con las leyes y
          normativas aduaneras legales vigentes, a nivel nacional e
          internacional; orientando a la detección, reconocimiento y prevención
          de las actividades ilícitas y conductas delictivas en cada importación
          que realizamos. Para asegurar el compromiso con la seguridad de
          nuestra cadena logística internacional, General Lux establece y
          facilita los recursos necesarios para la mejora continua y
          cumplimiento de los criterios mínimos de seguridad que se han
          establecido en cada operación que se realiza.
        </Text>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#045700ff",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#045700ff",
    marginTop: 15,
    marginBottom: 5,
  },
  text: { fontSize: 16, color: "#444", lineHeight: 22 },
});
