import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { Card, Title,Divider, Button as RNPButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function HomeScreen({navigation}){
    
    const { colors } = useTheme();
    const theme = useTheme();
    const [turno, setTurno] = useState([]);
    const [userData, setUserData] = useState([]);

    const getTurno = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        setUserData(JSON.parse(jsonValue));
        const userToken = await AsyncStorage.getItem('userToken');
        if(turno.length === 0){
        axios.get("https://dali-web.herokuapp.com/api/turno",{
            headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': 'Bearer '+userToken,
            "Access-Control-Allow-Origin": "*", 
            }
        }).then(async(getTurn) => {
            console.log(getTurn.status);
            console.log(getTurn.data);
            setTurno(getTurn.data);
        }).catch((error) => {
            console.log(error.response);
            Alert.alert("Error","Se ha producido un error. Verifique su conexión o vuelva a intentar más tarde.");
        })
      }
      } catch(e) {
        console.log("Error obteniendo datos"+e);
      }
    }

    useEffect(() => {
      getTurno();
      const unsubscribe = navigation.addListener('focus', () => {
          console.log("Refreshed");
          getTurno();
      });
      return unsubscribe;
    },[navigation]);

    function reformatDate(date){
      const dArr = date.split("-"); 
      return dArr[2]+ "-" +dArr[1]+ "-" +dArr[0];
    }
    function reformatHour(hour){
      const hArr = hour.split(":"); 
      return hArr[0]+ ":" +hArr[1];
    }

    const endTurn = async (id) => {
      try{
        const userToken = await AsyncStorage.getItem('userToken');
        axios.post("https://dali-web.herokuapp.com/api/finish",{
        id_turno: id,
        },{ 
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': 'Bearer '+userToken,
          "Access-Control-Allow-Origin": "*", 
        }
      }).then(async(response) => {
          console.log(response.status);
          setTurno([]);
          Alert.alert("Turno Finalizado","El turno finalizó exitosamente!");
      }).catch((error) => {
        console.log(error.message);
        Alert.alert("Error","Se ha producido un error. Verifique su conexión o vuelva a intentar más tarde");
      });
      }catch(e){
        console.log("Error finalizando turno"+e);
      }
    }
    
    
    
    
    return(
        <View style={styles.container}>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <View>
          <Image source={require('../assets/dali-logo.png')} style={styles.logo} resizeMode='stretch'/>
        </View>
        
        {userData.id_perfil === 4 &&
        <View style={{marginBottom: 20}}>
          <View>
            <Text style={{color: colors.text, textAlign: 'center', fontWeight:'bold'}}>Si uno de sus usuarios se vuelve su paciente: </Text>
          </View>
          <View>
            <Text style={{color: colors.text, textAlign: 'center'}}>Envíe un email al administrador para cambiar el permiso del paciente.</Text>
          </View>
          <View>
            <Text style={{color: colors.text, textAlign: 'center'}}>Así, el paciente podrá acceder a secciones exclusivas (evaluación, actividades, etc.).</Text>
          </View>
        </View>
        }
        
        <View>
        {turno.length > 0 &&
        
        <Card style={{width:350,height:250,marginTop:20}} mode='outlined'>
        <Card.Title title={turno[0].motivo} subtitle={reformatDate(turno[0].fecha)} subtitleStyle={{fontWeight: 'bold'}}/>
        <Divider style={{marginBottom:5}}/>
        <Card.Content>
          <Title>Paciente: {turno[0].paciente}</Title>
          <Title>Doctor/a: {turno[0].nombreProfesional} {turno[0].apellidoProfesional}</Title>
          <Title>Horario: {reformatHour(turno[0].desde)} - {reformatHour(turno[0].hasta)}</Title>
          <Divider style={{marginBottom:5,marginTop:5}}/>
          <RNPButton style={{marginTop:5}} color='green'
          onPress={ () => Alert.alert("Finalizar Turno",
          "Si el turno ha sido concretado, presione aceptar.\nSi quiere cancelar el turno, diríjase a la sección de turnos.\n¿Está seguro de finalizar el turno?",
          [{text: "Cancelar"},
          { text: "Aceptar", onPress: () => endTurn(turno[0].id)}],{cancelable: true})}>Finalizar Turno</RNPButton>
        </Card.Content>
        </Card>
        }
        </View>
        
        <View>
        {turno.length === 0 && userData.id_perfil !== 4 ?
        <View>
        <Text style={{color: colors.text,marginBottom:20}}>Parece que no tienes ningun turno...</Text>
        <Button
            color='#009387'
            title="Pedir un turno" 
            onPress={() => navigation.navigate('Create')}
        />
        </View>
        :
        userData.id_perfil === 4 &&
        <Button
            color='#009387'
            title="Ir a Turnos" 
            onPress={() => navigation.navigate('Appointment')}
        />
        }
        </View>
        
        </View>
    );
}

export default HomeScreen;

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
});

