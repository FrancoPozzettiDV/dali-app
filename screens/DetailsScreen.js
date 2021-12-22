import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DetailsScreen({navigation}){
    
  const { colors } = useTheme();
  const theme = useTheme();
  const [userData, setUserData] = useState([]);
  const [listaReservado,setListaReservado] = useState([]);
  const [listaFinalizado,setListaFinalizado] = useState([]);
  const [listaCancelado,setListaCancelado] = useState([]);
  
  const getListado = async () => {
    try{
      const jsonValue = await AsyncStorage.getItem('userData');
      setUserData(JSON.parse(jsonValue));
      const userToken = await AsyncStorage.getItem('userToken');
      axios.get("https://dali-web.herokuapp.com/api/listado",{
            headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': 'Bearer '+userToken,
            "Access-Control-Allow-Origin": "*", 
            }
        }).then(async(getTurnos) => {
            console.log(getTurnos.data);
            const turnoReservado = getTurnos.data.filter((item) => {
              return item.id_estado === 1;
            });
            setListaReservado(turnoReservado);
            const turnosFinalizados = getTurnos.data.filter((item) => {
              return item.id_estado === 2;
            });
            setListaFinalizado(turnosFinalizados);
            const turnosCancelados = getTurnos.data.filter((item) => {
              return item.id_estado === 3;
            });
            setListaCancelado(turnosCancelados);
        }).catch((error) => {
            console.log(error.response);
            alert("Error obteniendo listado de turnos");
        })
    }catch(e){
      console.log("Error obteniendo listado de turnos: "+e);
    }
  }

  const eliminarTurno = async (id) => {
    try{
      const userToken = await AsyncStorage.getItem('userToken');
      axios.post("https://dali-web.herokuapp.com/api/delete",{
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
          Alert.alert("Eliminación exitosa","El turno se ha eliminado exitosamente!");
          getListado();
      }).catch((error) => {
        console.log(error.message);
        Alert.alert("Error","El turno no pudo ser eliminado. Verifique su conexión o vuelva a intentar más tarde");
      });
    }catch(e){
      console.log("Error al eliminar turno: "+e);
    }
  }

  const cancelarTurno = async (id) => {
    try{
      const userToken = await AsyncStorage.getItem('userToken');
      axios.post("https://dali-web.herokuapp.com/api/cancel",{
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
          Alert.alert("Cancelación exitosa","El turno se ha cancelado exitosamente!");
          getListado();
      }).catch((error) => {
        console.log(error.message);
        Alert.alert("Error","El turno no pudo ser cancelado. Verifique su conexión o vuelva a intentar más tarde");
      });
    }catch(e){
      console.log("Error al cancelar turno: "+e);
    }
  }
  
  useEffect(() => {
    getListado();
    const unsubscribe = navigation.addListener('focus', () => {
        console.log("Refreshed");
        getListado();
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
  
  return(
    <ScrollView style={styles.container}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      <List.Section>
        <List.Subheader style={{backgroundColor: 'lightgreen', fontWeight:'bold', color: '#333333'}}>{userData.id_perfil !== 4 ? 'Turno Reservado' : 'Turnos Reservados'}</List.Subheader>
        {
          listaReservado.map((item) => {
            if(userData.id_perfil !== 4){
            return(
            <List.Item key={item.id} title={item.nombreProfesional+" "+item.apellidoProfesional} 
            description={reformatDate(item.fecha)+" | "+reformatHour(item.desde)+" - "+reformatHour(item.hasta)}
            right={() => <IconButton icon="close" color='red'
            size={20}
            onPress={() => Alert.alert("Cancelar turno","¿Está seguro/a que quiere cancelar?\nEsta acción no puede deshacerse.",[{text: "VOLVER"},
            { text: "CANCELAR", onPress: () => cancelarTurno(item.id)}],{cancelable: true})}/>} 
            />
            );
            }else{
              return (
                <List.Item key={item.id} title={item.paciente+" | "+item.motivo} 
                description={reformatDate(item.fecha)+" | "+reformatHour(item.desde)+" - "+reformatHour(item.hasta)+" | "+item.telefono}
                right={() => <IconButton icon="close" color='red'
                size={20}
                onPress={() => Alert.alert("Cancelar turno","¿Está seguro/a que quiere cancelar?\nEsta acción no puede deshacerse.",[{text: "VOLVER"},
                { text: "CANCELAR", onPress: () => cancelarTurno(item.id)}],{cancelable: true})}/>} 
                />
              );
            }
          })
        }
      </List.Section>

      {userData.id_perfil !== 4 &&
      <List.Section>
        <List.Subheader style={{backgroundColor: 'cyan', fontWeight:'bold', color: '#333333'}}>Turnos Finalizados</List.Subheader>
        {
          listaFinalizado.map((item) => {
            return(
            <List.Item key={item.id} title={item.nombreProfesional+" "+item.apellidoProfesional} 
            description={reformatDate(item.fecha)+" | "+reformatHour(item.desde)+" - "+reformatHour(item.hasta)}
            right={() => <IconButton icon="trash-can-outline" color='red'
            size={20}
            onPress={() => Alert.alert("Eliminar turno","¿Desea eliminar el turno del historial?",[{text: "Volver"},
            { text: "Eliminar", onPress: () => eliminarTurno(item.id)}],{cancelable: true})}/>} 
            />
            );
          })
        }
      </List.Section>
      }

      {userData.id_perfil !== 4 &&
      <List.Section>
        <List.Subheader style={{backgroundColor: 'pink', fontWeight:'bold', color: '#333333'}}>Turnos Cancelados</List.Subheader>
        {
          listaCancelado.map((item) => {
            return(
          <List.Item key={item.id} title={item.nombreProfesional+" "+item.apellidoProfesional} 
          description={reformatDate(item.fecha)+" | "+reformatHour(item.desde)+" - "+reformatHour(item.hasta)}
          right={() => <IconButton icon="trash-can-outline" color='red'
          size={20}
          onPress={() => Alert.alert("Eliminar turno","¿Desea eliminar el turno del historial?",[{text: "Volver"},
          { text: "Eliminar", onPress: () => eliminarTurno(item.id)}],{cancelable: true})}/>} 
          />
          );
          })
        }
      </List.Section>
      }

    </ScrollView>
  );
}

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      
     
    },
});