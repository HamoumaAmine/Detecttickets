import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Coupon = {
  id: number;
  titre: string;
  description: string;
  reduction: number;
  date_fin: string;
  image_produit: string;
  logo?: string;
};

const filters = ['Alimentation', 'Shopping', 'Coupons', 'Voyages'];

const couponImageMap: { [key: string]: any } = {
  'nutella_coupon.png': require('../assets/images/nutella_coupon.png'),
  'danone_coupon.png': require('../assets/images/danone_coupon.png'),
  'milka_coupon.png': require('../assets/images/milka_coupon.png'),
};

const photoMap: { [key: string]: any } = {
  '../assets/images/profile_amine.png': require('../assets/images/profile_amine.png'),
};

export default function MesOffresCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [utilisateur, setUtilisateur] = useState<any>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCoupons = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/mesoffres/coupons', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUtilisateur(response.data.utilisateur);
        setCoupons(response.data.offres);
      } catch (error) {
        console.error('Erreur lors de la récupération des coupons :', error);
      }
    };

    fetchCoupons();
  }, []);

  const openModal = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCoupon(null);
    setModalVisible(false);
  };

  const obtenirCoupon = async () => {
    if (!selectedCoupon) return;

    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/obtenir-coupon/${selectedCoupon.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      closeModal();
      router.push({
        pathname: '/mercicoupon',
        params: {
          couponId: selectedCoupon.id.toString(),
          success: 'true',
          pointsRestants: response.data.points_restants.toString(),
        },
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'obtention du coupon :', error);
      alert(error.response?.data?.detail || 'Erreur inconnue');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Mes offres</Text>

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              filter === 'Coupons' && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'Coupons' && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Profil dynamique */}
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
              <View style={styles.pointsBarFill} />
            </View>
          </View>
        </View>
      )}

      {/* Coupons dynamiques */}
      <Text style={styles.sectionTitle}>Coupons disponibles</Text>
      <Text style={styles.sectionDescription}>
        Échangez vos points collectés contre des bons de réduction chez vos
        enseignes préférées !
      </Text>

      {coupons.map((coupon) => {
        const imageName = coupon.image_produit?.split('/').pop() || '';
        return (
          <View key={coupon.id} style={styles.couponBox}>
            <View style={styles.couponTextBox}>
              <Text style={styles.couponBrand}>{coupon.titre}</Text>
              <Text style={styles.couponTitle}>{coupon.description}</Text>
              <Text
                style={styles.couponCost}
                onPress={() => openModal(coupon)}
              >
                Échangez contre {coupon.reduction} pts
              </Text>
            </View>
            <Image
              source={couponImageMap[imageName] || { uri: coupon.image_produit }}
              style={styles.couponImage}
            />
          </View>
        );
      })}

      {/* Modal */}
      {selectedCoupon && (
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>

              <Image
                source={
                  couponImageMap[selectedCoupon.image_produit.split('/').pop() || ''] ||
                  { uri: selectedCoupon.image_produit }
                }
                style={styles.modalImage}
              />

              <Text style={styles.modalText}>
                Souhaitez-vous échanger {selectedCoupon.reduction} pts{'\n'}
                contre 1 coupon {selectedCoupon.titre} ?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={obtenirCoupon}>
                  <Text style={styles.confirmText}>Obtenir le coupon</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#444',
    marginBottom: 20,
  },
  couponBox: {
    backgroundColor: '#F1F2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponTextBox: {
    flex: 1,
    paddingRight: 16,
  },
  couponBrand: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#C42C63',
    marginBottom: 2,
  },
  couponTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  couponCost: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#444',
    textDecorationLine: 'underline',
  },
  couponImage: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#F1F2FF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 6,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#444',
  },
  modalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5E0035',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Poppins-Regular',
    color: '#5E0035',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#5E0035',
    alignItems: 'center',
  },
  confirmText: {
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
});
