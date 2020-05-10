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
import styles from '../style/styles';

export default class AnswerScheme extends Component {
    render() {
      /**
       * Checks whether the question has been answered.
       */
      if (this.props.isAnswered) {
        return (
          /**
           * Renders a message for the correct answer.
           */
          <View>
            {this.props.correct && (
              <Text>Congratulations! You answered {this.props.givenAnswer} and the answer was {this.props.answer}!</Text>
            )}
            {/**
             * Renders a message in the case of an incorrect answer. 
            */}
            {!this.props.correct && (
              <Text>Sorry! Whereas you picked {this.props.givenAnswer}, the answer was {this.props.answer}!</Text>
            )}
            {/**
             * Displays the question's solution
             * for the problem for users to understand
             */}
            <Text>Here's the solution:</Text>
            <Text>{this.props.answerScheme}</Text>
          </View>
        );
      } else {
        return false;
      }
    }
  }