import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { Alert, StyleSheet, Text, ScrollView, View, Picker, ActivityIndicator } from 'react-native';
import { Divider, RadioButton, Button, List } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function TreatmentScreen({navigation}){
    
    const { colors } = useTheme();
    const theme = useTheme();

    const [lista, setLista] = React.useState([]);
    const [isReady, setIsReady] = React.useState(false);
    const [selectedProf, setSelectedProf] = React.useState('');
    const [value1, setValue1] = React.useState('');
    const [value2, setValue2] = React.useState('');
    const [value3, setValue3] = React.useState('');
    const [value4, setValue4] = React.useState('');
    const [value5, setValue5] = React.useState('');
    const [value6, setValue6] = React.useState('');
    const [value7, setValue7] = React.useState('');
    const [value8, setValue8] = React.useState('');

    const getData = async () => {
      try {
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
      } catch(e) {
        console.log("No hay userData en async"+e);
      }
    }
    
    useEffect(() => {
      getData();
    },[]);

    const enviarFormulario = async () => {
      try{
          if(value1 === '' || value2 === '' || value3 === '' || value4 === '' || value5 === '' || value6 === '' || value7 === ''|| value8 === '' || selectedProf === ''){
            Alert.alert("Campos vacíos","Por favor, completar el formulario...");
          }else{
            const userToken = await AsyncStorage.getItem('userToken');
            axios.post("https://dali-web.herokuapp.com/api/form",{
              pregunta1: value1,
              pregunta2: value2,
              pregunta3: value3,
              pregunta4: value4,
              pregunta5: value5,
              pregunta6: value6,
              pregunta7: value7,
              pregunta8: value8,
              id_profesional: selectedProf,
            },{ 
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': 'Bearer '+userToken,
                "Access-Control-Allow-Origin": "*", 
              }
            }).then(async(response) => {
                console.log(response.status);
                Alert.alert("Envío exitoso","Los datos se han enviado exitosamente!",[{text: "OK",onPress: () => navigation.navigate("Home")}],{cancelable: false});
            }).catch((error) => {
              console.log(error.message);
              Alert.alert("Error","Envío fallido. Verifique su conexión o vuelva a intentar más tarde");
            });
          }
      }catch(e){
        console.log("No se pudo enviar los datos"+e);
      }
    }
    
    return(
      <ScrollView style={styles.container}>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <Text style={{color: '#2296F2',fontWeight:'bold',textAlign: 'center', marginTop: 20}}>Completar solamente cuando su doctor/a lo pida...</Text>
        <View style={{marginTop: 20}}>
        
        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Se cumplieron los objetivos planteados del período?</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue1(newValue)} value={value1}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="Parcialmente" value="Parcialmente" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>

        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Se pudieron aplicar las estrategias indicadas?</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue2(newValue)} value={value2}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="Con dificultad" value="Con dificultad" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>

        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Resultaron efectivas las estrategias aplicadas?</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue3(newValue)} value={value3}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="Parcialmente" value="Parcialmente" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>

        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Se observan avances en la comprensión verbal?</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue4(newValue)} value={value4}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>
        
        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Mejoró su inteligibilidad del habla?</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue5(newValue)} value={value5}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>

        <List.Section>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>¿Se observan avances en la expresión verbal en cuanto a...</List.Subheader>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>Vocabulario</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue6(newValue)} value={value6}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>Contenido</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue7(newValue)} value={value7}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        <List.Subheader style={{backgroundColor: '#2296F2', fontWeight:'bold', color: '#333333'}}>Estructura</List.Subheader>
        <RadioButton.Group onValueChange={newValue => setValue8(newValue)} value={value8}>
          <RadioButton.Item label="Sí" value="Sí" color='#FF4081' labelStyle={{color: colors.text}}/>
          <Divider />
          <RadioButton.Item label="No" value="No" color='#FF4081' labelStyle={{color: colors.text}}/>
        </RadioButton.Group>
        </List.Section>
        
        </View>
        
        <View style={styles.action}>
        <View style={theme.dark ? styles.light : styles.dark}>
        {isReady ?
        <Picker
            style={theme.dark ? styles.lightPicker : styles.darkPicker}
            selectedValue={selectedProf}
            onValueChange={value => setSelectedProf(value)}
          >
          <Picker.Item label="Elegir profesional" value=""/>
          {lista.map((item) => {
            return <Picker.Item label={item.nombre+" "+item.apellido+" ("+item.email+")"} value={item.id} key={item.id}/>
          })}
          </Picker>
        :
        <ActivityIndicator size='large' color="#808080"/>
        }
        </View>
        </View>
        <View style={{marginTop: 20, marginBottom: 20, alignItems:'center',justifyContent:'center'}}>
        <Button icon="email-outline" color="green" mode="contained" onPress={() => enviarFormulario()}>Enviar</Button>
        </View>
      </ScrollView>
      
    );
}

export default TreatmentScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      paddingBottom: 5
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