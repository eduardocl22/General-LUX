// screens/HomeScreen.js
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
  StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* StatusBar nativa para Android/iOS */}
      <RNStatusBar
        backgroundColor="#045700"
        barStyle="light-content"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>GENERAL LUX</Text>
      </View>

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
            containerStyle={styles.swiper}
          >
            <Image source={require("../assets/1.png")} style={styles.carouselImage} resizeMode="contain" />
            <Image source={require("../assets/2.jpg")} style={styles.carouselImage} resizeMode="contain" />
            <Image source={require("../assets/3.png")} style={styles.carouselImage} resizeMode="contain" />
          </Swiper>
        </View>

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

        <View style={styles.noteWrap}>
          <Text style={styles.noteText}>
            ¿No encontraste lo que buscabas? Escríbenos y te ayudamos.
          </Text>
        </View>
      </ScrollView>

      <Footer />

      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => setWhatsappVisible(true)}
      >
        <Image
          source={require("../assets/whatsapp.jpg")}
          style={styles.whatsappIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={whatsappVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWhatsappVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalTitleBar}>
              <Text style={styles.modalTitleText}>General Lux</Text>
              <TouchableOpacity onPress={() => setWhatsappVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bubbleWrap}>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>
                  En General Lux sabemos que la vida es algo más que tener la última tecnología. Se trata de crear experiencias mediante todos nuestros productos, los que podrás usar para entretenerte, descansar o incluso hacerte más fácil la vida.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.modalWhatsappButton} onPress={openWhatsapp} activeOpacity={0.9}>
              <Image source={require("../assets/whatsapp.jpg")} style={styles.modalWhatsappIcon} />
              <Text style={styles.modalWhatsappText}>Abrir chat WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#045700",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  /* Carrusel */
  carouselContainer: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  swiper: {},
  carouselImage: {
    width: width,
    height: 220,
    resizeMode: "contain",
  },

  /* Bienvenida */
  welcomeContainer: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#045700",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },

  /* Categorías */
  categoriesSection: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#045700",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    paddingVertical: 8,
  },

  /* CTA */
  ctaWrap: {
    paddingHorizontal: 20,
    marginTop: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  contactButton: {
    width: "40%",
    backgroundColor: "#045700",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  noteWrap: {
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: "center",
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  whatsappButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  whatsappIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  /* ------------------
     Modal styles
     ------------------ */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  // caja principal del modal
  modalWrapper: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 14,
  },

  // barra superior (verde) con título y botón cerrar
  modalTitleBar: {
    width: "100%",
    backgroundColor: "#25D366",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "700",
  },

  // contenedor del bocadillo (para centrar)
  bubbleWrap: {
    width: "90%",
    alignItems: "center",
    marginTop: 14,
  },
  // el rectángulo del bocadillo
  bubble: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    // sombra ligera
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    color: "#222",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
  // Botón grande WhatsApp
  modalWhatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    width: "86%",
    justifyContent: "center",
  },
  modalWhatsappIcon: {
    width: 26,
    height: 26,
    marginRight: 10,
    resizeMode: "contain",
  },
  modalWhatsappText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
