import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import FacebookLogo from '../assets/icons/facebook.svg';
import GoogleLogo from '../assets/icons/google.svg';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // 🔐 Sauvegarde le token
        await AsyncStorage.setItem('token', data.access_token);
        console.log('✅ Token stocké dans AsyncStorage :', data.access_token);

        alert('Connexion réussie !');
        router.push('/home');
      } else {
        alert("Erreur backend :\n" + JSON.stringify(data, null, 2));
      }
    } catch (error: any) {
      alert("Erreur réseau : " + (error?.message || JSON.stringify(error)));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Hello ! 👋</Text>

          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre e-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Votre mot de passe"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxContainer}
            >
              {rememberMe && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.rememberText}>Se rappeler de moi</Text>

            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.linkText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>Ou avec</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FacebookLogo width={16} height={16} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <GoogleLogo width={16} height={16} />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pas de compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>En créer un</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  checkboxContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  rememberText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginRight: 'auto',
  },
  forgotLink: {
    marginLeft: 8,
  },
  linkText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    backgroundColor: '#4B002A',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#888',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    flex: 1,
  },
  socialText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#333',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  registerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  registerLink: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginLeft: 4,
  },
});
