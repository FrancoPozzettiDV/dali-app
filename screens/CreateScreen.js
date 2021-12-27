import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Picker, ActivityIndicator, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import {MaskedTextInput} from 'react-native-mask-text';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CreateScreen({navigation}){
  
  const [isReady, setIsReady] = useState(false);
  const [lista, setLista] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getLista();
    getUserData();
  },[]);

  const getLista = async () => {
    try{
      const userToken = await AsyncStorage.getItem('userToken');
      axios.get("https://dali-web.herokuapp.com/api/profesionales",{
        headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
          'Authorization': 'Bearer '+userToken,
          "Access-Control-Allow-Origin": "*", 
        }
      }).then((res) => {
        console.log(res.data);
        setLista(res.data);
        setIsReady(true);
      }).catch((error) => {
        console.log("Error en llamada o setteo:"+error);
        Alert.alert("Error","No se encuentra la lista de profesionales.\nPor favor, verifique su conexión");
      });
    }catch (err){
      console.log("Algo pasó con la función getLista:"+err.message);
    }
  }

  const getUserData = async () => {
    try{
      const jsonValue = await AsyncStorage.getItem('userData');
      setUserData(JSON.parse(jsonValue));
    }catch(err){
      console.log("Error al obtener datos del usuario"+err.message);
    }
  }
  
  const { colors } = useTheme();
  const theme = useTheme();

  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data, user, navigation) => {
    const email = Object.getOwnPropertyDescriptor(user,'email')
    const id = Object.getOwnPropertyDescriptor(user,'id')
    Object.defineProperty(data,'email',email);
    Object.defineProperty(data,'id_usuario',id);
    try{
      const userToken = await AsyncStorage.getItem('userToken');
      axios.post("https://dali-web.herokuapp.com/api/new",{
        desde: data.desde,
        email: data.email,
        fecha: data.fecha,
        hasta: data.hasta,
        id_profesional: data.id_profesional,
        id_usuario: data.id_usuario,
        motivo: data.motivo,
        nombrePaciente: data.nombrePaciente,
        telefono: data.telefono,
      },{ 
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': 'Bearer '+userToken,
          "Access-Control-Allow-Origin": "*", 
        }
      }).then(async(response) => {
          console.log(response.status);
          Alert.alert("Creación exitosa","El turno se ha creado exitosamente!",[{text: "OK",onPress: () => navigation.navigate("Home")}],{cancelable: false});
      }).catch((error) => {
        console.log(error.message);
        Alert.alert("Error","El turno no pudo crearse. Verifique su conexión o vuelva a intentar más tarde");
      });
    }catch(err){
      console.log(err);
    }
  };


  return(
    <ScrollView style={styles.container}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <View style={styles.action}>
        <Text style={{color: colors.text,fontWeight:'bold',fontSize: 20}}>Ingrese los siguientes datos</Text>
      </View>
      <View style={styles.action}>
      
      <Controller
        control={control}
        rules={{ required: true, maxLength: 45 }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:350}}
            mode= 'outlined'
            label="Nombre del paciente"
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="account-child"/>}
          />
        )}
        name="nombrePaciente"
        defaultValue=""
      />
      </View>
      {errors.nombrePaciente && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, ingresar nombre.</Text></View>}
      <View style={styles.action}>
      
      <Controller
        control={control}
        rules={{ required: true }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:350}}
            mode= 'outlined'
            label="Teléfono"
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            keyboardType="numeric"
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="cellphone"/>}
          />
        )}
        name="telefono"
        defaultValue=""
      />
      </View>
      {errors.telefono && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, ingresar teléfono.</Text></View>}
      <View style={styles.action}>
      <Controller
        control={control}
        rules={{ required: true, minLength: 10, maxLength: 10 }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:350}}
            mode= 'outlined'
            label="Fecha"
            placeholder="DD-MM-AAAA"
            render={props =>
              <MaskedTextInput
                {...props}
                mask="99-99-9999"
              />
            }
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            keyboardType="numeric"
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="calendar"/>}
          />
        )}
        name="fecha"
        defaultValue=""
      />
      
      </View>
      {errors.fecha && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, ingresar fecha.</Text></View>}
      <View style={styles.action}>
      
      <Controller
        control={control}
        rules={{ required: true, minLength: 5, maxLength: 5  }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:150,marginRight:5}}
            mode= 'outlined'
            label="Desde"
            placeholder="00:00"
            render={props =>
              <MaskedTextInput
                {...props}
                mask="99:99"
              />
            }
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            keyboardType="numeric"
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="clock-outline"/>}
          />
        )}
        name="desde"
        defaultValue=""
      />
      <Controller
        control={control}
        rules={{ required: true, minLength: 5, maxLength: 5 }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:150,marginLeft:5}}
            mode= 'outlined'
            label="Hasta"
            placeholder="00:00"
            render={props =>
              <MaskedTextInput
                {...props}
                mask="99:99"
              />
            }
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            keyboardType="numeric"
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="clock-outline"/>}
          />
        )}
        name="hasta"
        defaultValue=""
      />
      </View>
      {(errors.desde || errors.hasta) && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, ingresar horario.</Text></View>}
      <View style={styles.action}>
      <Controller
        control={control}
        rules={{ required: true, maxLength: 100 }}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={{width:350}}
            mode= 'outlined'
            label="Motivo"
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            theme={{ colors: { primary: '#87CEEB',underlineColor:'transparent',}}}
            left={<TextInput.Icon name="clipboard-outline"/>}
          />
        )}
        name="motivo"
        defaultValue=""
      />
      </View>
      {errors.motivo && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, ingresar motivo.</Text></View>}
      <View style={styles.action}>
      <View style={theme.dark ? styles.light : styles.dark}>
      {isReady ?
      <Controller
        control={control}
        rules={{ required: true}}
        render={({field: { onChange, value }}) => (
          <Picker
            style={theme.dark ? styles.lightPicker : styles.darkPicker}
            selectedValue={value}
            onValueChange={value => onChange(value)}
          >
          <Picker.Item label="Elegir profesional" value=""/>
          {lista.map((item) => {
            return <Picker.Item label={item.nombre+" "+item.apellido+" ("+item.email+")"} value={item.id} key={item.id}/>
          })}
          </Picker>
        )}
        name="id_profesional"
        defaultValue=""
      />
      :
      <ActivityIndicator size='large' color="#808080"/>
      }
      </View>
      </View>
      {errors.id_profesional && <View style={styles.error}><Text style={{color: '#FF0000'}}>Por favor, seleccionar profesional.</Text></View>}
      <View style={styles.action}>
      <Button 
        color='#009387'
        title="Confirmar" 
        onPress={handleSubmit(data => onSubmit(data,userData,navigation))}
      />
      </View>
    </ScrollView>
  );
}

export default CreateScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      paddingBottom: 5,
	    alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      flexDirection: 'row',
      marginTop: 5,
      paddingBottom: 5,
	    alignItems: 'center',
      justifyContent: 'center',
    },
    light: {
      borderWidth: 1, 
      borderColor: 'grey', 
      borderRadius: 4 
    },
    dark : {
      borderWidth: 1, 
      borderColor: 'grey', 
      borderRadius: 4 
    },
    lightPicker: {
      height: 50, 
      width: 350, 
      color:"white"
    },
    darkPicker: {
      height: 50, 
      width: 350, 
      color:"black"
    },
});