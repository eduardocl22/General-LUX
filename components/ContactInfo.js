import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContactInfo({ label, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000000ff' },
  value: { fontSize: 14, color: '#444', marginTop: 5 },
});
