// HomeScreen.js
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
  ImageBackground,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useFonts } from "expo-font";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.round(width * 0.27);

export default function HomeScreen({ navigation }) {
  const [whatsappVisible, setWhatsappVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Aller_Bd: require("../assets/fonts/Aller_Bd.ttf"),
    Aller_BdIt: require("../assets/fonts/Aller_BdIt.ttf"),
    Aller_It: require("../assets/fonts/Aller_It.ttf"),
    Aller_Lt: require("../assets/fonts/Aller_Lt.ttf"),
    Aller_LtIt: require("../assets/fonts/Aller_LtIt.ttf"),
    Aller_Rg: require("../assets/fonts/Aller_Rg.ttf"),
  });

  const fontFamilyOrDefault = (fontName) =>
    fontsLoaded ? fontName : undefined;

  const categorias = [
    {
      nombre: "Climatización",
      img: require("../assets/images/climatización.jpg"),
    },
    { nombre: "Cocinas", img: require("../assets/images/cocinas.jpg") },
    {
      nombre: "Dispensadores",
      img: require("../assets/images/dispensadores.png"),
    },
    { nombre: "Lavadoras", img: require("../assets/images/lavadoras.png") },
    { nombre: "Licuadoras", img: require("../assets/images/licuadoras.jpg") },
    { nombre: "Microondas", img: require("../assets/images/microondas.png") },
    { nombre: "Planchas", img: require("../assets/images/planchas.jpg") },
    {
      nombre: "Refrigeración",
      img: require("../assets/images/refrigeración.png"),
    },
    { nombre: "Televisores", img: require("../assets/images/televisores.jpg") },
  ];

  const carouselImages = [
    require("../assets/1.png"),
    require("../assets/2.jpg"),
    require("../assets/3.png"),
  ];

  const openWhatsapp = () => {
    const url =
      "https://api.whatsapp.com/send/?phone=59172112333&text=Hola%2C+Acabamos+de+visitar+la+aplicación+General+Lux,+me+pueden+brindar+información+acerca+de+General+LUX&type=phone_number&app_absent=0";
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header navigation={navigation} />

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}>
          {/* Carrusel */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              height={220}
              autoPlay
              autoPlayInterval={2500}
              scrollAnimationDuration={1000}
              data={carouselImages}
              renderItem={({ item }) => (
                <View style={styles.carouselImageWrapper}>
                  <Image
                    source={item}
                    style={styles.carouselImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>

          {/* Bienvenida */}
          <View style={styles.welcomeContainer}>
            <Text
              style={[
                styles.welcomeTitle,
                { fontFamily: fontFamilyOrDefault("Aller_BdIt") },
              ]}
            >
              Bienvenido a General Lux
            </Text>
            <Text
              style={[
                styles.welcomeSubtitle,
                { fontFamily: fontFamilyOrDefault("Aller_It") },
              ]}
            >
              Innovación y tecnología para tu hogar, descubre nuestras
              categorías y productos.
            </Text>
          </View>

          {/* Categorías */}
          <View style={styles.categoriesSection}>
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: fontFamilyOrDefault("Aller_BdIt") },
              ]}
            >
              Productos
            </Text>
            <View style={styles.grid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.nombre}
                  activeOpacity={0.85}
                  style={styles.card}
                  onPress={() => navigation.navigate(cat.nombre)}
                >
                  <Image source={cat.img} style={styles.cardImage} />
                  <Text
                    style={[
                      styles.cardTitle,
                      { fontFamily: fontFamilyOrDefault("Aller_BdIt") },
                    ]}
                  >
                    {cat.nombre}
                  </Text>
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
              <Text
                style={[
                  styles.contactText,
                  { fontFamily: fontFamilyOrDefault("Aller_Bd") },
                ]}
              >
                📞 Contáctanos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactButton,
                { marginLeft: 10, backgroundColor: "#12A14B" },
              ]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Sobre Nosotros")}
            >
              <Text
                style={[
                  styles.contactText,
                  { fontFamily: fontFamilyOrDefault("Aller_Bd") },
                ]}
              >
                ℹ️ Sobre Nosotros
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.noteWrap}>
            <Text
              style={[
                styles.noteText,
                { fontFamily: fontFamilyOrDefault("Aller_Rg") },
              ]}
            >
              ¿No encontraste lo que buscabas? Escríbenos y te ayudamos.
            </Text>
          </View>
          <Footer useSafeArea={false} />
        </ScrollView>
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => setWhatsappVisible(true)}
        >
          <Image
            source={require("../assets/whatsapp.jpg")}
            style={styles.whatsappIcon}
          />
        </TouchableOpacity>

        {/* Modal WhatsApp */}
        <Modal
          isVisible={whatsappVisible}
          backdropColor="black"
          backdropOpacity={0.35}
          onBackdropPress={() => setWhatsappVisible(false)}
          statusBarTranslucent={true}
          style={{ margin: 0 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
              <View style={styles.modalTitleBar}>
                <Text
                  style={[
                    styles.modalTitleText,
                    { fontFamily: fontFamilyOrDefault("Aller_Bd") },
                  ]}
                >
                  General Lux
                </Text>
                <TouchableOpacity
                  onPress={() => setWhatsappVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <Text
                    style={[
                      styles.modalCloseText,
                      { fontFamily: fontFamilyOrDefault("Aller_Rg") },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bubbleWrap}>
                <View style={styles.bubble}>
                  <Text
                    style={[
                      styles.bubbleText,
                      { fontFamily: fontFamilyOrDefault("Aller_Rg") },
                    ]}
                  >
                    En General Lux sabemos que la vida es algo más que tener la
                    última tecnología. Se trata de crear experiencias mediante
                    todos nuestros productos, los que podrás usar para
                    entretenerte, descansar o incluso hacerte más fácil la vida.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalWhatsappButton}
                onPress={openWhatsapp}
                activeOpacity={0.9}
              >
                <Image
                  source={require("../assets/whatsapp.jpg")}
                  style={styles.modalWhatsappIcon}
                />
                <Text
                  style={[
                    styles.modalWhatsappText,
                    { fontFamily: fontFamilyOrDefault("Aller_Bd") },
                  ]}
                >
                  Abrir chat WhatsApp
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  carouselContainer: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  carouselImageWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  carouselImage: { width: "100%", height: "100%", resizeMode: "contain" },

  welcomeContainer: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeTitle: { fontSize: 25, color: "#000000ff", marginBottom: 6 },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },

  categoriesSection: { paddingHorizontal: 16, paddingTop: 6 },
  sectionTitle: {
    fontSize: 24,
    color: "#000000ff",
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
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 120, resizeMode: "cover" },
  cardTitle: {
    fontSize: 15,
    color: "#222",
    textAlign: "center",
    paddingVertical: 8,
  },

  ctaWrap: {
    paddingHorizontal: 20,
    marginTop: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  contactButton: {
    width: "40%",
    backgroundColor: "#12A14B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  contactText: { color: "#fff", fontSize: 16 },

  noteWrap: { paddingHorizontal: 20, marginTop: 12, alignItems: "center" },
  noteText: { fontSize: 14, color: "#fff", textAlign: "center" },

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
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalWrapper: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 14,
  },
  modalTitleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  modalTitleText: { fontSize: 20, color: "#12A14B" },
  modalCloseBtn: { padding: 4 },
  modalCloseText: { fontSize: 18, color: "#333" },
  bubbleWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  bubble: { backgroundColor: "#f2f2f2", borderRadius: 12, padding: 12 },
  bubbleText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "center",
  },
  modalWhatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12A14B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalWhatsappIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    resizeMode: "contain",
  },
  modalWhatsappText: { color: "#fff", fontSize: 16 },
});
