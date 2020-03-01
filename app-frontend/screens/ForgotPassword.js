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

export default class ForgotPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: null,
      received: false,
      error: false
    }
  }

  async sendData() {
    let response = await fetch('http://172.31.199.57:3000/auth/forgot', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer"
      },
      body: JSON.stringify({
        "email": this.state.email,
        "url" : initialUrl,
        "path": "forgotpassword"
      })
    });
    let res = await response.json();
    if (res.message == "/") {
      alert("You have already logged in and have a token present on your device. Please log into your account and reset your password from there!");
      this.props.navigation.goBack();
    }
    if (res.success == "true") {
      this.setState({received: true});
      await AsyncStorage.setItem("forgot_Token", res.msg);
      await AsyncStorage.setItem("id_token", res.id);
    } else {
      alert("Our email sending service might be down at this time. Please try again in a few minutes!");
      this.props.navigation.goBack();
    }
    
  }

  render() {
    if (!this.state.received) {
      return (
        <View style={styles.container}>
          <Button type="clear" onPress={() => this.props.navigation.goBack()} />
          <Text style={styles.forgotPasswordLabel} category="h4" status="control">Forgot Password</Text>
          <Text style={styles.enterEmail} status='control'>Please enter your username to receive your reset password link:</Text>
          <View style={styles.formCont}>
            <Input placeholder="Enter your username here" onChangeText={(item) => this.setState({email: item})} />
          </View>
          <Button type="outline" raised title="Send link" onPress={() => this.sendData()} />
        </View>
      );
    }
    if (this.state.received) {
      return (
        <View>
          <Text>Your email has been sent to your account at {this.state.email}!</Text>
        </View>
      );
    }
    if (this.state.error) {

    }
  }
}