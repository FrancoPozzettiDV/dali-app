import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function InfoScreen({navigation}){
    
    const { colors } = useTheme();
    const theme = useTheme();

    const [userData, setUserData] = React.useState([]);

    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        setUserData(JSON.parse(jsonValue));
      } catch(e) {
        console.log("No hay userData en async")+e;
      }
    }
    
    useEffect(() => {
      getData();
    },[]);
  
    return(
      <View style={styles.container}>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <Text style={{color: colors.text, fontSize: 30, fontWeight: 'bold', marginBottom: 50}}>Información del usuario</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Dato</DataTable.Title>
            <DataTable.Title>Valor</DataTable.Title>
          </DataTable.Header>
          
          <DataTable.Row>
            <DataTable.Cell>Nombre</DataTable.Cell>
            <DataTable.Cell>{userData.nombre}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Apellido</DataTable.Cell>
            <DataTable.Cell>{userData.apellido}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Usuario</DataTable.Cell>
            <DataTable.Cell>{userData.usuario}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Teléfono</DataTable.Cell>
            <DataTable.Cell>{userData.telefono}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Email</DataTable.Cell>
            <View style={{justifyContent: 'center'}}>
              <Text style={{color: colors.text}}>{userData.email}</Text>
            </View>
          </DataTable.Row>
        </DataTable>
      </View>
    );
}

export default InfoScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50
    }
});