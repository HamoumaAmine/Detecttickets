import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Pour la navigation

export default function ConditionsGenerales() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Flèche pour revenir en arrière */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#4B002A" />
      </TouchableOpacity>

      <Text style={styles.title}>Conditions Générales d'Utilisation</Text>

      <Text style={styles.paragraph}>
        Politique : Conformément aux dispositions de la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, vous disposez d'un droit d'accès, de rectification et d'opposition sur les données personnelles vous concernant, notamment celles relatives à vos tickets et à leur analyse.
      </Text>

      <Text style={styles.paragraph}>
        En utilisant nos services, vous acceptez également notre politique de confidentialité, qui définit comment nous collectons, utilisons et protégeons vos données personnelles. Nous nous engageons à respecter votre vie privée et à protéger les informations que vous nous fournissez.
      </Text>

      <Text style={styles.sectionTitle}>Collecte des données personnelles</Text>
      <Text style={styles.paragraph}>
        Nous collectons des données personnelles lorsque vous vous inscrivez à notre service, utilisez notre application ou interagissez avec nos fonctionnalités. Cela peut inclure, mais sans s'y limiter, vos nom, adresse e-mail, informations de connexion, informations relatives à vos achats et à l’utilisation de vos tickets.
      </Text>

      <Text style={styles.sectionTitle}>Utilisation des données</Text>
      <Text style={styles.paragraph}>
        Les données personnelles collectées sont utilisées pour améliorer nos services, personnaliser votre expérience, et vous fournir des recommandations adaptées à vos achats et à vos intérêts. Nous pouvons également utiliser vos données pour vous envoyer des offres spéciales, des informations sur nos produits, ou pour effectuer des analyses statistiques afin d'améliorer notre service.
      </Text>

      <Text style={styles.sectionTitle}>Protection des données personnelles</Text>
      <Text style={styles.paragraph}>
        Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données personnelles contre l'accès, l'utilisation ou la divulgation non autorisée. Nous garantissons également que vos informations sont stockées dans des conditions de sécurité strictes.
      </Text>

      <Text style={styles.sectionTitle}>Partage des données</Text>
      <Text style={styles.paragraph}>
        Nous ne partageons vos données personnelles avec des tiers que dans le cadre de l'exécution de nos services, par exemple, pour le traitement des paiements ou pour répondre à des exigences légales. En dehors de ces circonstances, nous ne divulguerons pas vos données personnelles à des tiers sans votre consentement explicite.
      </Text>

      <Text style={styles.sectionTitle}>Cookies et suivi</Text>
      <Text style={styles.paragraph}>
        Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience utilisateur, analyser le trafic et vous offrir des contenus personnalisés. Vous avez la possibilité de refuser l'utilisation des cookies en ajustant les paramètres de votre navigateur, mais cela pourrait affecter votre expérience avec nos services.
      </Text>

      <Text style={styles.sectionTitle}>Droits des utilisateurs</Text>
      <Text style={styles.paragraph}>
        Vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles à tout moment. Vous pouvez également demander la limitation de leur traitement ou vous opposer à leur utilisation à des fins de marketing direct. Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : contact@notresite.com.
      </Text>

      <Text style={styles.sectionTitle}>Modification des conditions</Text>
      <Text style={styles.paragraph}>
        Nous nous réservons le droit de modifier ces conditions générales d'utilisation à tout moment. Toute modification sera publiée sur cette page, et nous vous encourageons à consulter régulièrement ces conditions pour être informé des éventuels changements.
      </Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.paragraph}>
        Si vous avez des questions concernant ces conditions générales d'utilisation ou si vous souhaitez exercer vos droits relatifs à vos données personnelles, veuillez nous contacter à l'adresse suivante : contact@notresite.com.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B002A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
});
