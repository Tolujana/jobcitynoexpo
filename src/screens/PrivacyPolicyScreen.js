import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

export default function xPrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.paragraph}>
        Welcome to our app! We value your privacy and are committed to
        protecting your personal data. This privacy policy explains how we
        collect, use, and share your information when you use our app.
      </Text>

      <Text style={styles.sectionHeader}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We may collect the following types of information:
        {'\n'}- Personal identification information (Name, email address, etc.)
        {'\n'}- Usage data such as your activity on the app, preferences, and
        interactions.
      </Text>

      <Text style={styles.sectionHeader}>2. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use the information we collect in the following ways:
        {'\n'}- To provide and improve our app services.
        {'\n'}- To communicate with you about updates, promotions, or changes.
        {'\n'}- To comply with legal obligations.
      </Text>

      <Text style={styles.sectionHeader}>3. Sharing Your Information</Text>
      <Text style={styles.paragraph}>
        We do not share your personal information with third parties except in
        the following cases:
        {'\n'}- To comply with the law, legal requests, or government
        regulations.
        {'\n'}- With your consent to share information.
      </Text>

      <Text style={styles.sectionHeader}>4. Data Security</Text>
      <Text style={styles.paragraph}>
        We take reasonable measures to protect your data from unauthorized
        access or disclosure. However, no method of transmission over the
        internet or electronic storage is completely secure.
      </Text>

      <Text style={styles.sectionHeader}>5. Your Privacy Rights</Text>
      <Text style={styles.paragraph}>
        You have the right to access, modify, or delete your personal
        information that we collect. Please contact us if you wish to exercise
        these rights.
      </Text>

      <Text style={styles.sectionHeader}>
        6. Changes to This Privacy Policy
      </Text>
      <Text style={styles.paragraph}>
        We may update this privacy policy from time to time. Any changes will be
        posted on this page, and we encourage you to review it regularly.
      </Text>

      <Text style={styles.sectionHeader}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions about this privacy policy, please contact us
        at: support@appname.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
    color: '#333',
  },
});
