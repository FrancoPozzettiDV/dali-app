import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../components/context';

const SignInScreen = () => {
    
    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidEmail:true,
        isValidPassword:true,
    });
    const [loading, setLoading] = React.useState(false);

    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if( val.includes("@") && (val.includes(".com") || val.includes(".ar") )) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true,
                isValidEmail: true
            });
        }else{
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if(val.trim().length >= 8){
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        }else{
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidEmail = (val) => {
        if( val.includes("@") && (val.includes(".com") || val.includes(".ar") )) {
            setData({
                ...data,
                isValidEmail: true
            });
        }else{
            setData({
                ...data,
                isValidEmail: false
            });
        }
    }
    
    const loginHandle = (email,password) => {
        if(data.email.length == 0 || data.password.length == 0){
            Alert.alert("Campos vacíos","Por favor, completar los campos");
        }else{
            if(data.isValidEmail && data.isValidPassword){
                //setLoading(true);
                signIn(email, password);
            }else{
                Alert.alert("Datos invalidos","Por favor, verificar los datos ingresados");
				//setLoading(false);
            }
        }
    }
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' style='light' />
            <View style={styles.header}>
                <Text style={styles.text_header}>Cada pequeño paso cuenta hacia un mejor mañana...</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    <Icon name= 'person-outline' color='#05375a' size={20}/>
                    <TextInput placeholder="Ingresar Email" style={styles.textInput} autoCapitalize='none'
                    onChangeText={(val) => textInputChange(val)} onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}/>
                    {data.check_textInputChange ? 
                    <Animatable.View animation="bounceIn">
                        <Icon name= 'checkmark-circle' color='green' size={20}/>
                    </Animatable.View>
                    : null}
                </View>
                {data.isValidEmail ? null :
                <Animatable.View animation='fadeInLeft' duration={500}>
                    <Text style={styles.errorMsg}>El campo debe contener un email valido</Text>
                </Animatable.View>
                }
                <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
                <View style={styles.action}>
                    <Icon name= 'lock-closed-outline' color='#05375a' size={20}/>
                    <TextInput placeholder="Ingresar Contraseña" secureTextEntry={data.secureTextEntry ? true : false} style={styles.textInput} autoCapitalize='none'
                    onChangeText={(val) => handlePasswordChange(val)}/>
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? 
                        <Icon name= 'eye' color='grey' size={20}/>
                        :
                        <Icon name= 'eye-off' color='grey' size={20}/>
                        }
                    </TouchableOpacity>
                </View>
                {data.isValidPassword ? null : 
                <Animatable.View animation='fadeInLeft' duration={500}>
                    <Text style={styles.errorMsg}>La contraseña debe tener 8 caracteres mínimo</Text>
                </Animatable.View>
                }
                <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={() =>{loginHandle(data.email, data.password)}}>
                        <LinearGradient colors={['#08d4c4','#01ab9d']} style={styles.signIn}>
                            <Text style={[styles.textSign,{color:'#fff'}]}>Iniciar Sesión</Text>
                        </LinearGradient>
                        </TouchableOpacity>
                </View>
                {loading &&
                <View style={{marginTop:20}}> 
                    <ActivityIndicator size='large' color="#808080"/>
                </View>
                }
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        //marginTop
        paddingLeft: 10,
        color: '#05375a'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize:14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});