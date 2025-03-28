import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/home')}>
        <FontAwesome5 name="home" size={20} color="#CCC" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/parametres')}>
        <FontAwesome5 name="cog" size={20} color="#CCC" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={() => router.push('/scan_ticket')}>
        <FontAwesome5 name="camera" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/mesoffres')}>
        <FontAwesome5 name="tag" size={20} color="#CCC" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
        <FontAwesome5 name="user" size={20} color="#CCC" /> {/* Icône de profil */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    width: '100%', // Occupe toute la largeur
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  cameraButton: {
    backgroundColor: '#8E0D3C',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default BottomNav;
