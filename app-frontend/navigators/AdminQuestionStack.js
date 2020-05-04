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

import AdminQuestions from '../screens/admin/AdminQuestions';
import AdminViewQuestion from '../screens/admin/AdminViewQuestion';
import MakeQuestion from '../screens/MakeQuestion';
import EditQuestion from '../screens/admin/EditQuestion';
import TestQuiz from '../screens/admin/TestQuiz';
import CheckAnswer from '../screens/admin/CheckAnswer';

const AdminQuestionStack = createStackNavigator({
  Questions: {
    screen: AdminQuestions,
  },
  AdminViewQuestion: {
    screen: AdminViewQuestion,
  },
  MakeQuestion: {
    screen: MakeQuestion,
  },
  EditQuestion: {
    screen: EditQuestion,
  },
  TestQuiz: {
    screen: TestQuiz,
  },
  CheckAnswer: {
    screen: CheckAnswer,
    navigationOptions: {
      headerShown: false,
    },
  },
});

AdminQuestionStack.navigationOptions = {
  tabBarLabel: 'Questions',
  initialRouteName: 'Questions'
};  


export default AdminQuestionStack;