import React, {useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DrawerContent(props){
    
    const paperTheme= useTheme();

    const { signOut, toggleTheme } = React.useContext(AuthContext);

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
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image source={require('../assets/avatar.png')} size={64} style={{backgroundColor: "grey"}}/>
                            <View style={{marginLeft: 15, flexDirection:'column'}}>
                                <Title style={styles.title}>{userData.nombre} {userData.apellido}</Title>
                                <Caption style={styles.caption}>@{userData.usuario}</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                        icon={({color,size}) =>(
                            <Icon name='home-outline' color={color} size={size}/>
                        )}
                        label="Home"
                        onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem
                        icon={({color,size}) =>(
                            <Icon name='calendar-outline' color={color} size={size}/>
                        )}
                        label="Turnos"
                        onPress={() => {props.navigation.navigate('Appointment')}}
                        />
                        <DrawerItem
                        icon={({color,size}) =>(
                            <Icon name='person-circle-outline' color={color} size={size}/>
                        )}
                        label="Perfil"
                        onPress={() => {props.navigation.navigate('User')}}
                        />
                        <DrawerItem
                        icon={({color,size}) =>(
                            <Icon name='information-circle-outline' color={color} size={size}/>
                        )}
                        label="Info"
                        onPress={() => {props.navigation.navigate('About')}}
                        />
                        {userData.id_perfil == 3 &&
                        <DrawerItem
                        icon={({color,size}) =>(
                            <Icon name='body-outline' color={color} size={size}/>
                        )}
                        label="Formulario"
                        onPress={() => {props.navigation.navigate('Treatment')}}
                        />
                        }
                    </Drawer.Section>
                    <Drawer.Section title="Preferencias">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Mode</Text>
                                <View pointerEvents="none">
                                <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color,size}) =>(
                        <Icon name='log-out' color={color} size={size}/>
                    )}
                    label="Cerrar Sesión"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection:{
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    }
});