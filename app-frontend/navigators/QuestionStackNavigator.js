import React, { Component } from 'react';
import { StyleSheet, View,  FlatList, AsyncStorage, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Platform, Alert, InputAccessoryView, ListView } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { SearchBar, CheckBox, Button, ListItem, Slider, Avatar, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import { Linking } from 'expo';
// import Canvas from 'react-native-canvas';
// import SlidingUpPanel from 'rn-sliding-up-panel';
// import MathJax from 'react-native-mathjax';
import { ApplicationProvider, Select, Text, Card, Datepicker, Input, Layout, TopNavigation, TabView} from '@ui-kitten/components';
//import * as UI from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit"


const questionStackNavigator = createStackNavigator({
    Questions: {
      screen: Questions,
    },
    MakeQuestion: {
      screen: MakeQuestion,
    },
    ViewQuestion: {
      screen: ViewQuestion,
    },
  });
  
  questionStackNavigator.navigationOptions = {
    tabBarLabel: 'Questions',
    initialRouteName: 'Questions',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'purple',
        color: 'white',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  };

export default questionStackNavigator;