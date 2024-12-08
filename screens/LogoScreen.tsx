import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const LogoScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      
        <Image
          source={require('../assets/spo.png')}
          style={styles.logo}
        />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  spotifyText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    marginRight:20,
    fontStyle: 'italic',
    textAlign: 'center',
    alignItems: 'center', 
  },
});

export default LogoScreen;
