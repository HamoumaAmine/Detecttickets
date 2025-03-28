import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomNav from './nav_bar'; // Importer BottomNav

const filters = ['Alimentation', 'Shopping', 'Coupons', 'Voyages'];

const imageMap: { [key: string]: any } = {
  'nutella_double.png': require('../assets/images/nutella_double.png'),
  'lindt.png': require('../assets/images/lindt.png'),
  'glace_bj.png': require('../assets/images/glace_bj.png'),
  // ajoute tous les autres ici
};

const logoMap: { [key: string]: any } = {
  'carrefour.png': require('../assets/logos/carrefour.png'),
  'intermarche.png': require('../assets/images/intermarche.png'),
  // ajoute d'autres logos ici
};

const photoMap: { [key: string]: any } = {
  '../assets/images/profile_amine.png': require('../assets/images/profile_amine.png'),
};

export default function MesOffres() {
  const [utilisateur, setUtilisateur] = useState<any>(null);
  const [offres, setOffres] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/mesoffres/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUtilisateur(response.data.utilisateur);
        setOffres(response.data.offres);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Mes offres</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, index === 0 && styles.activeFilter]}
            onPress={() => {
              if (filter.toLowerCase() === 'coupons') {
                router.push('/mesoffrescoupons');
              }
            }}
          >
            <Text
              style={[
                styles.filterText,
                index === 0 && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {utilisateur && (
        <View style={styles.profileRow}>
          <Image
            source={
              utilisateur.photo?.startsWith('../assets/')
                ? photoMap[utilisateur.photo]
                : { uri: utilisateur.photo }
            }
            style={styles.avatar}
          />

          <View>
            <Text style={styles.username}>{utilisateur.nom}</Text>
            <Text style={styles.level}>Niveau {utilisateur.niveau}</Text>
          </View>
          <View style={styles.pointsBox}>
            <Text style={styles.points}>{utilisateur.points} pts</Text>
            <View style={styles.pointsBarBackground}>
              <View
                style={[
                  styles.pointsBarFill,
                  { width: `${Math.min(utilisateur.points / 20, 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      <Text style={styles.suggestionsTitle}>Suggestions pour vous</Text>

      {offres.map((offer, index) => (
        <View key={index} style={styles.offerBox}>
          <View style={styles.offerTextBox}>
            <Text style={styles.offerTag}>Jusqu'au {offer.date_fin}</Text>
            <Text style={styles.offerTitle}>{offer.titre}</Text>
            <Text style={styles.offerSubtitle}>{offer.description}</Text>
          </View>

          {offer.image_produit && (
            <Image
              source={
                imageMap[offer.image_produit.split('/').pop()] || {
                  uri: offer.image_produit,
                }
              }
              style={styles.offerImage}
            />
          )}

          {offer.logo && (
            <Image
              source={
                logoMap[offer.logo.split('/').pop()] || {
                  uri: offer.logo,
                }
              }
              style={styles.offerLogo}
            />
          )}
        </View>
      ))}

      {/* Ajouter la BottomNav */}
      <BottomNav />  {/* Ajoutez la BottomNav en bas de la page */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  filtersRow: {
    gap: 10,
    paddingHorizontal: 2,
    marginBottom: 24,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#5E0035',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#5E0035',
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#5E0035',
  },
  activeFilterText: {
    color: '#fff',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  level: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  pointsBox: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#5E0035',
    marginBottom: 4,
  },
  pointsBarBackground: {
    width: 100,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  pointsBarFill: {
    width: '75%',
    height: 6,
    backgroundColor: '#FFA500',
    borderRadius: 3,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 14,
  },
  offerBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  offerTextBox: {
    marginRight: 100,
  },
  offerTag: {
    color: '#3366cc',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
  },
  offerTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#444',
  },
  offerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    position: 'absolute',
    right: 16,
    top: 20,
  },
  offerLogo: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: 12,
    right: 12,
    resizeMode: 'contain',
  },
});
