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

import FavouriteStack from './FavouriteStack';
import Quiz from '../screens/Quiz';
import DataUpload from '../screens/DataUpload';

const QuestionSwitch = createSwitchNavigator({
  Favourites: FavouriteStack,
  Quiz: {
    screen: Quiz,
  },
  DataUpload: {
    screen: DataUpload,
  }
});

QuestionSwitch.navigationOptions = { 
  tabBarLabel: 'Favourites',
  initialRouteName: 'Favourites',
  // tabBarVisible: navigation.state.getParam("hideTabBar") != null ? !(navigation.state.getParam("hideTabBar")) : true,
};

export default QuestionSwitch;