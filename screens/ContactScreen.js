import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  LogBox
} from "react-native";
import { useFonts } from "expo-font";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

export default function ContactScreen({ navigation }) {
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

  const location = {
    latitude: -17.7977663,
    longitude: -63.150086,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef(null);

  const openMaps = () => {
    const lat = location.latitude;
    const lng = location.longitude;
    const label = "General Lux, Santa Cruz";
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
            label
          )}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=ChIJY5K-Px6xjZsRRE8t8mueSbk`;
    Linking.openURL(url);
  };

  const openPhone = () => {
    Linking.openURL('tel:+59172112333');
  };

  const openEmail = () => {
    Linking.openURL('mailto:info@generallux.com.bo');
  };

  const openWhatsapp = () => {
    const url = "https://api.whatsapp.com/send/?phone=59172112333&text=Hola%2C+Acabamos+de+visitar+la+aplicación+General+Lux,+me+pueden+brindar+información+acerca+de+General+LUX&type=phone_number&app_absent=0";
    Linking.openURL(url);
  };

  // Función para centrar el mapa en la ubicación
  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  const contactInfo = [
    {
      id: 1,
      icon: "call",
      title: "Teléfono",
      value: "+(591) 72112333",
      action: openPhone,
      color: "#4A90E2"
    },
    {
      id: 2,
      icon: "mail",
      title: "Correo Electrónico",
      value: "info@generallux.com.bo",
      action: openEmail,
      color: "#E74C3C"
    },
    {
      id: 3,
      icon: "logo-whatsapp",
      title: "WhatsApp",
      value: "+(591) 72112333",
      action: openWhatsapp,
      color: "#25D366"
    },
    {
      id: 4,
      icon: "location",
      title: "Dirección",
      value: "Cuarto Anillo & Av 3 Pasos al Frente, Santa Cruz",
      action: openMaps,
      color: "#F39C12"
    }
  ];

  const businessHours = [
    { day: "Lunes - Viernes", hours: "8:00 AM - 8:00 PM" },
    { day: "Sábados", hours: "8:00 AM - 6:00 PM" },
    { day: "Domingos", hours: "Cerrado" }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#12A14B" />
      
      <ImageBackground
        source={require("../assets/fondo.jpeg")}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ opacity: 0.15 }}
      >
        <Header navigation={navigation} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Ionicons name="chatbubbles" size={40} color="#FFF" />
              </View>
              <Text style={[styles.heroTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                CONTÁCTANOS
              </Text>
              <Text style={[styles.heroSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Estamos aquí para ayudarte. Contáctanos por cualquier consulta
              </Text>
            </View>
          </View>

          {/* Información de Contacto */}
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              📞 Información de Contacto
            </Text>
            
            <View style={styles.contactGrid}>
              {contactInfo.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.contactCard, { borderLeftColor: item.color }]}
                  onPress={item.action}
                  activeOpacity={0.8}
                >
                  <View style={[styles.contactIcon, { backgroundColor: `${item.color}20` }]}>
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.contactValue, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      {item.value}
                    </Text>
                    <Text style={[styles.contactAction, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                      Tocar para {item.title.toLowerCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Horarios de Atención */}
          <View style={styles.hoursSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              🕐 Horarios de Atención
            </Text>
            
            <View style={styles.hoursCard}>
              {businessHours.map((schedule, index) => (
                <View key={index} style={[
                  styles.hourItem,
                  index !== businessHours.length - 1 && styles.hourItemBorder
                ]}>
                  <Text style={[styles.hourDay, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    {schedule.day}
                  </Text>
                  <Text style={[styles.hourTime, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    {schedule.hours}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mapa */}
          <View style={styles.mapSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              📍 Nuestra Ubicación
            </Text>
            
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={location}
                scrollEnabled={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
                showsUserLocation={false}
              >
                <Marker coordinate={location}>
                  <View style={styles.marker}>
                    <Ionicons name="location" size={24} color="#E74C3C" />
                  </View>
                </Marker>
              </MapView>
              
              {/* Contenedor de botones del mapa */}
              <View style={styles.mapButtonsContainer}>
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={openMaps}
                  activeOpacity={0.8}
                >
                  <Ionicons name="navigate" size={20} color="#FFF" />
                  <Text style={[styles.mapButtonText, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    Abrir en Maps
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.centerButton}
                  onPress={centerMap}
                  activeOpacity={0.8}
                >
                  <Ionicons name="locate" size={20} color="#12A14B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer DENTRO del ScrollView - pegado al final */}
          <View style={styles.footerContainer}>
            <Footer />
          </View>
        </ScrollView>
      </ImageBackground>
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
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: 'rgba(18, 161, 75, 0.9)',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  contactSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  contactGrid: {
    paddingHorizontal: 20,
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  contactAction: {
    fontSize: 12,
    color: '#12A14B',
  },
  hoursSection: {
    marginBottom: 25,
  },
  hoursCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  hourItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  hourDay: {
    fontSize: 15,
    color: '#2C3E50',
  },
  hourTime: {
    fontSize: 15,
    color: '#12A14B',
  },
  mapSection: {
    marginBottom: 0, // Sin margen inferior para que el footer quede pegado
  },
  mapContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: '#12A14B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#12A14B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerContainer: {
    marginTop: 0, // Sin margen superior para que quede pegado
    backgroundColor: 'transparent',
  },
});