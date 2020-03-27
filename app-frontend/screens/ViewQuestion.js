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

export default class ViewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      q_type: '',
    };
  }

  async componentDidMount() {
    var qid = this.props.navigation.getParam('id');
    console.log(qid);
    this.setState({question: qid}); 
  }

  async saveQuestion(id) {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://192.168.0.12:3000/questions/save',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "question_id": id
        })
      });
      let res = await response.json();
      if (res.success == true) {
        alert("Question has been saved to Favourites!");
      }
      // console.log(res.message);
    } catch (err) {
      // console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <Card style={styles.container}>
      <Text>Name: {this.state.question.name}</Text>
        <Text>Topic: {this.state.question.topic}</Text>
        <Text>Type of question: {this.state.question.type}</Text>
        <Text>{this.state.question.accesses} people have tried this question!</Text>
        <Text>Mean mark: {this.state.question.correct / this.state.question.accesses > 0 ? this.state.question.correct / this.state.question.accesses : 0}</Text>
        <Button title="Add to Favourites" onPress={() => this.saveQuestion(this.state.question._id)} />
      </Card>
      </View>
    );
  }
}