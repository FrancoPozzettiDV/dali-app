import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Linking, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

function AboutScreen({navigation}){
    
    const { colors } = useTheme();
    const theme = useTheme();

    return(
      <View style={styles.container}>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <View>
          <Image source={require('../assets/dali-logo.png')} style={styles.logo} resizeMode='stretch'/>
        </View>
        <View>
          <Text style={{fontSize: 20, color: colors.text}}>Version: 1.0</Text>
        </View>
        <View>
          <Text style={{fontSize: 20, color: colors.text}}>Creado por: Franco Pozzetti</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://dali-web.herokuapp.com')}>
          <Text style={styles.buttonText}>Sitio Web</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginTop: 15,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#2196F3',
      width: '100%',
      height: 50,
    },
    buttonText: {
      color: '#2196F3', 
      fontSize: 20,
      lineHeight: 22,
      fontWeight: 'bold',
      letterSpacing: 0.25
    }
});