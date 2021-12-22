import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import UserInfoScreen from './UserInfoScreen';
import AboutScreen from './AboutScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const UserInfoStack = createStackNavigator();
const AboutStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Main"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: 'Turnos',
          tabBarColor: '#1f65ff',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserInfoStackScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarColor: '#d02860',
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutStackScreen}
        options={{
          tabBarLabel: 'Info',
          tabBarColor: '#694fad',
          tabBarIcon: ({ color }) => (
            <Icon name="information-circle" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#009387',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#009387' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </HomeStack.Navigator>
  );
  
  const DetailsStackScreen = ({navigation}) => (
    <DetailsStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#1f65ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <DetailsStack.Screen name="Turnos" component={DetailsScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#1f65ff' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </DetailsStack.Navigator>
  );

  const UserInfoStackScreen = ({navigation}) => (
    <UserInfoStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#d02860',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <UserInfoStack.Screen name="Perfil" component={UserInfoScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#d02860' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </UserInfoStack.Navigator>
  );

  const AboutStackScreen = ({navigation}) => (
    <AboutStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#694fad',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight:'bold'
      }
    }}>
      <AboutStack.Screen name="Info" component={AboutScreen} options={{
        headerLeft: () => (
          <Icon.Button 
          name='menu' size={25} 
          backgroundColor='#694fad' 
          onPress={() => navigation.openDrawer()}>
          </Icon.Button>
        )
      }}/>
      
    </AboutStack.Navigator>
  );

  export default MainTabScreen;