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
import { ContributionGraph, StackedBarChart, ProgressChart } from "react-native-chart-kit";

import Questions from '../screens/Questions';
import ViewQuestion from '../screens/ViewQuestion';
import MakeQuestion from '../screens/MakeQuestion';


const QuestionStack = createStackNavigator({
  Questions: {
    screen: Questions,
  },
  ViewQuestion: {
    screen: ViewQuestion,
  },
  MakeQuestion: {
    screen: MakeQuestion,
  },
});

QuestionStack.navigationOptions = {
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

export default QuestionStack;