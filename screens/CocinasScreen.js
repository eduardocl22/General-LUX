import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const subproductos = [
  "4 Hornallas",
  "5 Hornallas",
  "6 Hornallas",
  "Encimeras",
  "Hornos de empotrar",
  "Hornos Eléctricos",
  "Extractores de grasa",
  "Complementos",
];

const productos = [
  {
    nombre: "GLUX -3SA ‘MINEIRA’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX -3SA MINEIRA.png"),
  },
  {
    nombre: "GLUX – T50 BS «LYS»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX – T50 BS LYS.png"),
  },
  {
    nombre: "GLUX – T50 SS «VENISE»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX – T50 SS VENISE.png"),
  },
  {
    nombre: "GLUX 1 S «GAROTA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 1 S GAROTA.png"),
  },
  {
    nombre: "GLUX 1 SB-ES ‘MARACANA’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 1 SB-ES MARACANA.png"),
  },
  {
    nombre: "GLUX 1 SSB-ES ‘CARNAVAL’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 1 SSB-ES CARNAVAL.png"),
  },
  {
    nombre: "GLUX 1 STV SAMBA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 1 STV SAMBA.png"),
  },
  {
    nombre: "GLUX 1P-‘PEQUI’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 1P-PEQUI.png"),
  },
  {
    nombre: "GLUX 2 SA-ES ‘PANTANAL’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 2 SA-ES PANTANAL.png"),
  },
  {
    nombre: "GLUX 2 SG-ES ‘JAGUAR’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 2 SG-ES JAGUAR.png"),
  },
  {
    nombre: "GLUX 2 SSA-ES ‘AMAZONAS’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 2 SSA-ES AMAZONAS.png"),
  },
  {
    nombre: "GLUX 2SSG-ES «CATARINA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 2SSG-ES CATARINA.png"),
  },
  {
    nombre: "GLUX 3S-V-ES ‘CARIBE’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 3S-V-ES CARIBE.png"),
  },
  {
    nombre: "GLUX 3SA-V-ES’CARINE’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 3SA-V-ESCARINE.png"),
  },
  {
    nombre: "GLUX 3SL-ES ‘GURI’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 3SL-ES GURI.png"),
  },
  {
    nombre: "GLUX 58SS-STGB GRETA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX 58SS-STGB GRETA.png"),
  },
  {
    nombre: "GLUX G50SS-GB CASSANDRA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G50SS ST-GB CASSANDRA.png"),
  },
  {
    nombre: "GLUX G51SS GB JULIETTE ST",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G51SS GB JULIETTE ST.png"),
  },
  {
    nombre: "GLUX G52 SS CELINE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G52 SS CELINE.jpg"),
  },
  {
    nombre: "GLUX G53SS AIZA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G53SS AIZA.png"),
  },
  {
    nombre: "GLUX G53SS-FF AIZA PLUS",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G53SS-FF AIZA PLUS.png"),
  },
  {
    nombre: "GLUX G54 IRINA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G54 IRINA.png"),
  },
  {
    nombre: "GLUX G54-FF IRINA PLUS",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G54-FF IRINA PLUS.png"),
  },
  {
    nombre: "GLUX G55SS FF-LUCIE PLUS",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G55SS FF-LUCIE PLUS.jpg"),
  },
  {
    nombre: "GLUX G55SS-LUCIE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G55SS-LUCIE.jpg"),
  },
  {
    nombre: "GLUX G57ss-FF ELISSE PLUS",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G57ss-FF ELISSE PLUS.png"),
  },
  {
    nombre: "GLUX G58 GB MISHELL",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G58 GB MISHELL.png"),
  },
  {
    nombre: "GLUX G60SS FF-CORALIE PLUS",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G60SS FF-CORALIE PLUS.jpg"),
  },
  {
    nombre: "GLUX G60SS-CORALIE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G60SS-CORALIE.png"),
  },
  {
    nombre: "GLUX G61SS-GB ZURIA ST",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX G61SS-GB ZURIA ST.png"),
  },
  {
    nombre: "GLUX SL-ES ‘CARIOCA’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX SL-ES CARIOCA.png"),
  },
  {
    nombre: "GLUX T49NS-SOPHIE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX T49NS-SOPHIE.png"),
  },
  {
    nombre: "GLUX T57SS «ALIZEE»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX T57SS ALIZEE.png"),
  },
  {
    nombre: "GLUX T58 DFA «SCARLETT»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX T58 DFA SCARLETT.png"),
  },
  {
    nombre: "GLUX-1 «RIO»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-1 RIO.png"),
  },
  {
    nombre: "GLUX-2 SSG «CURITIBA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-2 SSG CURITIBA.png"),
  },
  {
    nombre: "GLUX-3SSA-ES ‘LINDEZA’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-3SSA-ES LINDEZA.png"),
  },
  {
    nombre: "GLUX-E4-CHARLOTT",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-E4-CHARLOTT.jpg"),
  },
  {
    nombre: "GLUX-E4-GINEBRA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-E4-GINEBRA.png"),
  },
  {
    nombre: "GLUX-G51SS GB JULIETTE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-G51SS GB JULIETTE.jpg"),
  },
  {
    nombre: "GLUX-G57ss ELISSE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-G57ss ELISSE.png"),
  },
  {
    nombre: "GLUX-T 605 DF «GIANNA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T 605 DF GIANNA.png"),
  },
  {
    nombre: "GLUX-T35 «MIMI»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T35 MIMI.png"),
  },
  {
    nombre: "GLUX-T51SS «VITTORIA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T51SS VITTORIA.png"),
  },
  {
    nombre: "GLUX-T51SS-FF «VITTORIA PLUS»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T51SS-FF VITTORIA PLUS.png"),
  },
  {
    nombre: "GLUX-T510 SS «BELLA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T510 SS BELLA.png"),
  },
  {
    nombre: "GLUX-T510SS-FF «BELLA PLUS»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T510SS-FF BELLA PLUS.png"),
  },
  {
    nombre: "GLUX-T520SS-G BETTINA",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T520SS-G BETTINA.png"),
  },
  {
    nombre: "GLUX-T52DF «ZOE»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T52DF ZOE.png"),
  },
  {
    nombre: "GLUX-T52SS-FF «ZOE PLUS»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T52SS-FF ZOE PLUS.png"),
  },
  {
    nombre: "GLUX-T54SS-G CYRIELLE",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T54SS-G CYRIELLE.png"),
  },
  {
    nombre: "GLUX-T55SS-G CRISTEL",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T55SS-G CRISTEL.png"),
  },
  {
    nombre: "GLUX-T56DF «SHANTAL»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T56DF SHANTAL.jpg"),
  },
  {
    nombre: "GLUX-T58 DFA «BRIGITTE»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T58 DFA BRIGITTE.png"),
  },
  {
    nombre: "GLUX-T602 DF «ADELA»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T602 DF ADELA.png"),
  },
  {
    nombre: "GLUX-T602 FF-DF «ADELA PLUS»",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T602 FF-DF ADELA PLUS.jpg"),
  },
  {
    nombre: "GLUX-T630 DF-G ‘VERSAILLES’",
    variante: "4 Hornallas",
    img: require("../assets/images/Cocina/4 Hornallas/GLUX-T630 DF-G VERSAILLES.png"),
  },
  {
    nombre: "Cocina 5 Hornallas Modelo A",
    variante: "5 Hornallas",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Cocina 5 Hornallas Modelo B",
    variante: "5 Hornallas",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Cocina 6 Hornallas Modelo A",
    variante: "6 Hornallas",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Encimera Modelo A",
    variante: "Encimeras",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Horno de empotrar Modelo A",
    variante: "Hornos de empotrar",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Horno eléctrico Modelo A",
    variante: "Hornos Eléctricos",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Extractor de grasa Modelo A",
    variante: "Extractores de grasa",
    img: require("../assets/images/cocinas.jpg"),
  },
  {
    nombre: "Complemento Modelo A",
    variante: "Complementos",
    img: require("../assets/images/cocinas.jpg"),
  },
];

export default function CocinasScreen() {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const filteredProducts = selectedVariant
    ? productos.filter((item) => item.variante === selectedVariant)
    : productos;

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.img} style={styles.productImage} />
      <Text style={styles.productText} numberOfLines={2} ellipsizeMode="tail">
        {item.nombre}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de estado */}
      <StatusBar style="light" backgroundColor="#000000ff" />

      {/* HEADER igual al de HomeScreen */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>GENERAL LUX</Text>
      </View>

      <Text style={styles.title}>Cocinas</Text>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipContainer}
      >
        <TouchableOpacity
          style={[styles.chip, selectedVariant === null && styles.chipSelected]}
          onPress={() => setSelectedVariant(null)}
        >
          <Text
            style={[
              styles.chipText,
              selectedVariant === null && styles.chipTextSelected,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        {subproductos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              selectedVariant === item && styles.chipSelected,
            ]}
            onPress={() => setSelectedVariant(item)}
          >
            <Text
              style={[
                styles.chipText,
                selectedVariant === item && styles.chipTextSelected,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

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
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  title: { fontSize: 22, fontWeight: "bold", margin: 16, color: "#333" },

  chipContainer: { marginBottom: 16, paddingHorizontal: 10 },
  chip: {
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: "#045700",
    borderColor: "#045700",
  },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },

  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    maxHeight: 250,
  },
  productImage: { width: 100, height: 150, marginBottom: 10 },
  productText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
