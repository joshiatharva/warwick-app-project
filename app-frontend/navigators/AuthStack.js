import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, ActivityIndicator, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView, RefreshControl, Modal } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'expo';
import { ApplicationProvider, Select, Text, Card, Datepicker, TopNavigation, TabView} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit"

import Login from '../screens/Login'
import ForgotPassword from '../screens/ForgotPassword'

import Register from '../screens/Register'

const AuthStack = createStackNavigator({
    Login: {
      screen: Login,
      path: '',
      navigationOptions: {
        headerShown: false,
      },
    },
    Forgot: {
      screen: ForgotPassword,
      navigationOptions: {
        headerShown: false,
      },
    },  
    Register: {
      screen: Register,
      navigationOptions: {
        headerShown: false,
      },
    },
});

export default AuthStack;