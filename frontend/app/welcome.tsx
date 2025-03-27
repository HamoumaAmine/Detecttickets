import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image
            source={require('../assets/illustrations/fingerprint.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.textWrapper}>
            <Text style={styles.title}>Bienvenue sur Tickly !</Text>
            <Text style={styles.subtitle}>
              Connectez-vous avec votre mot de passe{'\n'}ou créez un compte
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f6f3fb',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 600, // ✅ hauteur minimum allongée
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 32, // un peu plus d’espace sous l’image
  },
  textWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48, // texte plus bas
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#444',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#4B002A',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  secondaryButton: {
    borderColor: '#4B002A',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B002A',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
