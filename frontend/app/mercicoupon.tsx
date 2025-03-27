import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const couponImages: Record<string, any> = {
  '1': require('../assets/images/nutella_coupon.png'),
  '2': require('../assets/images/danone_coupon.png'),
  '3': require('../assets/images/milka_coupon.png'),
};

export default function MerciCoupon() {
  const { couponId } = useLocalSearchParams();
  const router = useRouter();

  const couponImage = couponId && couponImages[couponId as string];

  return (
    <View style={styles.container}>
      {/* Bouton fermer */}
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      {/* Points */}
      <View style={styles.pointsRow}>
        <Text style={styles.points}>1300 pts</Text>
        <View style={styles.pointsBarBackground}>
          <View style={styles.pointsBarFill} />
        </View>
      </View>

      {/* Contenu central */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Vous avez échangé vos{'\n'}points contre un coupon !
        </Text>

        {/* Image coupon */}
        {couponImage && (
          <Image source={couponImage} style={styles.couponImage} />
        )}

        {/* Texte explicatif */}
        <Text style={styles.text}>
          Vous pouvez retrouver l’ensemble de vos{'\n'}coupons dans votre profil.
        </Text>

        {/* Bouton */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.btnText}>Aller sur mon profil</Text>
        </TouchableOpacity>

        {/* Illustration */}
        <Image
          source={require('../assets/images/handheart.png')}
          style={styles.illustration}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5E0035',
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 24,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 30,
    width: '100%',
    paddingRight: 20,
  },
  points: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  pointsBarBackground: {
    width: 100,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  pointsBarFill: {
    width: '65%',
    height: 6,
    backgroundColor: '#FFA500',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  couponImage: {
    width: 140,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 40,
  },
  btnText: {
    color: '#5E0035',
    fontFamily: 'Poppins-Bold',
  },
  illustration: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  
});
