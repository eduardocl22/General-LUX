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

// Importa el header global
import Header from "../components/Header";

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
    nombre: "GLUX 4 SS 5-ES ‘SALVADOR’",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX 4 SS 5-ES SALVADOR.png"),
  },
  {
    nombre: "GLUX 5 SSTRI-ES ‘FARAON’",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX 5 SSTRI-ES FARAON.png"),
  },
  {
    nombre: "GLUX COCINA PARANA",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX COCINA PARANA.png"),
  },
  {
    nombre: "GLUX-850DF FLORENCE",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX-850DF FLORENCE.png"),
  },
  {
    nombre: "GLUX-855DF-G FRANIA",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX-855DF-G FRANIA.png"),
  },
  {
    nombre: "GLUX-«CONCORDIA»",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX-CONCORDIA.png"),
  },
  {
    nombre: "GLUX-T805DF «LYON-TURBO»",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX-T805DF LYON-TURBO.png"),
  },
  {
    nombre: "GLUX-T808DF-G «FRANCIS»",
    variante: "5 Hornallas",
    img: require("../assets/images/Cocina/5 Hornallas/GLUX-T808DF-G FRANCIS.png"),
  },
  {
    nombre: "GLUX – «BELEM»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX – BELEM.png"),
  },
  {
    nombre: "GLUX 4 S-VP «BRASILEIRA»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 4 S-VP BRASILEIRA.png"),
  },
  {
    nombre: "GLUX 4 SS-VPF-ES ‘PAULISTA’",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 4 SS-VPF-ES PAULISTA.png"),
  },
  {
    nombre: "GLUX 4 SSVP ‘PORTUGUESA’",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 4 SSVP PORTUGUESA.png"),
  },
  {
    nombre: "GLUX 5 S-ES ‘BAHIA’",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 5 S-ES BAHIA.png"),
  },
  {
    nombre: "GLUX 5 SG-ES «MANAUS»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 5 SG-ES MANAUS.png"),
  },
  {
    nombre: "GLUX 5 SS-ES ‘SANTANA’",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 5 SS-ES SANTANA.png"),
  },
  {
    nombre: "GLUX 5 SSG «FORMOSA»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 5 SSG FORMOSA.png"),
  },
  {
    nombre: "GLUX 5 SSG-ES «FORTALEZA»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX 5 SSG-ES FORTALEZA.png"),
  },
  {
    nombre: "GLUX-«RECIFE»",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX-RECIFE.png"),
  },
  {
    nombre: "GLUX-T801 DF BIBI",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX-T801 DF BIBI.jpg"),
  },
  {
    nombre: "GLUX-T802 DF GIGI",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX-T802 DF GIGI.jpg"),
  },
  {
    nombre: "GLUX-T803 DF LOTTI",
    variante: "6 Hornallas",
    img: require("../assets/images/Cocina/6 Hornallas/GLUX-T803 DF LOTTI.jpg"),
  },
  {
    nombre: "GLUX E2 ‘BETANIA’",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E2 BETANIA.png"),
  },
  {
    nombre: "GLUX E2 GB ARIANE",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E2 GB ARIANE.png"),
  },
  {
    nombre: "GLUX E2 ROSELYNE",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E2 ROSELYNE.png"),
  },
  {
    nombre: "GLUX E2 SS ASTRID",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E2 SS ASTRID.png"),
  },
  {
    nombre: "GLUX E64 GB-B",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E64 GB-B.jpg"),
  },
  {
    nombre: "GLUX E95ss",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E95ss.jpg"),
  },
  {
    nombre: "GLUX E96ss",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX E96ss.jpg"),
  },
  {
    nombre: "GLUX -‘GAUCHINHA’",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX -GAUCHINHA.png"),
  },
  {
    nombre: "GLUX-91 E5-G",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-91 E5-G.jpg"),
  },
  {
    nombre: "GLUX-92 E5-G",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-92 E5-G.jpg"),
  },
  {
    nombre: "GLUX-93 E5-SS",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-93 E5-SS.jpg"),
  },
  {
    nombre: "GLUX-94 E6-G",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-94 E6-G.jpg"),
  },
  {
    nombre: "GLUX-95 E6-G",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-95 E6-G.png"),
  },
  {
    nombre: "GLUX-E2 ECO «AMAZONA»",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-E2 ECO AMAZONA.png"),
  },
  {
    nombre: "GLUX-E95 GB-B",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-E95 GB-B.jpg"),
  },
  {
    nombre: "GLUX-E95 GB-TRI",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-E95 GB-TRI.jpg"),
  },
  {
    nombre: "GLUX-E96 GB-B",
    variante: "Encimeras",
    img: require("../assets/images/Cocina/Encimeras/GLUX-E96 GB-B.jpg"),
  },
  {
    nombre: "GLUX-50 SSH-ES «KATRINA»",
    variante: "Hornos de empotrar",
    img: require("../assets/images/Cocina/Hornos de Empotrar/GLUX-50 SSH-ES KATRINA.png"),
  },
  {
    nombre: "GLUX-90 SSH-ES «ISABELA»",
    variante: "Hornos de empotrar",
    img: require("../assets/images/Cocina/Hornos de Empotrar/GLUX-90 SSH-ES ISABELA.png"),
  },
  {
    nombre: "GLUX-H25DSS",
    variante: "Hornos Eléctricos",
    img: require("../assets/images/Cocina/Hornos Eléctricos/GLUX-H25DSS.png"),
  },
  {
    nombre: "GLUX-H35DSS",
    variante: "Hornos Eléctricos",
    img: require("../assets/images/Cocina/Hornos Eléctricos/GLUX-H35DSS.png"),
  },{
    nombre: "GLUX-H45DSS",
    variante: "Hornos Eléctricos",
    img: require("../assets/images/Cocina/Hornos Eléctricos/GLUX-H45DSS.png"),
  },
  {
    nombre: "GLUX-90GB-E",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-90GB-E.png"),
  },
  {
    nombre: "GLUX-CV90-SST",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-CV90-SST.png"),
  },
  {
    nombre: "GLUX-EP 60SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EP 60SS.jpg"),
  },
  {
    nombre: "GLUX-EP 80SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EP 80SS.jpg"),
  },
  {
    nombre: "GLUX-EP 90SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EP 90SS.jpg"),
  },
  {
    nombre: "GLUX-ET 90SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-ET 90SS.jpg"),
  },
  {
    nombre: "GLUX-ET 91SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-ET 91SS.jpg"),
  },
  {
    nombre: "GLUX-ET 92SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-ET 92SS.jpg"),
  },
  {
    nombre: "GLUX-EX60 DI",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EX60 DI.png"),
  },
  {
    nombre: "GLUX-EX80DI",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EX80DI.jpg"),
  },
  {
    nombre: "GLUX-EX90 DI",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-EX90 DI.jpg"),
  },
  {
    nombre: "GLUX-IS 90SS",
    variante: "Extractores de grasa",
    img: require("../assets/images/Cocina/Extractores de Grasa/GLUX-IS 90SS.jpg"),
  },
  {
    nombre: "GLUX 01 BA VD",
    variante: "Complementos",
    img: require("../assets/images/Cocina/Complementos/GLUX 01 BA VD.png"),
  },
  {
    nombre: "GLUX 02 BA AZ",
    variante: "Complementos",
    img: require("../assets/images/Cocina/Complementos/GLUX 02 BA AZ.png"),
  },
  {
    nombre: "GLUX 03 BA RJ",
    variante: "Complementos",
    img: require("../assets/images/Cocina/Complementos/GLUX 03 BA RJ.png"),
  },
  {
    nombre: "GLUX PGA",
    variante: "Complementos",
    img: require("../assets/images/Cocina/Complementos/GLUX PGA.jpg"),
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
      {/* StatusBar */}
      <StatusBar style="light" backgroundColor="#045700" />

      {/* HEADER global */}
      <Header />

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

  title: {
    fontSize: 35,
    fontWeight: "bold",
    margin: 16,
    color: "#333",
    textAlign: "center",
  },

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