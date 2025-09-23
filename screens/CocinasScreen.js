import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Collapsible from "react-native-collapsible";
import * as Animatable from "react-native-animatable";

export default function CocinasScreen() {
  const [active, setActive] = useState(null);

  const categorias = [
    {
      title: "Cocinas",
      image: require("../assets/images/cocinas.jpg"),
      variants: [
        "4 Hornallas",
        "5 Hornallas",
        "6 Hornallas",
        "Encimeras",
        "Hornos de empotrar",
        "Hornos Eléctricos",
        "Extractores de grasa",
        "Complementos",
      ],
    },
  ];

  const toggleExpand = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>GENERAL LUX</Text>
      </View>

      <Text style={styles.title}>Cocinas</Text>

      {categorias.map((cat, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          duration={600}
          delay={index * 200}
          style={styles.card}
        >
          <TouchableOpacity
            onPress={() => toggleExpand(index)}
            style={styles.cardHeader}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderContent}>
              <Image source={cat.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{cat.title}</Text>
            </View>
            <Text style={styles.icon}>{active === index ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          <Collapsible collapsed={active !== index}>
            <Animatable.View
              animation="fadeInDown"
              duration={500}
              style={styles.content}
            >
              {cat.variants.map((variant, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.variantItem}
                  activeOpacity={0.7}
                  onPress={() => console.log("Seleccionado:", variant)}
                >
                  <Text style={styles.variantText}>• {variant}</Text>
                </TouchableOpacity>
              ))}
            </Animatable.View>
          </Collapsible>
        </Animatable.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006400",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
  },
  logo: { width: 40, height: 40, resizeMode: "contain", marginRight: 10 },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  // TITULO
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
    marginVertical: 20,
  },

  // TARJETAS
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e6ffe6",
  },
  cardHeaderContent: { flexDirection: "row", alignItems: "center" },
  cardImage: { width: 40, height: 40, resizeMode: "contain", marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#006400" },
  icon: { fontSize: 18, color: "#006400" },

  // VARIANTES
  content: { padding: 10, backgroundColor: "#f0f0f0" },
  variantItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 6,
  },
  variantText: { fontSize: 16, color: "#333" },
});
