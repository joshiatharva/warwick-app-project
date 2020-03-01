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


export default class AdminLogin extends Component {
    constructor(props) {
      super(props);
      this.state = {
        question: [],
        isLoading: false,
        isSending: false,
        err: '',
        answer: ','
      }
    }
  
    async componentDidMount() {
      this.setState({isLoading: true})
      let token = await AsyncStorage.getItem("admin");
      let response = await fetch("http://172.31.199.57:3000/admin/2fa", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      });
      let res = await response.json();
      if (res.success === true) {
        this.setState({question: res.question, isLoading: false})
      } else {
        this.setState({isLoading: false, err: res.message});
        if (res.msg == "Token expired") {
          this.props.navigation.navigate("Login");
          alert("Unfortunately, your token has expired!");
        }
      }
    }
  
    async sendData() {
      this.setState({isSending: true});
      let adminToken = await AsyncStorage.getItem("admin");
      let response = await fetch("http://172.31.199.57:3000/admin/2fa", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + adminToken
        },
        body: JSON.stringify({
          question: this.state.question,
          answer: this.state.answer,
        })
      });
      let res = await response.json();
      if (res.success === true) {
        this.setState({isSending: false});
        this.props.navigation.navigate("AdminHomepage");
      }
    }
  
    render() {
      if (!this.state.err) {
          return (
            <View styles={styles.formContainer}>
              <Text>Password confirmed! For security reasons, please enter the relevant answer to the provided security question!</Text>
              <Text>{this.state.question}</Text>
              <Input placeholder="Enter your answer here!" onChangeText={(text) => this.setState({answer: text})} />
              <Button title="Submit your answer!" loading={this.state.isSending} onPress={() => this.sendData()} />
            </View>
          );
      } else {
        return (
          <View style={styles.formContainer}>
            <Text>Sorry, the page has developed the following error:</Text>
            <Text>{this.state.err}</Text>
            <Button title="Go Back to Login" onPress={() => this.props.navigation.goBack()}/>
          </View>
        )
      }
    }
  }