import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ImageBackground,
  StatusBar,
  LogBox
} from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'target',
  'handshake'
]);

export default function AboutUsScreen({ navigation }) {
  // 🔠 Cargar fuentes Aller
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

  // Datos de valores con iconos válidos
  const valores = [
    { id: 1, icon: "shield-checkmark", title: "Honestidad y buena fe", description: "Actuamos con transparencia en todas nuestras operaciones" },
    { id: 2, icon: "heart", title: "Amabilidad y respeto", description: "Trato cordial hacia clientes, proveedores y colaboradores" },
    { id: 3, icon: "people", title: "Gratitud y lealtad", description: "Valoramos la confianza de nuestros clientes" },
    { id: 4, icon: "rocket", title: "Responsabilidad y esfuerzo", description: "Compromiso con la excelencia en cada producto" },
    { id: 5, icon: "star", title: "Entusiasmo y compromiso", description: "Pasión por innovar y superar expectativas" },
  ];

  // Estadísticas de la empresa
  const estadisticas = [
    { id: 1, valor: "+40%", label: "Crecimiento objetivo en 3 años", icon: "trending-up" },
    { id: 2, valor: "100%", label: "Productos garantizados", icon: "shield-checkmark" },
    { id: 3, valor: "24/7", label: "Soporte técnico", icon: "headset" },
    { id: 4, valor: "Eco", label: "Productos ecoeficientes", icon: "leaf" },
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
                <Ionicons name="business" size={40} color="#FFF" />
              </View>
              <Text style={[styles.heroTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                GENERAL LUX
              </Text>
              <Text style={[styles.heroSubtitle, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Innovación y Tecnología para tu Hogar
              </Text>
            </View>
          </View>

          {/* Tarjeta de Presentación */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={28} color="#12A14B" />
              <Text style={[styles.mainTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                QUIÉNES SOMOS
              </Text>
            </View>
            <Text style={[styles.mainText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
              Somos una empresa con trayectoria e innovación tecnológica, 
              ecoeficiente en todos nuestros productos para satisfacer a toda la 
              familia. Nuestra tecnología y eficiencia demuestran la indiscutible 
              calidad internacional con la que son realizados.
            </Text>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              📊 Nuestros Logros
            </Text>
            <View style={styles.statsGrid}>
              {estadisticas.map((stat) => (
                <View key={stat.id} style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Ionicons name={stat.icon} size={24} color="#12A14B" />
                  </View>
                  <Text style={[styles.statValue, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    {stat.valor}
                  </Text>
                  <Text style={[styles.statLabel, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Propósito, Visión y Misión */}
          <View style={styles.missionSection}>
            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Ionicons name="compass" size={24} color="#12A14B" />
                <Text style={[styles.missionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                  PROPÓSITO
                </Text>
              </View>
              <Text style={[styles.missionText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Ayudar a la sociedad boliviana a tener momentos de satisfacción 
                en sus hogares y trabajos al proveer productos duraderos y de 
                alta calidad en todos los departamentos del país.
              </Text>
            </View>

            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Ionicons name="eye" size={24} color="#12A14B" />
                <Text style={[styles.missionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                  VISIÓN
                </Text>
              </View>
              <Text style={[styles.missionText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Ser una empresa de clase mundial que produce y comercializa 
                productos de alta tecnología y calidad, líder en el mercado 
                nacional. Proveemos productos de línea blanca de alta categoría 
                amigables con el medio ambiente, con personal altamente capacitado 
                y comprometido.
              </Text>
            </View>

            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Ionicons name="flag" size={24} color="#12A14B" />
                <Text style={[styles.missionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                  MISIÓN
                </Text>
              </View>
              <Text style={[styles.missionText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                Aprovechar nuestra experiencia nacional e internacional para 
                liderar el mercado boliviano con una participación mayor al 40% 
                en los próximos 3 años, apoyados en la capacidad y compromiso 
                de nuestro recurso humano.
              </Text>
            </View>
          </View>

          {/* Valores Corporativos */}
          <View style={styles.valuesSection}>
            <Text style={[styles.sectionTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
              💎 NUESTROS VALORES
            </Text>
            <View style={styles.valuesGrid}>
              {valores.map((valor) => (
                <View key={valor.id} style={styles.valueCard}>
                  <View style={styles.valueIcon}>
                    <Ionicons name={valor.icon} size={28} color="#FFF" />
                  </View>
                  <Text style={[styles.valueTitle, { fontFamily: fontFamilyOrDefault("Aller_Bd") }]}>
                    {valor.title}
                  </Text>
                  <Text style={[styles.valueDescription, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    {valor.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Política de Seguridad */}
          <View style={styles.securitySection}>
            <View style={styles.securityCard}>
              <View style={styles.securityHeader}>
                <Ionicons name="shield-checkmark" size={28} color="#12A14B" />
                <Text style={[styles.securityTitle, { fontFamily: fontFamilyOrDefault("Aller_BdIt") }]}>
                  SEGURIDAD LOGÍSTICA
                </Text>
              </View>
              <Text style={[styles.securityText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                GENERAL LUX ha implementado un sistema de gestión de seguridad 
                de nuestra cadena logística internacional que cumple con todas 
                las leyes y normativas aduaneras vigentes.
              </Text>
              <View style={styles.securityPoints}>
                <View style={styles.securityPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                  <Text style={[styles.securityPointText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Detección y prevención de actividades ilícitas
                  </Text>
                </View>
                <View style={styles.securityPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                  <Text style={[styles.securityPointText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Cumplimiento normativo completo
                  </Text>
                </View>
                <View style={styles.securityPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                  <Text style={[styles.securityPointText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Mejora continua en procesos
                  </Text>
                </View>
                <View style={styles.securityPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#12A14B" />
                  <Text style={[styles.securityPointText, { fontFamily: fontFamilyOrDefault("Aller_Rg") }]}>
                    Recursos garantizados para seguridad
                  </Text>
                </View>
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
  mainCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 22,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(18, 161, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    color: '#12A14B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  missionSection: {
    marginBottom: 25,
  },
  missionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 18,
    color: '#2C3E50',
    marginLeft: 10,
    flex: 1,
  },
  missionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  valuesSection: {
    marginBottom: 25,
  },
  valuesGrid: {
    paddingHorizontal: 20,
  },
  valueCard: {
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
  },
  valueIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#12A14B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  valueTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
    flex: 1,
  },
  valueDescription: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  securitySection: {
    marginBottom: 0, // Eliminado el margen inferior para que el footer quede pegado
  },
  securityCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  securityTitle: {
    fontSize: 20,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  securityText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  securityPoints: {
    backgroundColor: 'rgba(18, 161, 75, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  securityPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  securityPointText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  footerContainer: {
    marginTop: 0, // Sin margen superior para que quede pegado
    backgroundColor: 'transparent',
  },
});