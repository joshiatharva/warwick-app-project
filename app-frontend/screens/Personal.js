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

export default class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
    }
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem("id");
    let response = await fetch("http://172.31.199.57:3000/user/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    let res = await response.json();
    this.setState({user: res.user}, function(err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log("User: " + this.state.user);
      }
    });
  }

  render() {
    return (
      <View>
        <Text>Last sessions:</Text>
        <Text>Questions you've made:</Text>
        <ScrollView></ScrollView>
        <Text>Question History:</Text>
        {/* <ListView /> */}
        <Text>Average time spent on questions:</Text>
       { /* add chart here  */}
      </View>
    );
  }
}