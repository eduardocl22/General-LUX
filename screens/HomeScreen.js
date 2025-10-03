import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Modal,
  Platform,
} from "react-native";
import Swiper from "react-native-swiper";
import Header from "../components/Header";
import Footer from "../components/Footer";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.round(width * 0.27);

export default function HomeScreen({ navigation }) {
  const [whatsappVisible, setWhatsappVisible] = useState(false);

  const categorias = [
    { nombre: "Climatización", img: require("../assets/images/climatización.jpg") },
    { nombre: "Cocinas", img: require("../assets/images/cocinas.jpg") },
    { nombre: "Dispensadores", img: require("../assets/images/dispensadores.png") },
    { nombre: "Lavadoras", img: require("../assets/images/lavadoras.png") },
    { nombre: "Licuadoras", img: require("../assets/images/licuadoras.jpg") },
    { nombre: "Microondas", img: require("../assets/images/microondas.png") },
    { nombre: "Planchas", img: require("../assets/images/planchas.jpg") },
    { nombre: "Refrigeración", img: require("../assets/images/refrigeración.png") },
    { nombre: "Televisores", img: require("../assets/images/televisores.jpg") },
  ];

  const openWhatsapp = () => {
    const url =
      "https://api.whatsapp.com/send/?phone=59172112333&text=Hola%2C+Acabamos+de+visitar+https%3A%2F%2Fgenerallux.com.bo%2Fcontacto%2F+me+pueden+brindar+información+acerca+de+General+LUX&type=phone_number&app_absent=0";
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* ✅ HEADER personalizado */}
      <Header navigation={navigation} />

      {/* Scroll principal */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Carrusel */}
        <View style={styles.carouselContainer}>
          <Swiper
            autoplay
            autoplayTimeout={3.5}
            showsPagination
            activeDotColor="#fff"
            dotColor="rgba(255,255,255,0.4)"
            height={220}
          >
            <Image source={require("../assets/1.png")} style={styles.carouselImage} resizeMode="contain" />
            <Image source={require("../assets/2.jpg")} style={styles.carouselImage} resizeMode="contain" />
            <Image source={require("../assets/3.png")} style={styles.carouselImage} resizeMode="contain" />
          </Swiper>
        </View>

        {/* Bienvenida */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Bienvenido a General Lux</Text>
          <Text style={styles.welcomeSubtitle}>
            Innovación y tecnología para tu hogar — descubre nuestras categorías y productos.
          </Text>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <View style={styles.grid}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.nombre}
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => navigation.navigate(cat.nombre)}
              >
                <Image source={cat.img} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{cat.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Contáctanos")}
          >
            <Text style={styles.contactText}>📞 Contáctanos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, { marginLeft: 10, backgroundColor: "#006600" }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Sobre Nosotros")}
          >
            <Text style={styles.contactText}>ℹ️ Sobre Nosotros</Text>
          </TouchableOpacity>
        </View>

        {/* Nota */}
        <View style={styles.noteWrap}>
          <Text style={styles.noteText}>
            ¿No encontraste lo que buscabas? Escríbenos y te ayudamos.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer />

      {/* WhatsApp flotante */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => setWhatsappVisible(true)}
      >
        <Image source={require("../assets/whatsapp.jpg")} style={styles.whatsappIcon} />
      </TouchableOpacity>

      {/* Modal WhatsApp */}
      <Modal
        visible={whatsappVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWhatsappVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            {/* Aquí va el contenido del modal */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContainer: { paddingBottom: 20, backgroundColor: "#ffffff" },
  carouselContainer: { width: "100%", height: 220, justifyContent: "center", alignItems: "center" },
  carouselImage: { width: width, height: 220, resizeMode: "contain" },
  welcomeContainer: { paddingVertical: 18, paddingHorizontal: 20, alignItems: "center" },
  welcomeTitle: { fontSize: 22, fontWeight: "700", color: "#045700", marginBottom: 6 },
  welcomeSubtitle: { fontSize: 14, color: "#555", textAlign: "center", lineHeight: 20 },
  categoriesSection: { paddingHorizontal: 16, paddingTop: 6 },
  sectionTitle: { fontSize: 20, color: "#045700", fontWeight: "700", marginBottom: 12, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: CARD_WIDTH, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", alignItems: "center", marginBottom: 14, elevation: 3 },
  cardImage: { width: "100%", height: 120, resizeMode: "cover" },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#222", textAlign: "center", paddingVertical: 8 },
  ctaWrap: { paddingHorizontal: 20, marginTop: 6, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  contactButton: { width: "40%", backgroundColor: "#045700", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  contactText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  noteWrap: { paddingHorizontal: 20, marginTop: 12, alignItems: "center" },
  noteText: { fontSize: 14, color: "#666", textAlign: "center" },
  whatsappButton: { position: "absolute", bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: "#25D366", justifyContent: "center", alignItems: "center", elevation: 5 },
  whatsappIcon: { width: 50, height: 50, resizeMode: "contain", borderRadius: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", paddingHorizontal: 12 },
  modalWrapper: { width: "92%", backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", alignItems: "center", paddingBottom: 14 },
});
