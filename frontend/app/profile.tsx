import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-svg-charts';
import * as Svg from 'react-native-svg';
import BottomNav from './nav_bar'; // Import de BottomNav

type BudgetItem = {
  key: number;
  value: number;
  svg: { fill: string };
  icon: string;
};

export function ProfileScreen() {
  const { width } = useWindowDimensions();
  const chartSize = Math.min(width * 0.4, 160);

  const badges = [
    { label: 'Scanneuse en herbes', color: '#B2C7F8', borderColor: '#6789CA' },
    { label: 'Reine du shopping', color: '#F3C7D4', borderColor: '#D289BC' },
    { label: '500+ tickets scannés', color: '#F5D3C0', borderColor: '#F5D3C0' },
  ];

  const envelopes = [
    { name: 'Alimentation', value: 250, max: 400, icon: 'shopping-cart' },
    { name: 'Shopping', value: 80, max: 150, icon: 'shopping-bag' },
    { name: 'Restaurants', value: 42, max: 120, icon: 'utensils' },
    { name: 'Loisirs', value: 86, max: 100, icon: 'gamepad' },
    { name: 'Voyage', value: 0, max: 200, icon: 'plane' },
  ];

  const chartData = [
    { key: 1, value: 45, svg: { fill: '#770038' }, icon: 'gamepad' },
    { key: 2, value: 20, svg: { fill: '#3B448F' }, icon: 'shopping-cart' },
    { key: 3, value: 15, svg: { fill: '#7F8BD0' }, icon: 'shopping-bag' },
    { key: 4, value: 10, svg: { fill: '#2D0E0E' }, icon: 'utensils' },
  ];

  const Labels = ({ slices }: { slices: { pieCentroid: [number, number]; data: any }[] }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <Svg.G key={index}>
          <Svg.ForeignObject
            x={pieCentroid[0] - 12}
            y={pieCentroid[1] - 12}
            width={24}
            height={24}
          >
            <FontAwesome5
              name={data.icon as any}
              size={18}
              color="#fff"
              style={{
                textAlign: 'center',
                fontFamily: Platform.OS === 'web' ? 'Poppins-Regular' : undefined,
              }}
            />
          </Svg.ForeignObject>
        </Svg.G>
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settings}>
          <Feather name="settings" size={24} color="#000" />
        </TouchableOpacity>
        <Image source={require('../assets/images/profile.png')} style={styles.avatar} />
        <Text style={styles.username}>@CapucineQueen</Text>
        <Image source={require('../assets/images/trophy.png')} style={styles.trophy} />
        <Text style={styles.points}>1000 pts</Text>
        <View style={styles.badgeRow}>
          {badges.map((badge, index) => (
            <View
              key={index}
              style={[styles.badge, { backgroundColor: badge.color, borderColor: badge.borderColor }]}
            >
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Enveloppes mensuelles */}
      <View style={styles.envelopesContainer}>
        <View style={styles.envelopeHeader}>
          <Text style={styles.envelopesTitle}>Enveloppes mensuelles</Text>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.envelopeWrapper}>
          {envelopes.map((env, index) => {
            const progress = Math.min(env.value / env.max, 1);
            const isLast = index === envelopes.length - 1;
            return (
              <View
                key={index}
                style={[styles.envelopeItem, isLast && { marginBottom: 0 }]}
              >
                <View style={styles.envelopeTopRow}>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name={env.icon as any} size={16} color="#fff" />
                  </View>
                  <Text style={styles.envelopeLabel}>{env.name}</Text>
                  <Text style={styles.amountContainer}>
                    <Text style={styles.amountBold}>{env.value}</Text>
                    <Text style={styles.amountRegular}>/{env.max} €</Text>
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: '#3B448F' }]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Nouvelle Répartition du budget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Répartition du budget</Text>
        <View style={styles.chartBox}>
          <PieChart
            style={{ height: chartSize, width: chartSize }}
            data={chartData}
            innerRadius={chartSize / 4}
            outerRadius={chartSize / 2.3}
            valueAccessor={({ item }: { item: BudgetItem }) => item.value}
          >
            <Labels slices={chartData.map(d => ({ pieCentroid: [0, 0], data: d }))} />
          </PieChart>

          <View style={styles.legendContainer}>
            <TouchableOpacity>
              <Text style={styles.link}>Mes historiques →</Text>
            </TouchableOpacity>
            {[{ label: 'Loisirs', color: '#770038' }, { label: 'Alimentation', color: '#3B448F' }, { label: 'Shopping', color: '#7F8BD0' }, { label: 'Restaurants', color: '#2D0E0E' }].map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Cartes de fidélités */}
      <Text style={styles.sectionTitle}>Cartes de fidélités</Text>
      <View style={styles.cardBox}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Cartes shopping</Text>
          <Text style={styles.manageText}>Gérer   +</Text>
          <View style={styles.paginationInside}>
            <View style={[styles.dotSmall, styles.activeDot]} />
            <View style={styles.dotSmall} />
            <View style={styles.dotSmall} />
          </View>
        </View>
        <Image
          source={require('../assets/images/fnac.png')}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Coupons de réduction */}
      <Text style={styles.sectionTitle}>Mes coupons de réduction</Text>

      <View style={styles.couponBox}>
        <Text style={styles.couponBrand}>Nutella</Text>
        <Text style={styles.couponTitle}>
          Coupon <Text style={styles.percent}>-50 %</Text>
        </Text>
        <Text style={styles.couponDate}>Valable jusqu'au 12/2025</Text>
        <Image
          source={require('../assets/images/nutella.png')}
          style={styles.couponImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.couponBox}>
        <Text style={styles.couponBrand}>Brets</Text>
        <Text style={styles.couponTitle}>
          Coupon <Text style={styles.percent}>-30 %</Text>
        </Text>
        <Text style={styles.couponDate}>Valable jusqu'au 11/2025</Text>
        <Image
          source={require('../assets/images/brets.png')}
          style={styles.couponImage}
          resizeMode="contain"
        />
      </View>

      {/* Ajouter la BottomNav */}
      <BottomNav />  {/* Ajoutez BottomNav ici */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  settings: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 5,
  },
  username: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  trophy: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginVertical: 6,
  },
  points: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#5D0032',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    margin: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  envelopesContainer: {
    marginBottom: 40,
  },
  envelopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  envelopesTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  envelopeWrapper: {
    backgroundColor: '#f3f4fa',
    borderRadius: 16,
    padding: 16,
  },
  envelopeItem: {
    marginBottom: 24,
  },
  envelopeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#5D0032',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  envelopeLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  amountBold: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  amountRegular: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginBottom: 14,
  },
  chartBox: {
    backgroundColor: '#F6E9EF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    flexShrink: 1,
    minWidth: 120,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    flexWrap: 'wrap',
  },
  // New styles from chart.tsx
  cardBox: {
    backgroundColor: '#ECEEFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  manageText: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular',
  },
  cardImage: {
    width: 180,
    height: 150,
  },
  paginationInside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 65,
    gap: 6,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#770038',
  },
  couponBox: {
    backgroundColor: '#F6E9EF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  couponBrand: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
  couponTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginVertical: 4,
  },
  couponDate: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  couponImage: {
    width: 122,
    height: 80,
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -40 }],
  },
  percent: {
    color: '#D40032',
  },
});

export default ProfileScreen;