import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductCard({ title }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    margin: 5,
    flex: 1,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#000000ff' },
});
