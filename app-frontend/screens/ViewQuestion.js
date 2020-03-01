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
        let response = await fetch('http://172.31.199.57:3000/questions/save',{
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