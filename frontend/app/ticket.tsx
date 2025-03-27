import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TicketScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories/');
        const categoriesFromDB = response.data.map((cat: any) => {
          const { icon, bg, border } = getCategoryStyle(cat.nom);
          return {
            name: cat.nom,
            count: null,
            icon,
            bg,
            border,
          };
        });

        categoriesFromDB.push({
          name: 'Nouvelle',
          count: null,
          icon: 'add',
          bg: '#fff',
          border: '#4B002A',
        });

        setCategories(categoriesFromDB);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories :', err);
      }
    };

    const fetchTickets = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/tickets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des tickets :', err);
      }
    };

    fetchCategories();
    fetchTickets();
  }, []);

  const getCategoryStyle = (nom: string) => {
    switch (nom.toLowerCase()) {
      case 'alimentation':
        return { icon: 'cart-outline', bg: '#6D8EDB', border: '#2F58CD' };
      case 'shopping':
        return { icon: 'briefcase-outline', bg: '#5D0032', border: '#5D0032' };
      case 'loisirs':
        return { icon: 'game-controller-outline', bg: '#F5D3C0', border: '#F5D3C0' };
      case 'restaurant':
        return { icon: 'restaurant-outline', bg: '#2D2A6E', border: '#2D2A6E' };
      case 'transport':
        return { icon: 'bus-outline', bg: '#C65B84', border: '#C65B84' };
      case 'santé':
      case 'sante':
        return { icon: 'medkit-outline', bg: '#FF9494', border: '#FF5C5C' };
      case 'maison':
        return { icon: 'home-outline', bg: '#B1D8B7', border: '#6ABF69' };
      case 'voyage':
        return { icon: 'airplane-outline', bg: '#B5C6E0', border: '#7FA3D4' };
      case 'services':
        return { icon: 'construct-outline', bg: '#FCE38A', border: '#F9D949' };
      case 'éducation':
      case 'education':
        return { icon: 'school-outline', bg: '#E4BAD4', border: '#D291BC' };
      case 'cadeaux':
        return { icon: 'gift-outline', bg: '#FFB6B9', border: '#FF6F91' };
      case 'multimédia':
      case 'multimedia':
        return { icon: 'tv-outline', bg: '#D6E0F0', border: '#A0BFE0' };
      case 'vêtements':
      case 'vetements':
        return { icon: 'shirt-outline', bg: '#F7C8E0', border: '#F78CA2' };
      case 'énergie':
      case 'energie':
        return { icon: 'flash-outline', bg: '#FFD580', border: '#FFB347' };
      case 'banque':
        return { icon: 'cash-outline', bg: '#B9FBC0', border: '#2ECC71' };
      default:
        return { icon: 'pricetag-outline', bg: '#ffffff', border: '#cccccc' };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mes tickets</Text>

      <Text style={styles.subtitle}>Tickets par catégories</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((cat, index) => (
          <View key={index} style={styles.categoryWrapper}>
            <View
              style={[
                styles.categoryCard,
                {
                  backgroundColor: cat.bg,
                  borderWidth: 2,
                  borderColor: cat.border,
                },
              ]}
            >
              {cat.count !== null && (
                <View style={[styles.badge, { borderColor: cat.border }]}>
                  <Text style={styles.badgeText}>{cat.count}</Text>
                </View>
              )}
              <Ionicons
                name={cat.icon}
                size={50}
                color={cat.name === 'Nouvelle' ? cat.border : '#fff'}
              />
            </View>
            <Text style={styles.categoryLabel}>{cat.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.subtitle}>Historique des tickets</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Voir tout →</Text>
        </TouchableOpacity>
      </View>

      {tickets.map((ticket, index) => (
        <View key={index} style={styles.ticketCard}>
          <View>
            <Text style={styles.merchant}>{ticket.commercant}</Text>
            <Text style={styles.date}>{ticket.dernier_achat}</Text>
          </View>
          <Text style={styles.amount}>{ticket.total_depense.toFixed(2).replace('.', ',')} €</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    marginTop: 12,
    color: '#000',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  categoryWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  categoryCard: {
    width: 102,
    height: 102,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#ccc',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  
  
  categoryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    textAlign: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4B002A',
  },
  ticketCard: {
    backgroundColor: '#f3f4fa',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  merchant: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
});
