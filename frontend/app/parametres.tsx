import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Parametres() {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      {/* Conteneur blanc avec border radius */}
      <View style={styles.container}>
        {/* Profil */}
        <View style={styles.profileContainer}>
            <Image
    source={require('../assets/images/profile.png')}
    style={styles.avatar}
    />

          <Text style={styles.username}>@CapucineQueen</Text>
        </View>

        {/* Liste des options */}
        <View style={styles.optionContainer}>
          {[
            'Mes badges',
            'Mon compte',
            'Notifications',
            'Langue',
            'Confidentialité'
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.option}>
              <Text style={styles.optionText}>{item}</Text>
              <Ionicons name="chevron-forward" size={20} color="#A70056" />
            </TouchableOpacity>
          ))}

          {/* Dernier bouton : Partager */}
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Partager l’application</Text>
            <MaterialCommunityIcons name="share-variant" size={20} color="#A70056" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#5E0035',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 166,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Poppins-Bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 60,
    marginTop: -40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -100,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55, // cercle parfait
    // borderWidth: 3, ← à supprimer
    // borderColor: '#fff', ← à supprimer
  },
  
  username: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  optionContainer: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
