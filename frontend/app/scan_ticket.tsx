import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TicketItem {
  id?: number;
  name: string;
  quantity: string;
  price: string;
}

interface TicketData {
  ticketNumber: string;
  customerName: string;
  customerInfo: string;
  date: string;
  time: string;
  items: TicketItem[];
  total: string;
  paymentMethod: string;
}

export default function Page() {
  const { result, ticket_id } = useLocalSearchParams();
  const router = useRouter();
  const data = result ? JSON.parse(result as string) : {};

  const [editable, setEditable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Nouveau état pour gérer l'affichage de l'erreur
  const [ticketData, setTicketData] = useState<TicketData>({
    ticketNumber: data.ticket_number || 'Inconnu',
    customerName: data.store_name || 'Inconnu',
    customerInfo: data.store_address || 'Inconnu',
    date: data.date_time?.split(' ')[0] || '',
    time: data.date_time?.split(' ')[1] || '',
    items: data.items?.map((item: any) => ({
      id: item.id,
      name: item.description,
      quantity: item.quantity.toString(),
      price: `${item.total.toFixed(2)}€`
    })) || [],
    total: `${(data.total_amount || 0).toFixed(2)}€`,
    paymentMethod: data.payment_method || 'Inconnu'
  });

  const handleUpdateTicket = async () => {
    console.log('Enregistrement en cours...');

    const token = await AsyncStorage.getItem('token');
    if (!ticket_id) {
      console.log('Aucun ticket_id trouvé.');
      return;
    }

    const itemsWithMissingId = ticketData.items.filter(item => !item.id);
    if (itemsWithMissingId.length > 0) {
      console.log("Certains articles n'ont pas d'identifiant.");
      Alert.alert(
        'Erreur',
        "Un ou plusieurs articles n'ont pas d'identifiant. La mise à jour ne peut pas être effectuée."
      );
      return;
    }

    const payload = {
      total: ticketData.total,
      moyen_paiement: ticketData.paymentMethod,
      items: ticketData.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      // Envoi de la requête API pour mettre à jour le ticket
      const response = await axios.put(`http://localhost:8000/ticket/${ticket_id}/update`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.error) {
        // Si le backend retourne une erreur (ticket déjà scanné)
        setShowErrorPopup(true); // Affiche le popup d'erreur
        return;
      }

      console.log('Réponse de l\'API :', response);
      setShowPopup(true); // Affiche le popup de succès
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour :', error);
      Alert.alert('❌ Erreur', "Erreur inconnue lors de l'appel API.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ticket</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setEditable(!editable)}>
            <Feather name="edit-2" size={24} color="#781244" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="share" size={24} color="#781244" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ticketContent}>
        <Text style={styles.ticketNumber}>Ticket {ticketData.ticketNumber}</Text>

        <View style={styles.customerInfo}>
          <View>
            <Text style={styles.customer}>{ticketData.customerName}</Text>
            <Text style={styles.customerSubtitle}>{ticketData.customerInfo}</Text>
          </View>
          <View>
            <Text style={styles.date}>{ticketData.date}</Text>
            <Text style={styles.date}>{ticketData.time}</Text>
          </View>
        </View>

        <Text style={styles.articlesTitle}>Mes articles</Text>

        {ticketData.items.map((item, index) => (
          <View key={index} style={styles.article}>
            <View style={styles.articleInfo}>
              {editable ? (
                <TextInput
                  style={styles.articleName}
                  value={item.name}
                  onChangeText={(text) => {
                    const updatedItems = [...ticketData.items];
                    updatedItems[index].name = text;
                    setTicketData({ ...ticketData, items: updatedItems });
                  }}
                />
              ) : (
                <Text style={styles.articleName}>{item.name}</Text>
              )}
            </View>
            <Text style={styles.articleQuantity}>{item.quantity}</Text>
            <Text style={styles.articlePrice}>{item.price}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>{ticketData.total}</Text>
        </View>

        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Moyen de paiement</Text>
            {editable ? (
              <TextInput
                style={styles.infoValue}
                value={ticketData.paymentMethod}
                onChangeText={(text) => setTicketData({ ...ticketData, paymentMethod: text })}
              />
            ) : (
              <Text style={styles.infoValue}>{ticketData.paymentMethod}</Text>
            )}
          </View>
        </View>
      </View>

      {editable && (
        <TouchableOpacity style={styles.addButton} onPress={handleUpdateTicket}>
          <Text style={styles.addButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      )}

      {/* Popup d'erreur */}
      <Modal
        visible={showErrorPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Ticket déjà scanné</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setShowErrorPopup(false)}
            >
              <Text style={styles.popupButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Popup de confirmation */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Mise à jour réussie</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.popupButtonText}>Retour à l’accueil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  ticketContent: {
    backgroundColor: '#f0f3f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ticketNumber: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  customer: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  customerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
  },
  date: {
    textAlign: 'right',
    fontSize: 14,
  },
  articlesTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  article: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  articleInfo: {
    flex: 1,
  },
  articleName: {
    fontSize: 14,
  },
  articleQuantity: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  articlePrice: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    marginVertical: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  additionalInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right'
  },
  addButton: {
    backgroundColor: '#781244',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: '#781244',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  popupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
