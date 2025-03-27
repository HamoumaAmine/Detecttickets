import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CarteDeFidelite() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Cartes de fidélité</Text>
      </View>

      {/* Ajouter une carte */}
      <Text style={styles.sectionTitle}>Ajouter une carte</Text>
      <View style={styles.addCardBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.addText}>
            Scannez et enregistrez une nouvelle{'\n'}carte de fidélité
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Scanner une carte</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/add_card_illustration.png')} // Remplace par ton image
          style={styles.addImage}
        />
      </View>

      {/* Mes cartes enregistrées */}
      <Text style={styles.sectionTitle}>Mes cartes enregistrées</Text>
      <View style={styles.cardBox}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Cartes loisirs</Text>
          <Text style={styles.manageText}>
            Modifier <Feather name="edit-2" size={14} />
          </Text>
          <View style={styles.paginationInside}>
            <View style={[styles.dotSmall, styles.activeDot]} />
            <View style={styles.dotSmall} />
            <View style={styles.dotSmall} />
          </View>
        </View>
        <Image
          source={require('../assets/images/laserworld.png')}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 54,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginBottom: 14,
  },
  addCardBox: {
    backgroundColor: '#F6E9EF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  addText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#5E0035',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  addImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  cardBox: {
    backgroundColor: '#ECEEFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  manageText: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
  },
  paginationInside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 65,
    gap: 6,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#770038',
  },
  cardImage: {
    width: 180,
    height: 150,
  },
});
