import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function LogoutButton() {
  const { logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "¿ARE YOU SURE YOU WANT TO LOGOUT?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout(), style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}