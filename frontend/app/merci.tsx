import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Merci() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Bouton fermer */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* Contenu centré */}
      <View style={styles.content}>
        <Text style={styles.title}>Merci d’avoir{'\n'}recommandé Trickly !</Text>

        <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />
        <Text style={styles.points}>1000 pts</Text>

        <Text style={styles.description}>
          Vous venez de gagner 1000 points ! Vous{'\n'}pouvez maintenant personnaliser votre profil.
        </Text>

        <Image source={require('../assets/images/handheart.png')} style={styles.illustration} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5E0035',
    paddingTop: 60,
    paddingHorizontal: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  content: {
    marginTop: 120, // 👈 pousse tout vers le bas
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  trophy: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  points: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 24,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  illustration: {
    width: '80%', // ← prend 80% de la largeur écran
    height: undefined,
    aspectRatio: 1, // ← garde les proportions
    resizeMode: 'contain',
    alignSelf: 'center', // ← force le centrage horizontal
  },
  
});
