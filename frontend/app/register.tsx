import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!nom || !email || !password) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("email", email);
      formData.append("password", password);
  
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        body: formData, // ✅ PAS DE headers ici
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Compte créé !');
        router.push('/login');
      } else {
        alert(data.detail || 'Erreur d’inscription');
      }
    } catch (error) {
      alert("Erreur réseau");
      console.error(error);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image
            source={require('../assets/illustrations/fingerprint.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.title}>Créer un compte</Text>

          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#999"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Adresse mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Créer le compte</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            En créant un compte ou en vous connectant, vous acceptez les conditions générales
            d'utilisation.
          </Text>

          <View style={styles.loginRedirect}>
            <Text style={styles.loginText}>Vous avez un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f6f3fb',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  illustration: {
    width: 160,
    height: 160,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
    color: '#333',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontFamily: 'Poppins-Regular',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Poppins-Regular',
  },
  registerButton: {
    backgroundColor: '#4B002A',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  termsText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  loginRedirect: {
    flexDirection: 'row',
    marginTop: 12,
  },
  loginText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  loginLink: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginLeft: 4,
  },
});
