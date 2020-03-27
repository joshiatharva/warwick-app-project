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


export default class Accordion extends Component {
    constructor() {
      super();
      this.state = {
        question: [],
        expanded: false,
      };
    }
  
    componentDidMount() {
      this.setState({question: this.props.question});
    }
  
    render() {
      return (
        <Card>
          <View>
            <Text>{this.state.question.name}</Text>
            <Icon />
          </View>
          {this.state.expanded && (
            <View>
              <Text>Topic: {this.state.question.topic}</Text>
              <Text>Type: {this.state.question.type} </Text>
              <Text>Question: {this.state.question.question}</Text>
              <Text>Mean:</Text>
              <Text>{this.state.question.correct / this.state.question.accesses}</Text>
            </View>
          )}
        </Card>
      );
    }
  }