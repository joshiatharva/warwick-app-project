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

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: true,
      error: null,
      search: '',
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Icon
          name='plus'
          size={10}
          onPress={() => {navigation.navigate("MakeQuestion")}}
        />
      ),
    };
  }

  async componentDidMount() {
    this.getQuestions();
    //setInterval(() => this.getQuestions(), 2000);
  }

  async getQuestions() {
    try {
      const token = await AsyncStorage.getItem("id");
      let response = await fetch('http://172.31.199.57:3000/questions/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      let json = await response.json();
      this.setState({questions: json, isLoading: false});
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
    } catch (err) {
      this.setState({error: err}, () => console.log("Error: " + this.state.error));
    }
  }

  async getData() {
    const token = await AsyncStorage.getItem("id");
    try {
      let response = await fetch(`http://172.31.199.57:3000/questions/${this.state.topic}/${this.state.search}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,  
        }
      });
      let res = await response.json();
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
      if (res.success) {
        this.setState({questions: res.json});
      }
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
    } catch (err) {
      console.log("Error occurred: " + err);
    }

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
      if (res.success == true) {
        console.log(res);
      }
      if (res.msg == "Token expired") {
        this.props.navigation.navigate("Login");
        alert("Unfortunately, your token has expired! Please sign in again!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getQuestion(item) {
    console.log(item);
    this.props.navigation.navigate("ViewQuestion", {
      id: item
    });
  }

  render() {
      return (
        <ScrollView>
          <SearchBar 
          onChangeText={(item) => this.setState({search: item})}
          onClearText={()=> this.setState({search: ''})}
          lightTheme
          placeholder='Enter here....'
          />
          <FlatList 
            data={this.state.questions}
            renderItem = {({item, index}) =>
              <ListItem
                title={item.name}
                subtitle={item.topic}
                bottomDivider
                chevron
                onPress={() => this.getQuestion(item)}
              />
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      );
  }
}