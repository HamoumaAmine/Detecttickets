import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ScanIcon from '../assets/icons/scan.svg';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
  const logoMap: { [key: string]: any } = {
    'carrefour.png': require('../assets/logos/carrefour.png'),
    'nutella.png': require('../assets/images/nutella.png'),
  };

  const imageMap: { [key: string]: any } = {
    'nutella_double.png': require('../assets/images/nutella_double.png'),
  };

  const [totalDepenses, setTotalDepenses] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [depensesParCategorie, setDepensesParCategorie] = useState<{ [categorie: string]: number }>({});
  const [offre, setOffre] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('http://localhost:8000/home/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTotalDepenses(response.data.total_depenses_mois);
        setMessage(response.data.message);
        setDepensesParCategorie(response.data.depenses_par_categorie);

        if (response.data.offres_actives?.length > 0) {
          setOffre(response.data.offres_actives[0]);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  const getCategorieIcon = (categorie: string) => {
    switch (categorie.toLowerCase()) {
      case 'alimentation': return 'cart-outline';
      case 'santé': return 'medkit-outline';
      case 'shopping': return 'bag-outline';
      default: return 'pricetag-outline';
    }
  };

  const uploadToBackend = async (formData: FormData) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/scan/scan/', {


        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Réponse du backend :', data);
      Alert.alert("Résultat OCR", JSON.stringify(data.result?.items?.slice(0, 3), null, 2));
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi au backend :', error);
      Alert.alert("Erreur", "Impossible d'envoyer l'image au backend.");
    }
  };

  const handleChooseFile = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const blob = new Blob([file], { type: file.type });
        const formData = new FormData();
        formData.append('file', new File([blob], file.name, { type: file.type }));

        await uploadToBackend(formData);
      };
      input.click();
    } else {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission refusée", "L’accès à la galerie est nécessaire.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        console.log("❌ Sélection annulée");
        return;
      }

      const image = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: image.fileName ?? 'ticket.jpg',
        type: 'image/jpeg',
      } as any);

      await uploadToBackend(formData);
    }

    setModalVisible(false);
  };

  const handleTakePhoto = () => {
    setModalVisible(false);
    Alert.alert("📸 Caméra", "Fonction 'Prendre une photo' à implémenter");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Dépenses */}
      <View style={styles.totalBox}>
        <Text style={styles.amount}>
          {Math.floor(totalDepenses ?? 0)}
          <Text style={styles.decimal}>
            ,{String(((totalDepenses ?? 0) % 1).toFixed(2)).split('.')[1]}
          </Text> €
        </Text>
        <Text style={styles.subtext}>Dépensé ce mois</Text>
      </View>

      <Text style={styles.title}>{message ?? 'Bienvenue !'}</Text>

      {/* Bloc accueil */}
      <View style={styles.welcomeBox}>
        <Image source={require('../assets/images/welcome_cat.png')} style={styles.welcomeImage} />
        <Text style={styles.welcomeText}>
          Ajoutez vos tickets, gérez vos dépenses et ne manquez jamais une de vos offres personnalisées sur Trickly.
        </Text>
      </View>

      {/* Scanner */}
      <Text style={styles.title}>Scannez un ticket !</Text>
      <View style={styles.scanBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>Stockage et gestion de vos tickets</Text>
          <Text style={styles.scanText}>Ne perdez plus un seul ticket de caisse, visualisez toutes vos dépenses.</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => setModalVisible(true)}>
            <View style={styles.scanButtonContent}>
              <Text style={styles.scanButtonText}>Scanner</Text>
              <ScanIcon width={16} height={16} />
            </View>
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/images/scanner_ticket.png')} style={styles.scanImage} />
      </View>

      {/* Offres */}
      <View style={styles.expenseHeader}>
        <Text style={styles.title}>Vos offres personnalisées</Text>
        <TouchableOpacity onPress={() => router.push('/mesoffres')}>
          <Text style={styles.expenseLink}>Voir toutes →</Text>
        </TouchableOpacity>
      </View>

      {offre && (
        <View style={styles.offerBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle}>{offre.commercant} - {offre.titre}</Text>
            <Text style={styles.offerDescription}>
              {offre.description}{'\n'}Jusqu’au {offre.date_fin}
            </Text>
            {offre.logo && (
              <Image
                source={logoMap[offre.logo.split('/').pop()] || { uri: offre.logo }}
                style={styles.offerLogo}
                resizeMode="contain"
              />
            )}
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
          {offre.image_produit && (
            <Image
              source={imageMap[offre.image_produit.split('/').pop().toLowerCase()] || { uri: offre.image_produit }}
              style={styles.offerImage}
              resizeMode="contain"
            />
          )}
        </View>
      )}

      {/* Historique */}
      <Text style={styles.title}>Vos dernières dépenses</Text>
      <View style={styles.expenseBox}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseTitle}>Historique des tickets</Text>
          <TouchableOpacity onPress={() => router.push('/ticket')}>
            <Text style={styles.expenseLink}>Voir toutes →</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(depensesParCategorie).map(([categorie, montant], index) => (
          <View style={styles.expenseItem} key={index}>
            <View style={styles.expenseIconBox}>
              <Ionicons name={getCategorieIcon(categorie)} size={20} color="#fff" />
            </View>
            <View style={styles.expenseText}>
              <Text style={styles.expenseLabel}>{categorie}</Text>
              <Text style={styles.expenseDate}>{new Date().toLocaleDateString()}</Text>
            </View>
            <Text style={styles.expenseAmount}>-{montant.toFixed(2)}€</Text>
          </View>
        ))}
      </View>

      {/* Modal de scan */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Image source={require('../assets/images/loadfile.png')} style={styles.modalImage} />
            <Text style={styles.modalText}>
              Comment souhaitez-vous scanner votre ticket ?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleChooseFile}>
                <Text style={styles.cancelText}>Charger un fichier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleTakePhoto}>
                <Text style={styles.confirmText}>Prendre une photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
    },
    totalBox: {
      alignItems: 'center',
      marginBottom: 20,
    },
    amount: {
      fontSize: 36,
      fontFamily: 'Poppins-Bold',
      color: '#000',
    },
    decimal: {
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
    },
    subtext: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#666',
    },
    title: {
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      marginBottom: 10,
    },
    welcomeBox: {
      backgroundColor: '#F8F4FF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    welcomeImage: {
      width: 350,
      height: 120,
      resizeMode: 'contain',
      marginBottom: 12,
      alignSelf: 'center',
    },
    welcomeText: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: '#444',
      textAlign: 'left',
    },
    scanBox: {
      flexDirection: 'row',
      backgroundColor: '#EDEBFF',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    scanTitle: {
      fontSize: 13,
      fontFamily: 'Poppins-Bold',
      marginBottom: 6,
    },
    scanText: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#444',
      marginBottom: 10,
    },
    scanButton: {
      backgroundColor: '#5E0035',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    scanButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    scanButtonText: {
      color: '#fff',
      fontFamily: 'Poppins-Regular',
      fontSize: 13,
    },
    scanImage: {
      width: 70,
      height: 70,
      resizeMode: 'contain',
      marginLeft: 10,
    },
    offerBox: {
      backgroundColor: '#F0F2FF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
    },
    offerTitle: {
      fontSize: 13,
      fontFamily: 'Poppins-Bold',
      marginBottom: 6,
    },
    offerDescription: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#444',
    },
    offerLogo: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      marginTop: 10,
    },
    offerImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    dotsContainer: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 10,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#ccc',
    },
    dotActive: {
      backgroundColor: '#5E0035',
    },
    expenseBox: {
      backgroundColor: '#F7EAF4',
      borderRadius: 16,
      padding: 16,
      marginBottom: 40,
    },
    expenseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    expenseTitle: {
      fontSize: 14,
      fontFamily: 'Poppins-Bold',
    },
    expenseLink: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#5E0035',
    },
    expenseItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    expenseIconBox: {
      backgroundColor: '#5E0035',
      padding: 10,
      borderRadius: 12,
      marginRight: 12,
    },
    expenseText: {
      flex: 1,
    },
    expenseLabel: {
      fontSize: 13,
      fontFamily: 'Poppins-Bold',
    },
    expenseDate: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#888',
      marginTop: 2,
    },
    expenseAmount: {
      fontSize: 13,
      fontFamily: 'Poppins-Bold',
      color: '#C42C63',
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
      width: 200,
      height: 250,
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
  
