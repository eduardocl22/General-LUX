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
  Platform,
  StatusBar,
  LogBox
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useFonts } from "expo-font";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "react-native-modal";

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const { width, height } = Dimensions.get("window");
const CAROUSEL_HEIGHT = height * 0.28;

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
    fontsLoaded ? fontName : "System";

  const categorias = [
    {
      nombre: "Climatización",
      img: require("../assets/images/climatización.jpg"),
      color: "#4A90E2",
    },
    { 
      nombre: "Cocinas", 
      img: require("../assets/images/cocinas.jpg"),
      color: "#E74C3C",
    },
    {
      nombre: "Dispensadores",
      img: require("../assets/images/dispensadores.png"),
      color: "#3498DB",
    },
    { 
      nombre: "Lavadoras", 
      img: require("../assets/images/lavadoras.png"),
      color: "#9B59B6",
    },
    { 
      nombre: "Licuadoras", 
      img: require("../assets/images/licuadoras.jpg"),
      color: "#1ABC9C",
    },
    { 
      nombre: "Microondas", 
      img: require("../assets/images/microondas.png"),
      color: "#F39C12",
    },
    { 
      nombre: "Planchas", 
      img: require("../assets/images/planchas.jpg"),
      color: "#95A5A6",
    },
    {
      nombre: "Refrigeración",
      img: require("../assets/images/refrigeración.png"),
      color: "#2ECC71",
    },
    { 
      nombre: "Televisores", 
      img: require("../assets/images/televisores.jpg"),
      color: "#E67E22",
    },
  ];

  const carouselImages = [
    { 
      source: require("../assets/1.png"),
      title: "Tecnología de Vanguardia",
      subtitle: "Los mejores productos para tu hogar"
    },
    { 
      source: require("../assets/2.jpg"),
      title: "Calidad Garantizada",
      subtitle: "Productos con garantía y soporte"
    },
    { 
      source: require("../assets/3.png"),
      title: "Innovación Constante",
      subtitle: "Siempre a la vanguardia tecnológica"
    },
  ];

  // Productos destacados
  const productosDestacados = [
    { id: 1, nombre: "Smart TV 4K", precio: "Bs. 899", categoria: "Televisores", img: require("../assets/images/televisores.jpg") },
    { id: 2, nombre: "Refrigerador Inverter", precio: "Bs. 299", categoria: "Refrigeración", img: require("../assets/images/refrigeración.png") },
    { id: 3, nombre: "Lavadora Automática", precio: "Bs. 699", categoria: "Lavadoras", img: require("../assets/images/lavadoras.png") },
    { id: 4, nombre: "Aire Acondicionado", precio: "Bs. 1,199", categoria: "Climatización", img: require("../assets/images/climatización.jpg") },
  ];

  const openWhatsapp = () => {
    const url =
      "https://api.whatsapp.com/send/?phone=59172112333&text=Hola%2C+Acabamos+de+visitar+la+aplicación+General+Lux,+me+pueden+brindar+información+acerca+de+General+LUX&type=phone_number&app_absent=0";
    Linking.openURL(url);
  };

  const handleCategoryPress = (category) => {
    setTimeout(() => {
      navigation.navigate(category.nombre);
    }, 300);
  };

  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.carouselItem}>
      <Image source={item.source} style={styles.carouselImage} />
      <View style={styles.carouselOverlay}>
        <Text style={[styles.carouselTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
          {item.title}
        </Text>
        <Text style={[styles.carouselSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
      
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header navigation={navigation} />

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Carrusel Mejorado */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              height={CAROUSEL_HEIGHT}
              autoPlay
              autoPlayInterval={3500}
              scrollAnimationDuration={800}
              data={carouselImages}
              renderItem={renderCarouselItem}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
            />
          </View>

          {/* Tarjeta de Bienvenida */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <Text style={[styles.welcomeTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                Bienvenido a General Lux
              </Text>
            </View>
            <Text style={[styles.welcomeText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              Innovación y tecnología para tu hogar. Descubre nuestras categorías 
              y encuentra los mejores productos con garantía y soporte especializado.
            </Text>
          </View>

          {/* Productos Destacados */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                ⭐ Productos Destacados
              </Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.featuredScroll}
            >
              {productosDestacados.map((producto) => (
                <TouchableOpacity 
                  key={producto.id}
                  style={styles.featuredCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate(producto.categoria)}
                >
                  <Image source={producto.img} style={styles.featuredImage} />
                  <View style={styles.featuredInfo}>
                    <Text style={[styles.featuredName, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      {producto.nombre}
                    </Text>
                    <Text style={[styles.featuredPrice, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                      {producto.precio}
                    </Text>
                    <Text style={[styles.featuredCategory, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      {producto.categoria}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Categorías Mejoradas (sin iconos) */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                🛒 Nuestras Categorías
              </Text>
            </View>
            <View style={styles.categoriesGrid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.nombre}
                  activeOpacity={0.85}
                  style={[
                    styles.categoryCard,
                    { borderLeftColor: cat.color }
                  ]}
                  onPress={() => handleCategoryPress(cat)}
                >
                  <Image source={cat.img} style={styles.categoryImage} />
                  <View style={styles.categoryOverlay}>
                    <Text style={[styles.categoryTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      {cat.nombre}
                    </Text>
                    <View style={styles.categoryArrow}>
                      <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CTA Section Mejorada */}
          <View style={styles.ctaSection}>
            <Text style={[styles.ctaTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              ¿Necesitas asesoramiento especializado?
            </Text>
            <Text style={[styles.ctaText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              Nuestros expertos están listos para ayudarte a elegir el mejor producto para tu hogar.
            </Text>
            
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.ctaButtonPrimary}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Contáctanos")}
              >
                <Ionicons name="call" size={20} color="#FFF" />
                <Text style={[styles.ctaButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Contactar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ctaButtonSecondary}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Sobre Nosotros")}
              >
                <Ionicons name="information-circle" size={20} color="#12A14B" />
                <Text style={[styles.ctaButtonTextSecondary, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                  Más Info
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer DENTRO del ScrollView - al final */}
          <View style={styles.footerContainer}>
            <Footer />
          </View>
        </ScrollView>

        {/* Botón Flotante de WhatsApp */}
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={() => setWhatsappVisible(true)}
          activeOpacity={0.9}
        >
          <FontAwesome5 name="whatsapp" size={26} color="#FFF" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Modal WhatsApp Mejorado */}
      <Modal
        isVisible={whatsappVisible}
        backdropColor="black"
        backdropOpacity={0.5}
        onBackdropPress={() => setWhatsappVisible(false)}
        onSwipeComplete={() => setWhatsappVisible(false)}
        swipeDirection={['down']}
        statusBarTranslucent={true}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContainer}>
          {/* Handle */}
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <View style={styles.modalLogo}>
              <Ionicons name="logo-whatsapp" size={32} color="#25D366" />
            </View>
            <View style={styles.modalHeaderText}>
              <Text style={[styles.modalTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                Atención Personalizada
              </Text>
              <Text style={[styles.modalSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                General Lux WhatsApp
              </Text>
            </View>
          </View>

          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.messageBubble}>
              <Text style={[styles.messageText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                ¡Hola! 👋 Soy tu asesor de General Lux.
                {"\n\n"}
                En General Lux nos dedicamos a hacer tu vida más fácil con tecnología 
                innovadora y productos de calidad superior.
                {"\n\n"}
                ¿En qué puedo ayudarte hoy?
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.modalWhatsappButton}
            onPress={openWhatsapp}
            activeOpacity={0.9}
          >
            <FontAwesome5 name="whatsapp" size={24} color="#FFF" />
            <Text style={[styles.modalWhatsappText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
              Iniciar Chat en WhatsApp
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Rápido</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setWhatsappVisible(false)}
          >
            <Text style={[styles.modalCloseText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              Quizás más tarde
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    marginBottom: 10,
  },
  carouselItem: {
    flex: 1,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    paddingBottom: 30,
  },
  carouselTitle: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 5,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  welcomeCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeIcon: {
    backgroundColor: '#12A14B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  welcomeTitle: {
    fontSize: 22,
    color: '#2C3E50',
    flex: 1,
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  featuredSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#2C3E50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: '#12A14B',
  },
  featuredScroll: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 18,
    color: '#12A14B',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: 12,
    color: '#666',
  },
  categoriesSection: {
    marginBottom: 25,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
  },
  categoryImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  categoryOverlay: {
    backgroundColor: 'rgba(18, 161, 75, 0.9)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  categoryArrow: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
  },
  ctaSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 20,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  ctaButtonPrimary: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginRight: 10,
    flex: 1,
    justifyContent: 'center',
  },
  ctaButtonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  ctaButtonTextSecondary: {
    color: '#12A14B',
    fontSize: 16,
    marginLeft: 8,
  },
  // Footer dentro del ScrollView
  footerContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  // Botón WhatsApp fijo
  whatsappButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalLogo: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContent: {
    maxHeight: height * 0.45,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageBubble: {
    backgroundColor: '#F0F9F4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
  },
  modalWhatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    position: 'relative',
  },
  modalWhatsappText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    color: '#25D366',
  },
  modalCloseButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  modalCloseText: {
    fontSize: 14,
    color: '#666',
  },
});