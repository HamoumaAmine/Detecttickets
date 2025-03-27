import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Définition des interfaces pour le typage
interface TicketItem {
  name: string;
  collection?: string;
  material?: string;
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
  category: string;
  paymentMethod: string;
}

interface TicketScreenProps {
  ticketData: TicketData;
  onAddTicket?: () => void;
}

const TicketScreen: React.FC<TicketScreenProps> = ({ ticketData, onAddTicket }) => {
  // Destructuration des données du ticket pour faciliter l'accès
  const {
    ticketNumber,
    customerName,
    customerInfo,
    date,
    time,
    items,
    total,
    category,
    paymentMethod
  } = ticketData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ticket</Text>
        <View style={styles.actions}>
          <TouchableOpacity>
            <Feather name="edit-2" size={24} color="#781244" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="share" size={24} color="#781244" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ticketContent}>
        <Text style={styles.ticketNumber}>Ticket {ticketNumber}</Text>
        
        <View style={styles.customerInfo}>
          <View>
            <Text style={styles.customer}>{customerName}</Text>
            <Text style={styles.customerSubtitle}>{customerInfo}</Text>
          </View>
          <View>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.date}>{time}</Text>
          </View>
        </View>

        <Text style={styles.articlesTitle}>Mes articles</Text>
        
        {items.map((item, index) => (
          <View key={index} style={styles.article}>
            <View style={styles.articleInfo}>
              <Text style={styles.articleName}>{item.name}</Text>
              {item.collection && (
                <Text style={styles.articleDescription}>{item.collection}</Text>
              )}
              {item.material && (
                <Text style={styles.articleDescription}>{item.material}</Text>
              )}
            </View>
            <Text style={styles.articleQuantity}>{item.quantity}</Text>
            <Text style={styles.articlePrice}>{item.price}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>{total}</Text>
        </View>

        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Catégorie</Text>
            <Text style={styles.infoValue}>{category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Moyen de paiement</Text>
            <Text style={styles.infoValue}>{paymentMethod}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddTicket}>
        <Text style={styles.addButtonText}>Ajouter le ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

// Exemple de données qui seraient chargées depuis la base de données
const sampleTicketData: TicketData = {
  ticketNumber: 'N°4-00001091',
  customerName: 'Inconnu',
  customerInfo: 'Inconnu',
  date: '04 janv. 2025',
  time: '13:20:11',
  items: [
    {
      name: 'Vase Beige',
      collection: 'Collection 03',
      material: 'Céramique',
      quantity: '1',
      price: '28,90€'
    },
    {
      name: 'Vase Beige',
      quantity: '1',
      price: '33,00€'
    }
  ],
  total: '61,90€',
  category: 'Shopping',
  paymentMethod: 'CB'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  articleDescription: {
    color: '#6b7280',
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
});

// Utilisation du composant avec les données d'exemple
// Dans une application réelle, vous injecteriez les données de votre base
export default () => <TicketScreen ticketData={sampleTicketData} />;