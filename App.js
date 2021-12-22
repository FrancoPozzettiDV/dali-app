import React, {useEffect} from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import MainTabScreen from './screens/MainTabScreen';
import TreatmentScreen from './screens/TreatmentScreen';
import CreateScreen from './screens/CreateScreen';

import { AuthContext } from './components/context';

import { DrawerContent } from './screens/DrawerContent';

import RootStackScreen from './screens/RootStackScreen';

const Drawer = createDrawerNavigator();
const TreatmentStack = createStackNavigator();
const CreateStack = createStackNavigator();

function App() {
  //const [isLoading, setIsLoading] = React.useState(true);
  //const [userToken, setUserToken] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userMail: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#292d3e',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ){
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userMail: action.mail,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userMail: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(email, password) => {
      let userToken;
      userToken = null;
      axios.post("https://dali-web.herokuapp.com/api/login",{
          email: email,
          password: password,
          device_name: "Android mobile"
        },{ 
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*", 
          }
        }).then(async(response) => {
            console.log(response.status);
            console.log(response.data.token);
            userToken = response.data.token;
            try{
              await AsyncStorage.setItem('userToken', userToken);
            }catch(e){
              console.log("No se pudo setear el userToken"+e);
            }
        }).then(() => {
            axios.get("https://dali-web.herokuapp.com/api/user",{
              headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer '+userToken,
                "Access-Control-Allow-Origin": "*", 
              }
            }).then(async(getUser) => {
              console.log(getUser.status);
              console.log(getUser.data);
              try{
                const jsonValue = JSON.stringify(getUser.data);
                await AsyncStorage.setItem('userData', jsonValue);
                dispatch({ type: 'LOGIN', mail: email, token: userToken});
              }catch(e){
                console.log("No se pudo guardar los datos del usuario en Storage"+e);
              }
            }).catch((error) => {
              console.log(error.response);
              alert("No se pudieron obtener los datos del usuario. Vuelva a intentar más tarde.");
            })
      
        }).catch((error) => {
            console.log(error.response);
            alert("Se ha producido un error: Usuario no registrado o falta de conexión");
      });
      
    },
    signOut: async() => {
      
      let userToken;
      try{
        userToken = await AsyncStorage.getItem('userToken');
        console.log("token obtenido del storage");
        console.log(userToken);
      }catch(e){
        console.log(e);
      }
      axios.post("https://dali-web.herokuapp.com/api/logout",{ hello: 'world'},{
          headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'Authorization': 'Bearer '+userToken,
            "Access-Control-Allow-Origin": "*", 
          }
          }).then(async(response) => {
            console.log(response.data.message);
            console.log("El token ha sido eliminado del servidor");
            try{
              await AsyncStorage.removeItem('userToken');
              console.log("El token ha sido eliminado del storage");
            }catch(e){
              console.log("No se pudo eliminar el token del storage"+e);
            }
          }).catch((error) =>{
            console.log(error.response);
            console.log("Hubo un error al tratar de eliminar el token del servidor");
            alert("Error: Verifique su conexión o vuelva a intentar más tarde");
          });
      dispatch({ type: 'LOGOUT'});
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  useEffect(() => {
    setTimeout(async () =>{
      let userToken;
      userToken = null;
      try{
        userToken = await AsyncStorage.getItem('userToken');
      }catch(e){
        console.log("User token no encontrado en Storage: "+e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  },[]);

  if( loginState.isLoading ){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size='large' color="#808080"/>
      </View>
    );
  }
  
  const TreatmentStackScreen = ({navigation}) => (
    <TreatmentStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#17A2B8',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <TreatmentStack.Screen name="Test de Avance" component={TreatmentScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#17A2B8' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </TreatmentStack.Navigator>
  );

  const CreateStackScreen = ({navigation}) => (
    <CreateStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <CreateStack.Screen name="Nuevo Turno" component={CreateScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#009387' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </CreateStack.Navigator>
  );

  return (
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={theme}>
        { loginState.userToken !== null ? (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} options={{headerShown: false}}/>
          <Drawer.Screen name="Treatment" component={TreatmentStackScreen} options={{headerShown: false}}/>
          <Drawer.Screen name="Create" component={CreateStackScreen} options={{headerShown: false}}/>
          </Drawer.Navigator>
        )
        :
          <RootStackScreen/>
        }
      </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
  );

  
}

export default App;
